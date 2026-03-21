import React from 'react';
import { MapPin, ArrowRight, Star, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Request } from '../types';

export const MechanicList = () => {
  const { availableRequests, acceptRequest } = useAppStore();

  const handleAccept = async (requestId: string) => {
    await acceptRequest(requestId);
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-32 px-6">
      <div className="mb-8">
        <h2 className="text-4xl font-black tracking-tight mb-2">Nearby Requests</h2>
        <p className="text-on-surface-variant font-medium">Available jobs in your area.</p>
      </div>

      {availableRequests.length === 0 ? (
        <div className="bg-surface-container-low rounded-[2.5rem] p-12 text-center border border-outline-variant/10">
          <div className="w-20 h-20 bg-surface-container rounded-3xl flex items-center justify-center mx-auto mb-6 text-outline">
            <AlertTriangle size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">No requests nearby</h3>
          <p className="text-on-surface-variant text-sm">We'll notify you when a new request comes in.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {availableRequests.map((request) => (
            <motion.div 
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant/10 shadow-sm"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                  <div className="relative">
                    <img 
                      src={request.customerPhoto} 
                      alt={request.customerName} 
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary p-1 rounded-full border-2 border-white">
                      <Star size={10} fill="currentColor" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{request.customerName}</h3>
                    <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">{request.distance} Away</p>
                  </div>
                </div>
                <div className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {request.issueType}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6 text-on-surface-variant">
                <MapPin size={16} />
                <span className="text-sm font-medium">{request.location}</span>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => alert('Opening navigation...')}
                  className="flex-1 bg-surface-container-high text-on-surface py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all"
                >
                  NAVIGATE
                </button>
                <button 
                  onClick={() => handleAccept(request.id)}
                  className="flex-1 bg-primary text-on-primary py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  ACCEPT
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
