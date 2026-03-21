import React from 'react';
import { History, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../store/useAppStore';

export const UserActivity = () => {
  const { activities } = useAppStore();

  return (
    <div className="min-h-screen bg-surface pt-24 pb-32 px-6">
      <div className="mb-8">
        <h2 className="text-4xl font-black tracking-tight mb-2">Activity</h2>
        <p className="text-on-surface-variant font-medium">Your past service history.</p>
      </div>

      {activities.length === 0 ? (
        <div className="bg-surface-container-low rounded-[2.5rem] p-12 text-center border border-outline-variant/10">
          <div className="w-20 h-20 bg-surface-container rounded-3xl flex items-center justify-center mx-auto mb-6 text-outline">
            <History size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">No activity yet</h3>
          <p className="text-on-surface-variant text-sm">Your service history will appear here once you complete a request.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">{activity.service}</h4>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{activity.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-xl text-primary">{activity.cost}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{activity.status}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
