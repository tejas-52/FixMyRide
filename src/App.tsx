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
  const { signIn, signInWithEmail, signUpWithEmail, enterDemoMode } = useAppStore();
  const [isSignUp, setIsSignUp] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-8 text-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center text-on-primary mb-6 shadow-2xl shadow-primary/20"
      >
        <Car size={40} />
      </motion.div>
      <h1 className="text-3xl font-black tracking-tighter mb-2">FixMyRide</h1>
      <p className="text-on-surface-variant font-medium mb-8 max-w-xs text-sm">
        Professional roadside assistance at your fingertips.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4 mb-6">
        <div className="space-y-2">
          <input 
            type="email" 
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/20 p-4 rounded-2xl font-medium focus:outline-none focus:border-primary transition-all"
            required
          />
          <input 
            type="password" 
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant/20 p-4 rounded-2xl font-medium focus:outline-none focus:border-primary transition-all"
            required
          />
        </div>

        {error && <p className="text-error text-xs font-bold">{error}</p>}

        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-linear-to-br from-primary to-primary/80 text-on-primary p-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20"
        >
          {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
        </button>

        <button 
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm font-bold text-primary hover:underline"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </form>

      <div className="w-full max-w-xs flex items-center gap-4 mb-6">
        <div className="h-px bg-outline-variant/20 flex-1" />
        <span className="text-xs font-bold text-on-surface-variant">OR</span>
        <div className="h-px bg-outline-variant/20 flex-1" />
      </div>

      <div className="w-full max-w-xs space-y-3">
        <button 
          onClick={signIn}
          className="w-full bg-surface-container-low border border-outline-variant/20 p-4 rounded-2xl flex items-center justify-center gap-4 font-bold hover:bg-surface-container-high transition-all active:scale-95 shadow-sm"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        <button 
          onClick={enterDemoMode}
          className="w-full bg-surface-container-lowest border-2 border-primary/20 text-primary p-4 rounded-2xl font-bold hover:bg-primary/5 transition-all active:scale-95"
        >
          Try Demo Mode
        </button>
      </div>
    </div>
  );
};

const LoadingScreen = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  const { appState, user, loading, init, cleanup } = useAppStore();

  useEffect(() => {
    init();
    return () => cleanup();
  }, [init, cleanup]);

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
