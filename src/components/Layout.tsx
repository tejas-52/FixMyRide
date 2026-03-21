import React from 'react';
import { Menu, Compass, History, Car, User, Wrench } from 'lucide-react';
import { UserRole } from '../types';
import { useAppStore } from '../store/useAppStore';

export const TopBar = () => {
  const { role, toggleRole } = useAppStore();
  
  return (
    <header className="fixed top-0 w-full z-50 glass flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-3">
        <button className="text-primary hover:opacity-80 transition-opacity">
          <Menu size={24} />
        </button>
        <h1 className="text-2xl font-black text-on-surface tracking-tighter font-headline">FixMyRide</h1>
      </div>
      <div className="flex items-center gap-4">
        {role === 'MECHANIC' && (
          <div className="flex items-center bg-surface-container-low rounded-full px-3 py-1 gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Online</span>
          </div>
        )}
        <button 
          onClick={toggleRole}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/10 hover:ring-2 ring-primary/20 transition-all"
        >
          <img 
            src={role === 'USER' ? "https://picsum.photos/seed/user/100" : "https://picsum.photos/seed/mech/100"} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};

export const BottomNav = () => {
  const { appState, role, setAppState } = useAppStore();
  
  const tabs = role === 'USER' ? [
    { id: 'USER_HOME', label: 'Request', icon: Compass },
    { id: 'USER_ACTIVITY', label: 'Activity', icon: History },
    { id: 'USER_VEHICLES', label: 'Vehicles', icon: Car },
    { id: 'USER_PROFILE', label: 'Profile', icon: User },
  ] : [
    { id: 'MECHANIC_LIST', label: 'Find Help', icon: Compass },
    { id: 'MECHANIC_ACTIVITY', label: 'Activity', icon: History },
    { id: 'MECHANIC_GARAGE', label: 'Garage', icon: Wrench },
    { id: 'MECHANIC_PROFILE', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-8 pt-3 bg-white/90 dark:bg-stone-950/90 backdrop-blur-2xl rounded-t-[2.5rem] z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      {tabs.map((tab) => {
        const isActive = appState === tab.id;
        return (
          <button 
            key={tab.id}
            onClick={() => setAppState(tab.id as any)}
            className={`flex flex-col items-center justify-center px-5 py-2 transition-all duration-300 ${
              isActive ? 'bg-primary/10 text-primary rounded-2xl scale-110' : 'text-on-surface-variant'
            }`}
          >
            <tab.icon size={20} fill={isActive ? 'currentColor' : 'none'} />
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
