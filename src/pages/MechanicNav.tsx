import React from 'react';
import { Navigation, MessageSquare, Phone, Star, CircleDot, Car, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Polyline, Marker } from 'react-leaflet';
import { MapBackground } from '../components/MapBackground';
import { createCustomIcon } from '../components/Icons';
import { useAppStore } from '../store/useAppStore';

export const MechanicNav = () => {
  const { activeRequest, isTripStarted, setIsTripStarted, completeRequest } = useAppStore();

  if (!activeRequest) return null;

  const userPos: [number, number] = [47.6100, -122.3350];
  const mechanicPos: [number, number] = [47.6000, -122.3300];
  const movingPos: [number, number] = isTripStarted ? [47.6050, -122.3320] : mechanicPos;

  const handleComplete = async () => {
    await completeRequest(activeRequest.id);
  };

  return (
    <div className="h-full relative">
      <MapBackground location="seattle">
        <Polyline 
          positions={[movingPos, userPos]} 
          color="#006a33" 
          weight={4} 
          dashArray="10, 10" 
          opacity={0.6}
        />
        <Marker 
          position={userPos} 
          icon={createCustomIcon(<CircleDot className="text-white" size={20} />, 'bg-tertiary')} 
        />
        <Marker 
          position={movingPos} 
          icon={createCustomIcon(<Car className="text-white" size={20} />, 'bg-primary')} 
        />
      </MapBackground>

      <header className="fixed top-4 left-4 right-4 z-50">
        <div className="glass rounded-2xl px-6 py-5 flex items-center justify-between shadow-2xl border border-white/20">
          <div className="flex items-center gap-6">
            <div className="bg-primary text-on-primary p-3 rounded-xl flex items-center justify-center">
              <Navigation size={32} className="rotate-90" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{isTripStarted ? 'Head North' : 'Turn Right in 200m'}</h1>
              <p className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">{isTripStarted ? 'Arriving in 2 mins' : 'Onto Main Street NW'}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 flex flex-col items-center min-w-[80px] shadow-sm">
            <span className="text-xl font-black text-primary">{isTripStarted ? '2' : '5'}</span>
            <span className="text-[10px] font-bold uppercase text-on-surface-variant">MINS</span>
          </div>
        </div>
      </header>

      <motion.section 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 w-full z-50"
      >
        <div className="bg-surface-container-lowest rounded-t-[2.5rem] shadow-2xl px-8 pt-8 pb-10 max-w-4xl mx-auto">
          <div className="w-12 h-1.5 bg-surface-container-high rounded-full mx-auto mb-8" />
          
          <div className="flex flex-col gap-8">
            <div className="flex justify-between items-start">
              <div className="flex gap-5 items-center">
                <div className="relative">
                  <img 
                    src={activeRequest.customerPhoto} 
                    alt={activeRequest.customerName} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-container p-0.5"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary p-1 rounded-full border-2 border-white">
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">{activeRequest.customerName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-error/10 text-error text-[10px] font-bold px-2 py-0.5 rounded uppercase">Emergency</span>
                    <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-wider">{activeRequest.distance} Away</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => alert('Opening chat...')}
                  className="w-12 h-12 bg-surface-container-low text-on-surface rounded-full flex items-center justify-center active:scale-90 transition-all"
                >
                  <MessageSquare size={20} />
                </button>
                <button 
                  onClick={() => alert('Calling customer...')}
                  className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center active:scale-90 transition-all shadow-md"
                >
                  <Phone size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Service Request</p>
                <div className="flex items-center gap-3">
                  <CircleDot className="text-primary" size={24} />
                  <span className="text-lg font-bold">{activeRequest.issueType}</span>
                </div>
              </div>
              <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Vehicle</p>
                <div className="flex items-center gap-3">
                  <Car className="text-secondary" size={24} />
                  <span className="text-lg font-bold">{activeRequest.vehicle}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button 
                onClick={() => setIsTripStarted(true)}
                disabled={isTripStarted}
                className={`flex-1 h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all ${
                  isTripStarted ? 'bg-surface-container-high text-outline cursor-not-allowed' : 'bg-primary text-on-primary shadow-primary/20'
                }`}
              >
                <Navigation size={20} />
                {isTripStarted ? 'Trip Started' : 'Start Trip'}
              </button>
              <button 
                onClick={handleComplete}
                className="flex-1 bg-surface-container-high text-on-surface h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                <CheckCircle2 size={20} />
                Complete Job
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
