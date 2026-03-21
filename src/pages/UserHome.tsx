import React from 'react';
import { MapPin, Search, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { MapBackground } from '../components/MapBackground';
import { useAppStore } from '../store/useAppStore';
import { ServiceType } from '../types';
import { CircleDot, Zap, Fuel, Thermometer } from 'lucide-react';

const SERVICE_TYPES: ServiceType[] = [
  { id: 'puncture', name: 'Puncture', icon: CircleDot, color: 'bg-primary-container text-on-primary-container' },
  { id: 'battery', name: 'Battery', icon: Zap, color: 'bg-secondary-container text-on-secondary-container' },
  { id: 'fuel', name: 'Fuel', icon: Fuel, color: 'bg-secondary-container text-on-secondary-container' },
  { id: 'engine', name: 'Engine', icon: Thermometer, color: 'bg-secondary-container text-on-secondary-container' },
];

export const UserHome = () => {
  const { 
    breakdownLocation, 
    setBreakdownLocation, 
    selectedServiceId, 
    setSelectedServiceId, 
    createRequest,
    user
  } = useAppStore();

  const handleRequestAssistance = async () => {
    if (!breakdownLocation || !user) return;
    
    await createRequest({
      customerName: user.name,
      customerPhoto: user.photoURL,
      distance: '1.2 km',
      location: breakdownLocation,
      issueType: SERVICE_TYPES.find(s => s.id === selectedServiceId)?.name || 'General',
      vehicle: 'Honda City (White)',
      mechanicUid: null,
    });
  };

  return (
    <div className="h-full relative">
      <MapBackground location="mumbai">
        <div className="absolute top-24 left-6 right-6 z-20">
          <div className="glass rounded-3xl p-2 flex items-center shadow-2xl border border-white/20">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <MapPin size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Where is your vehicle?"
              value={breakdownLocation}
              onChange={(e) => setBreakdownLocation(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 font-bold text-on-surface placeholder:text-outline/50"
            />
            <button className="w-12 h-12 bg-surface-container-low rounded-2xl flex items-center justify-center text-on-surface-variant">
              <Search size={20} />
            </button>
          </div>
        </div>
      </MapBackground>

      <motion.section 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 w-full z-40"
      >
        <div className="bg-surface-container-lowest rounded-t-[2.5rem] shadow-2xl px-8 pt-8 pb-10 md:max-w-xl md:mx-auto">
          <div className="w-12 h-1.5 bg-surface-container-high rounded-full mx-auto mb-8" />
          
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight mb-2">What's the issue?</h2>
            <p className="text-on-surface-variant font-medium">Select a service to get instant help.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {SERVICE_TYPES.map((service) => (
              <button 
                key={service.id}
                onClick={() => setSelectedServiceId(service.id)}
                className={`p-6 rounded-3xl flex flex-col items-start gap-4 transition-all active:scale-95 border-2 ${
                  selectedServiceId === service.id 
                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/5' 
                    : 'border-transparent bg-surface-container-low'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${service.color}`}>
                  <service.icon size={24} />
                </div>
                <span className="font-bold text-lg">{service.name}</span>
              </button>
            ))}
          </div>

          <button 
            onClick={handleRequestAssistance}
            disabled={!breakdownLocation}
            className={`w-full h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] ${
              breakdownLocation 
                ? 'bg-primary text-on-primary shadow-primary/20' 
                : 'bg-surface-container-high text-outline cursor-not-allowed'
            }`}
          >
            Request Assistance
            <ArrowRight size={20} />
          </button>
        </div>
      </motion.section>
    </div>
  );
};
