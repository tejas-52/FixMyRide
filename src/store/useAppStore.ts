import { create } from 'zustand';
import { AppState, UserRole, Request, ServiceType, Vehicle, Activity, User } from '../types';
import { 
  auth, 
  db, 
  signInWithGoogle, 
  signInEmail,
  signUpEmail,
  logOut, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  onAuthStateChanged,
  FirebaseUser,
  signInAnonymously
} from '../firebase';
import { handleFirestoreError, OperationType } from '../services/errorService';

interface AppStore {
  user: User | null;
  loading: boolean;
  role: UserRole;
  appState: AppState;
  activeRequest: Request | null;
  breakdownLocation: string;
  selectedServiceId: string;
  vehicles: Vehicle[];
  activities: Activity[];
  availableRequests: Request[];
  isTripStarted: boolean;
  unsubscribes: (() => void)[];

  // Actions
  init: () => void;
  cleanup: () => void;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signOut: () => Promise<void>;
  setRole: (role: UserRole) => void;
  setAppState: (state: AppState) => void;
  setActiveRequest: (request: Request | null) => void;
  setBreakdownLocation: (location: string) => void;
  setSelectedServiceId: (id: string) => void;
  setIsTripStarted: (isStarted: boolean) => void;
  setAvailableRequests: (requests: Request[]) => void;
  
  toggleRole: () => void;
  createRequest: (request: Omit<Request, 'id' | 'status' | 'customerUid'>) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  completeRequest: (requestId: string) => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'ownerUid'>) => Promise<void>;
  resetApp: () => void;
  enterDemoMode: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: null,
  loading: true,
  role: 'USER',
  appState: 'USER_HOME',
  activeRequest: null,
  breakdownLocation: '',
  selectedServiceId: 'puncture',
  vehicles: [],
  activities: [],
  availableRequests: [],
  isTripStarted: false,
  unsubscribes: [],

  cleanup: () => {
    const { unsubscribes } = get();
    console.log(`Cleaning up ${unsubscribes.length} listeners...`);
    unsubscribes.forEach(unsub => unsub());
    set({ unsubscribes: [] });
  },

  init: () => {
    const { cleanup } = get();
    
    const authUnsub = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      cleanup(); // Clean up existing listeners on auth change
      
      if (firebaseUser) {
        try {
          // Fetch or create user profile
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          let userData: User;
          if (!userDoc.exists()) {
            userData = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Anonymous',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
              role: 'USER',
              createdAt: serverTimestamp(),
            };
            await setDoc(userDocRef, userData);
          } else {
            userData = userDoc.data() as User;
          }
          
          const initialAppState = userData.role === 'MECHANIC' ? 'MECHANIC_LIST' : 'USER_HOME';
          set({ user: userData, role: userData.role, loading: false, appState: initialAppState });

          const newUnsubs: (() => void)[] = [];

          // Listen for user's vehicles
          const vehiclesUnsub = onSnapshot(
            query(collection(db, 'vehicles'), where('ownerUid', '==', firebaseUser.uid)), 
            (snapshot) => {
              const vehicles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
              set({ vehicles });
            },
            (error) => handleFirestoreError(error, OperationType.GET, 'vehicles')
          );
          newUnsubs.push(vehiclesUnsub);

          // Listen for user's activities
          const activitiesUnsub = onSnapshot(
            query(collection(db, 'activities'), where('userUid', '==', firebaseUser.uid)), 
            (snapshot) => {
              const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
              set({ activities });
            },
            (error) => handleFirestoreError(error, OperationType.GET, 'activities')
          );
          newUnsubs.push(activitiesUnsub);

          // Listen for active request (as customer)
          const customerRequestUnsub = onSnapshot(
            query(collection(db, 'requests'), where('customerUid', '==', firebaseUser.uid), where('status', 'in', ['PENDING', 'ACCEPTED'])), 
            (snapshot) => {
              if (!snapshot.empty) {
                const request = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Request;
                set({ activeRequest: request });
                if (request.status === 'ACCEPTED') {
                  set({ appState: 'USER_TRACKING' });
                } else {
                  set({ appState: 'USER_FINDING' });
                }
              } else {
                // If no customer request, check if we need to clear activeRequest
                const { activeRequest } = get();
                if (activeRequest && activeRequest.customerUid === firebaseUser.uid) {
                  set({ activeRequest: null });
                }
              }
            },
            (error) => handleFirestoreError(error, OperationType.GET, 'requests (customer)')
          );
          newUnsubs.push(customerRequestUnsub);

          // Listen for active request (as mechanic)
          const mechanicRequestUnsub = onSnapshot(
            query(collection(db, 'requests'), where('mechanicUid', '==', firebaseUser.uid), where('status', '==', 'ACCEPTED')), 
            (snapshot) => {
              if (!snapshot.empty) {
                const request = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Request;
                set({ activeRequest: request, appState: 'MECHANIC_NAV' });
              } else {
                // If no mechanic request, check if we need to clear activeRequest
                const { activeRequest } = get();
                if (activeRequest && activeRequest.mechanicUid === firebaseUser.uid) {
                  set({ activeRequest: null });
                }
              }
            },
            (error) => handleFirestoreError(error, OperationType.GET, 'requests (mechanic)')
          );
          newUnsubs.push(mechanicRequestUnsub);

          // Listen for all pending requests (for mechanics)
          const pendingRequestsUnsub = onSnapshot(
            query(collection(db, 'requests'), where('status', '==', 'PENDING')), 
            (snapshot) => {
              const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Request));
              set({ availableRequests: requests });
            },
            (error) => handleFirestoreError(error, OperationType.GET, 'requests (pending)')
          );
          newUnsubs.push(pendingRequestsUnsub);

          set({ unsubscribes: newUnsubs });

        } catch (error) {
          console.error('Init error:', error);
          set({ loading: false });
        }
      } else {
        // Only set to null if not in demo mode
        const { user } = get();
        if (!user || user.uid !== 'DEMO_USER') {
          set({ user: null, loading: false, appState: 'USER_HOME', activeRequest: null });
        }
      }
    });

    set(state => ({ unsubscribes: [...state.unsubscribes, authUnsub] }));
  },

  enterDemoMode: async () => {
    try {
      set({ loading: true });
      await signInAnonymously(auth);
    } catch (error: any) {
      console.warn('Anonymous Auth disabled, falling back to Local Demo:', error.message);
      
      // Fallback to local mock user if Anonymous Auth is not enabled in Firebase Console
      const demoUser: User = {
        uid: 'LOCAL_DEMO_USER',
        name: 'Demo User (Local)',
        email: 'demo@example.com',
        photoURL: 'https://picsum.photos/seed/demo/200',
        role: 'USER',
        createdAt: serverTimestamp(),
      };
      set({ user: demoUser, role: 'USER', appState: 'USER_HOME', loading: false });
      
      if (error.code === 'auth/admin-restricted-operation') {
        alert('Demo Mode is running locally. To enable real-time database features in Demo Mode, please enable "Anonymous Authentication" in your Firebase Console.');
      }
    }
  },

  signIn: async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  },

  signInWithEmail: async (email, pass) => {
    try {
      await signInEmail(email, pass);
    } catch (error) {
      console.error('Email sign in error:', error);
      throw error;
    }
  },

  signUpWithEmail: async (email, pass) => {
    try {
      await signUpEmail(email, pass);
    } catch (error) {
      console.error('Email sign up error:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await logOut();
      set({ user: null, appState: 'USER_HOME', activeRequest: null });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  },

  setRole: (role) => {
    const { user } = get();
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { role });
    }
    set({ role });
  },

  setAppState: (appState) => set({ appState }),
  setActiveRequest: (activeRequest) => set({ activeRequest }),
  setBreakdownLocation: (breakdownLocation) => set({ breakdownLocation }),
  setSelectedServiceId: (selectedServiceId) => set({ selectedServiceId }),
  setIsTripStarted: (isTripStarted) => set({ isTripStarted }),
  setAvailableRequests: (availableRequests) => set({ availableRequests }),

  toggleRole: () => {
    const { role, user } = get();
    const newRole = role === 'USER' ? 'MECHANIC' : 'USER';
    if (user) {
      updateDoc(doc(db, 'users', user.uid), { role: newRole });
    }
    set({ role: newRole });
  },

  createRequest: async (requestData) => {
    const { user } = get();
    if (!user) {
      console.error('No user found when creating request');
      return;
    }
    
    try {
      console.log('Creating request for user:', user.uid);
      await addDoc(collection(db, 'requests'), {
        ...requestData,
        customerUid: user.uid,
        status: 'PENDING',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log('Request created successfully');
      set({ appState: 'USER_FINDING' }); // Optimistic update
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }
  },

  acceptRequest: async (requestId) => {
    const { user } = get();
    if (!user) return;
    
    await updateDoc(doc(db, 'requests', requestId), {
      status: 'ACCEPTED',
      mechanicUid: user.uid,
      updatedAt: serverTimestamp(),
    });
  },

  completeRequest: async (requestId) => {
    const { user, activeRequest } = get();
    if (!user || !activeRequest) return;
    
    await updateDoc(doc(db, 'requests', requestId), {
      status: 'COMPLETED',
      updatedAt: serverTimestamp(),
    });

    // Add to activities for both
    await addDoc(collection(db, 'activities'), {
      userUid: activeRequest.customerUid,
      date: new Date().toLocaleDateString(),
      service: activeRequest.issueType,
      cost: '₹450',
      status: 'COMPLETED',
      createdAt: serverTimestamp(),
    });

    await addDoc(collection(db, 'activities'), {
      userUid: user.uid,
      date: new Date().toLocaleDateString(),
      service: activeRequest.issueType,
      cost: '₹450',
      status: 'COMPLETED',
      createdAt: serverTimestamp(),
    });

    set({ activeRequest: null, isTripStarted: false });
  },

  addVehicle: async (vehicleData) => {
    const { user } = get();
    if (!user) return;
    
    await addDoc(collection(db, 'vehicles'), {
      ...vehicleData,
      ownerUid: user.uid,
      createdAt: serverTimestamp(),
    });
  },
  
  resetApp: () => {
    logOut();
    set({ user: null, appState: 'USER_HOME', activeRequest: null });
  }
}));
