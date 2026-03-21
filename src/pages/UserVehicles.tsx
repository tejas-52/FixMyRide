import React from 'react';
import { Car, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';

export const UserVehicles = () => {
  const { vehicles, addVehicle } = useAppStore();

  const handleAddVehicle = () => {
    const newVehicle = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Tesla Model 3',
      type: 'Electric Sedan',
      plate: 'MH 01 AB 1234'
    };
    addVehicle(newVehicle);
    alert('New vehicle added successfully!');
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-32 px-6">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tight mb-2">Vehicles</h2>
          <p className="text-on-surface-variant font-medium">Manage your fleet.</p>
        </div>
        <button 
          onClick={handleAddVehicle}
          className="bg-primary text-on-primary px-6 py-3 rounded-2xl font-bold active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          Add New
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-surface-container-low rounded-[2.5rem] p-12 text-center border border-outline-variant/10">
          <div className="w-20 h-20 bg-surface-container rounded-3xl flex items-center justify-center mx-auto mb-6 text-outline">
            <Car size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">No vehicles yet</h3>
          <p className="text-on-surface-variant text-sm">Add your vehicles to get faster assistance.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <motion.div 
              key={vehicle.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <Car size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{vehicle.name}</h4>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{vehicle.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-on-surface">{vehicle.plate}</p>
                <div className="flex items-center gap-1 justify-end mt-1">
                  <CheckCircle2 size={12} className="text-primary" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
