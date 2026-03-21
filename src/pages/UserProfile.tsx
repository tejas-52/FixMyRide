import React from 'react';
import { User, Settings, Phone, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';

export const UserProfile = () => {
  const { role, resetApp } = useAppStore();

  return (
    <div className="min-h-screen bg-surface pt-24 pb-32 px-6">
      <div className="mb-12 text-center">
        <div className="relative inline-block">
          <img 
            src={role === 'USER' ? "https://picsum.photos/seed/user/200" : "https://picsum.photos/seed/mech/200"} 
            alt="Profile" 
            className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white shadow-2xl"
          />
          <div className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-3 rounded-2xl shadow-lg">
            <Settings size={20} />
          </div>
        </div>
        <h2 className="text-3xl font-black tracking-tight mt-6 mb-1">
          {role === 'USER' ? 'Tejas Jagdale' : 'Ramesh Kumar'}
        </h2>
        <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs">
          {role === 'USER' ? 'Premium Member' : 'Certified Expert'}
        </p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => alert('Opening personal info...')}
          className="w-full bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 flex items-center justify-between active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <User size={24} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg">Personal Info</h4>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Manage your profile</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-surface-container rounded-xl flex items-center justify-center text-outline">
            <Settings size={20} />
          </div>
        </button>

        <button 
          onClick={() => alert('Contacting support...')}
          className="w-full bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 flex items-center justify-between active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center">
              <Phone size={24} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg">Contact Support</h4>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Help & Support</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-surface-container rounded-xl flex items-center justify-center text-outline">
            <Settings size={20} />
          </div>
        </button>

        <button 
          onClick={resetApp}
          className="w-full bg-error/10 p-6 rounded-3xl border border-error/20 flex items-center justify-between active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-error/10 text-error rounded-2xl flex items-center justify-center">
              <X size={24} />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-lg text-error">Sign Out</h4>
              <p className="text-xs text-error/70 font-bold uppercase tracking-widest">Clear all data</p>
            </div>
          </div>
          <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center text-error">
            <Settings size={20} />
          </div>
        </button>
      </div>
    </div>
  );
};
