import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { MapBackground } from '../components/MapBackground';
import { useAppStore } from '../store/useAppStore';
import { db, updateDoc, doc, serverTimestamp } from '../firebase';

export const UserFinding = () => {
  const { setAppState, setActiveRequest } = useAppStore();

  const handleCancel = () => {
    // In a real app, we would update the request status to CANCELLED in Firestore
    setAppState('USER_HOME');
    setActiveRequest(null);
  };

  const simulateAccept = async () => {
    const { activeRequest, user } = useAppStore.getState();
    if (!activeRequest) return;
    
    try {
      console.log('Simulating mechanic acceptance...');
      await updateDoc(doc(db, 'requests', activeRequest.id), {
        status: 'ACCEPTED',
        mechanicUid: 'MOCK_MECH_123',
        mechanicName: 'Rahul Sharma',
        mechanicPhoto: 'https://picsum.photos/seed/mech/200',
        mechanicRating: 4.8,
        mechanicPhone: '+91 98765 43210',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Simulation failed:', error);
    }
  };

  return (
    <div className="h-full relative">
      <MapBackground location="mumbai">
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="relative pointer-events-auto">
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -inset-20 bg-primary rounded-full"
            />
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-2xl relative z-10">
              <div className="w-16 h-16 border-4 border-on-primary border-t-transparent rounded-full animate-spin" />
            </div>
            
            <button 
              onClick={simulateAccept}
              className="absolute -bottom-32 left-1/2 -translate-x-1/2 bg-surface-container-low border border-outline-variant/20 px-6 py-3 rounded-full font-bold text-xs hover:bg-surface-container-high transition-all active:scale-95 shadow-lg whitespace-nowrap"
            >
              SIMULATE MECHANIC ACCEPTANCE
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
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black tracking-tight mb-3">Finding a Mechanic</h2>
            <p className="text-on-surface-variant font-medium">We're searching for the nearest available expert to help you out.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10">
              <span className="text-[10px] font-bold text-on-surface-variant mb-4 block uppercase tracking-widest">Pricing Breakdown</span>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Base Fare</span>
                  <span className="font-bold">₹100</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Service Charge</span>
                  <span className="font-bold">₹50</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Platform Fee</span>
                  <span className="font-bold">₹30</span>
                </div>
                <div className="h-[1px] bg-outline-variant/20 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Estimated Total</span>
                  <span className="text-2xl font-extrabold text-primary">₹180</span>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex flex-col justify-between">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="text-on-primary-container" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-on-primary-container">Secure Payment</h4>
                  <p className="text-xs text-on-primary-container/70">Pay only after service is completed successfully.</p>
                </div>
              </div>
              <button 
                onClick={handleCancel}
                className="mt-6 w-full py-4 bg-error text-on-error rounded-2xl font-bold text-sm active:scale-95 transition-all"
              >
                CANCEL REQUEST
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
