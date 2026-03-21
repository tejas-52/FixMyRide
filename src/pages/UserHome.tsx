import React from 'react';
import { MapPin, Search, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { MapBackground } from '../components/MapBackground';
import { useAppStore } from '../store/useAppStore';
import { ServiceType } from '../types';
import { CircleDot, Zap, Fuel, Thermometer } from 'lucide-react';
import { Marker } from 'react-leaflet';
import { createCustomIcon } from '../components/Icons';

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

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedCoords, setSelectedCoords] = React.useState<[number, number] | null>(null);

  const handleRequestAssistance = async () => {
    if (!breakdownLocation || !user) {
      console.warn('Missing location or user:', { breakdownLocation, user: !!user });
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Requesting assistance for:', selectedServiceId);
      await createRequest({
        customerName: user.name,
        customerPhoto: user.photoURL,
        distance: '1.2 km',
        location: breakdownLocation,
        issueType: SERVICE_TYPES.find(s => s.id === selectedServiceId)?.name || 'General',
        vehicle: 'Honda City (White)',
        mechanicUid: null,
      });
    } catch (error) {
      console.error('Request assistance failed:', error);
      alert('Failed to request assistance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocateMe = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedCoords([latitude, longitude]);
          setBreakdownLocation(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
        },
        (error) => {
          console.warn("Geolocation error, using demo location:", error.message);
          // Demo fallback
          const demoCoords: [number, number] = [19.0760, 72.8777];
          setSelectedCoords(demoCoords);
          setBreakdownLocation('Worli Sea Face, Mumbai (Demo)');
        }
      );
    } else {
      const demoCoords: [number, number] = [19.0760, 72.8777];
      setSelectedCoords(demoCoords);
      setBreakdownLocation('Worli Sea Face, Mumbai (Demo)');
    }
  };

  const handleMapClick = (latlng: [number, number]) => {
    setSelectedCoords(latlng);
    setBreakdownLocation(`Selected Point (${latlng[0].toFixed(4)}, ${latlng[1].toFixed(4)})`);
  };

  const handleSelfCheck = async () => {
    if (!user) {
      alert('Please sign in first to run the self-check.');
      return;
    }
    
    if (user.uid === 'LOCAL_DEMO_USER') {
      alert('You are currently in Local Demo Mode. Database writes are disabled. Please sign in with Google or Email to test real-time database functionality.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const testLocation = breakdownLocation || 'Marine Drive, Mumbai (Self-Check)';
      const testService = SERVICE_TYPES[0].name;
      
      console.log('Running self-check request...');
      await createRequest({
        customerName: user.name,
        customerPhoto: user.photoURL,
        distance: '0.5 km',
        location: testLocation,
        issueType: testService,
        vehicle: 'Test Vehicle (Smoke Test)',
        mechanicUid: null,
      });
      console.log('Self-check successful!');
    } catch (error) {
      console.error('Self-check failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full relative">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="bg-primary/10 backdrop-blur-md border border-primary/20 px-3 py-1 rounded-full flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Demo Mode Active</span>
        </div>
      </div>

      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <button 
          onClick={handleSelfCheck}
          disabled={isSubmitting}
          className="bg-surface-container-low border border-primary/30 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-xl hover:bg-primary/5 active:scale-95 transition-all flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-primary rounded-full" />
          {isSubmitting ? 'Verifying...' : 'Run Functional Self-Check'}
        </button>
      </div>

      <MapBackground 
        location="mumbai"
        onMapClick={handleMapClick}
        mapContent={
          selectedCoords && (
            <Marker 
              position={selectedCoords} 
              icon={createCustomIcon(<MapPin className="text-white" size={20} />, 'bg-primary')} 
            />
          )
        }
      >
        <div className="absolute top-24 left-6 right-6 z-20 pointer-events-auto">
          <div className="glass rounded-3xl p-2 flex items-center shadow-2xl border border-white/20">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <MapPin size={24} />
            </div>
            <input 
              type="text" 
              placeholder="Enter breakdown location..."
              value={breakdownLocation}
              onChange={(e) => setBreakdownLocation(e.target.value)}
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 font-bold text-on-surface placeholder:text-outline/50"
            />
            <button 
              onClick={handleLocateMe}
              className="px-4 h-12 bg-primary text-on-primary rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md active:scale-95"
            >
              <Search size={18} />
              <span className="text-xs font-bold whitespace-nowrap">Locate Me</span>
            </button>
          </div>
        </div>
      </MapBackground>

      <motion.section 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 w-full z-40 max-h-[85vh] overflow-hidden flex flex-col"
      >
        <div className="bg-surface-container-lowest rounded-t-[2.5rem] shadow-2xl px-8 pt-8 pb-28 md:max-w-xl md:mx-auto overflow-y-auto no-scrollbar flex-1">
          <div className="w-12 h-1.5 bg-surface-container-high rounded-full mx-auto mb-8 sticky top-0" />
          
          <div className="mb-8">
            <h2 className="text-3xl font-black tracking-tight mb-2">What's the issue?</h2>
            <p className="text-on-surface-variant font-medium">Select a service or <span className="text-primary font-bold">click on map</span> to set location.</p>
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

          {!breakdownLocation && (
            <div className="bg-error/10 p-4 rounded-2xl mb-6 flex items-center gap-3">
              <div className="w-2 h-2 bg-error rounded-full animate-pulse flex-shrink-0" />
              <p className="text-error text-xs font-bold">
                Please enter your location in the search bar above to request assistance.
              </p>
            </div>
          )}

          <button 
            onClick={handleRequestAssistance}
            disabled={!breakdownLocation || isSubmitting}
            className={`w-full h-16 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98] ${
              breakdownLocation && !isSubmitting
                ? 'bg-primary text-on-primary shadow-primary/20 hover:bg-primary/90' 
                : 'bg-surface-container-high text-outline cursor-not-allowed opacity-50'
            }`}
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Request Assistance
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </motion.section>
    </div>
  );
};
