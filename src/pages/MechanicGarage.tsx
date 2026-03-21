import React, { useState } from 'react';
import { Wrench, Star, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const MechanicGarage = () => {
  const [tools, setTools] = useState(['Basic Wrench', 'Jack Stand', 'Puncture Kit']);
  const [badges, setBadges] = useState(['Certified Expert', 'Quick Response']);

  const handleUpgradeKit = () => {
    setTools([...tools, 'Hydraulic Jack', 'OBD Scanner']);
    alert('Toolkit upgraded with advanced diagnostics!');
  };

  const handleViewBadges = () => {
    alert(`Your Badges: ${badges.join(', ')}`);
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-32 px-6">
      <div className="mb-8">
        <h2 className="text-4xl font-black tracking-tight mb-2">Garage</h2>
        <p className="text-on-surface-variant font-medium">Manage your tools and skills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
              <Wrench size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Tool Kit</h3>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{tools.length} Tools Active</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {tools.map((tool, i) => (
              <span key={i} className="bg-surface-container px-3 py-1.5 rounded-xl text-xs font-bold text-on-surface-variant">
                {tool}
              </span>
            ))}
          </div>
          <button 
            onClick={handleUpgradeKit}
            className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold text-sm active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            UPGRADE KIT
          </button>
        </div>

        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center">
              <Star size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Certifications</h3>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">{badges.length} Badges Earned</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {badges.map((badge, i) => (
              <span key={i} className="bg-tertiary/10 px-3 py-1.5 rounded-xl text-xs font-bold text-tertiary">
                {badge}
              </span>
            ))}
          </div>
          <button 
            onClick={handleViewBadges}
            className="w-full py-4 bg-surface-container-high text-on-surface rounded-2xl font-bold text-sm active:scale-95 transition-all"
          >
            VIEW ALL BADGES
          </button>
        </div>
      </div>

      <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Zap size={20} className="text-primary" />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-black text-primary mb-1">98%</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Success Rate</p>
          </div>
          <div className="text-center border-x border-primary/10">
            <p className="text-3xl font-black text-primary mb-1">4.9</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Avg Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-primary mb-1">12m</p>
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Avg Response</p>
          </div>
        </div>
      </div>
    </div>
  );
};
