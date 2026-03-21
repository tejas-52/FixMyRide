import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useAppStore } from './store/useAppStore';
import ErrorBoundary from './components/ErrorBoundary';
import { TopBar, BottomNav } from './components/Layout';
import { LogIn, Car } from 'lucide-react';

// Pages
import { UserHome } from './pages/UserHome';
import { UserFinding } from './pages/UserFinding';
import { UserTracking } from './pages/UserTracking';
import { UserActivity } from './pages/UserActivity';
import { UserVehicles } from './pages/UserVehicles';
import { UserProfile } from './pages/UserProfile';
import { MechanicList } from './pages/MechanicList';
import { MechanicNav } from './pages/MechanicNav';
import { MechanicGarage } from './pages/MechanicGarage';

const LoginScreen = () => {
  const { signIn } = useAppStore();
  
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center text-on-primary mb-8 shadow-2xl shadow-primary/20"
      >
        <Car size={48} />
      </motion.div>
      <h1 className="text-4xl font-black tracking-tighter mb-4">FixMyRide</h1>
      <p className="text-on-surface-variant font-medium mb-12 max-w-xs">
        Professional roadside assistance at your fingertips. Anywhere, anytime.
      </p>
      <button 
        onClick={signIn}
        className="w-full max-w-xs bg-surface-container-low border border-outline-variant/20 p-5 rounded-3xl flex items-center justify-center gap-4 font-bold text-lg hover:bg-surface-container-high transition-all active:scale-95 shadow-sm"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
        Continue with Google
      </button>
    </div>
  );
};

const LoadingScreen = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  const { appState, user, loading, init } = useAppStore();

  useEffect(() => {
    init();
  }, [init]);

  if (loading) return <LoadingScreen />;
  if (!user) return <LoginScreen />;

  const renderScreen = () => {
    switch (appState) {
      // User Screens
      case 'USER_HOME': return <UserHome key="user-home" />;
      case 'USER_FINDING': return <UserFinding key="user-finding" />;
      case 'USER_TRACKING': return <UserTracking key="user-tracking" />;
      case 'USER_ACTIVITY': return <UserActivity key="user-activity" />;
      case 'USER_VEHICLES': return <UserVehicles key="user-vehicles" />;
      case 'USER_PROFILE': return <UserProfile key="user-profile" />;
      
      // Mechanic Screens
      case 'MECHANIC_LIST': return <MechanicList key="mech-list" />;
      case 'MECHANIC_NAV': return <MechanicNav key="mech-nav" />;
      case 'MECHANIC_ACTIVITY': return <UserActivity key="mech-activity" />;
      case 'MECHANIC_GARAGE': return <MechanicGarage key="mech-garage" />;
      case 'MECHANIC_PROFILE': return <UserProfile key="mech-profile" />;
      
      default: return <UserHome key="default" />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-surface text-on-surface font-sans selection:bg-primary/20">
        <TopBar />
        
        <main className="h-screen overflow-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {renderScreen()}
          </AnimatePresence>
        </main>

        <BottomNav />
      </div>
    </ErrorBoundary>
  );
};

export default App;
