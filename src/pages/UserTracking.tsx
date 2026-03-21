import React from 'react';
import { Wrench, Star, MessageSquare, Phone, Car, User, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Polyline, Marker } from 'react-leaflet';
import { MapBackground } from '../components/MapBackground';
import { createCustomIcon } from '../components/Icons';
import { useAppStore } from '../store/useAppStore';

export const UserTracking = () => {
  const { activeRequest, isTripStarted, setAppState, setActiveRequest } = useAppStore();

  const userPos: [number, number] = [19.0800, 72.8850];
  const mechanicPos: [number, number] = [19.0700, 72.8700];
  const movingPos: [number, number] = isTripStarted ? [19.0750, 72.8780] : mechanicPos;

  const handleComplete = () => {
    setActiveRequest(null);
    setAppState('USER_HOME');
  };

  return (
    <div className="h-full relative">
      <MapBackground location="mumbai">
        <Polyline 
          positions={[movingPos, userPos]} 
          color="#006a33" 
          weight={4} 
          dashArray="10, 10" 
          opacity={0.6}
        />
        <Marker 
          position={userPos} 
          icon={createCustomIcon(<User className="text-white" size={20} />, 'bg-tertiary')} 
        />
        <Marker 
          position={movingPos} 
          icon={createCustomIcon(<Car className="text-white" size={20} />, 'bg-primary')} 
        />
      </MapBackground>

      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-md">
        <div className="glass p-4 rounded-3xl flex items-center justify-between shadow-lg border border-white/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-container flex items-center justify-center">
              <Wrench className="text-on-primary-container" size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-outline uppercase tracking-tighter">Current Status</p>
              <h2 className="font-bold text-on-surface">{isTripStarted ? 'Mechanic is arriving' : 'Mechanic assigned'}</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-primary text-2xl font-black -mb-1">{isTripStarted ? '2 min' : '8 min'}</p>
            <p className="text-[10px] font-bold text-outline uppercase">ETA</p>
          </div>
        </div>
      </div>

      <motion.section 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 w-full z-40"
      >
        <div className="bg-surface-container-lowest rounded-t-[2.5rem] shadow-2xl p-6 md:max-w-xl md:mx-auto">
          <div className="w-12 h-1.5 bg-surface-container rounded-full mx-auto mb-8" />
          
          <div className="flex items-start justify-between mb-8">
            <div className="flex gap-4">
              <div className="relative">
                <img 
                  src="https://picsum.photos/seed/ramesh/200" 
                  alt="Ramesh" 
                  className="w-16 h-16 rounded-2xl object-cover"
                />
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                  <div className="bg-primary px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Star className="text-white" size={10} fill="currentColor" />
                    <span className="text-[10px] font-bold text-white">4.8</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-xl">Ramesh Kumar</h3>
                <p className="text-on-surface-variant flex items-center gap-1.5 text-sm mt-1">
                  <Car size={14} />
                  Royal Enfield • <span className="font-mono font-bold">KA 01 EK 1234</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => alert('Opening chat...')}
                className="w-12 h-12 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center active:scale-90 transition-all"
              >
                <MessageSquare size={20} />
              </button>
              <button 
                onClick={() => alert('Calling mechanic...')}
                className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-90 transition-all shadow-lg shadow-primary/20"
              >
                <Phone size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-surface-container-low p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Service Type</p>
              <p className="font-bold">{activeRequest?.issueType}</p>
            </div>
            <div className="bg-surface-container-low p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Payment</p>
              <p className="font-bold">₹450 Est.</p>
            </div>
          </div>

          <button 
            onClick={handleComplete}
            className="w-full bg-error/10 border border-error/20 text-error font-bold py-4 rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <X size={18} />
            Cancel Assistance
          </button>
        </div>
      </motion.section>
    </div>
  );
};
