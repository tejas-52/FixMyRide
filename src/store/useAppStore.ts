import { create } from 'zustand';
import { AppState, UserRole, Request, ServiceType, Vehicle, Activity, User } from '../types';
import { 
  auth, 
  db, 
  signInWithGoogle, 
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
  FirebaseUser
} from '../firebase';

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

  // Actions
  init: () => void;
  signIn: () => Promise<void>;
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

  init: () => {
    onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
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
        
        set({ user: userData, role: userData.role, loading: false });

        // Listen for user's vehicles
        onSnapshot(query(collection(db, 'vehicles'), where('ownerUid', '==', firebaseUser.uid)), (snapshot) => {
          const vehicles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vehicle));
          set({ vehicles });
        });

        // Listen for user's activities
        onSnapshot(query(collection(db, 'activities'), where('userUid', '==', firebaseUser.uid)), (snapshot) => {
          const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
          set({ activities });
        });

        // Listen for active request
        onSnapshot(query(collection(db, 'requests'), where('customerUid', '==', firebaseUser.uid), where('status', 'in', ['PENDING', 'ACCEPTED'])), (snapshot) => {
          if (!snapshot.empty) {
            const request = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Request;
            set({ activeRequest: request });
            if (request.status === 'ACCEPTED') {
              set({ appState: 'USER_TRACKING' });
            } else {
              set({ appState: 'USER_FINDING' });
            }
          } else {
            // Check if mechanic has an active request
            onSnapshot(query(collection(db, 'requests'), where('mechanicUid', '==', firebaseUser.uid), where('status', '==', 'ACCEPTED')), (snapshot) => {
              if (!snapshot.empty) {
                const request = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Request;
                set({ activeRequest: request, appState: 'MECHANIC_NAV' });
              }
            });
          }
        });

        // Listen for all pending requests (for mechanics)
        onSnapshot(query(collection(db, 'requests'), where('status', '==', 'PENDING')), (snapshot) => {
          const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Request));
          set({ availableRequests: requests });
        });

      } else {
        set({ user: null, loading: false, appState: 'USER_HOME', activeRequest: null });
      }
    });
  },

  signIn: async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
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
    if (!user) return;
    
    await addDoc(collection(db, 'requests'), {
      ...requestData,
      customerUid: user.uid,
      status: 'PENDING',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
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
