import React, { useState } from 'react';
import { Hero } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Heart, Wind, Dumbbell } from 'lucide-react';

interface HeroCardProps {
  hero: Hero;
  onCompareSelect?: (id: string) => void;
  isSelected?: boolean;
}

export function HeroCard({ hero, onCompareSelect, isSelected }: HeroCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      transition={{ duration: 0.3 }}
      className={cn(
        "relative rounded-lg overflow-hidden cursor-pointer transition-colors bg-white/[0.02] border font-sans text-white",
        isSelected ? "border-white/40 shadow-sm" : "border-white/10 hover:bg-white/[0.04]"
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="absolute top-2 right-2 flex gap-2">
        <span className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono text-white/50 backdrop-blur-sm relative z-10">
          {hero.hero_type}
        </span>
        <span className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono text-white/50 backdrop-blur-sm relative z-10">
          {hero.universe}
        </span>
        {onCompareSelect && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCompareSelect(hero.id);
            }}
            className={cn(
              "px-3 py-0.5 border rounded text-[10px] font-mono backdrop-blur-sm z-10 transition-colors uppercase tracking-widest",
              isSelected 
                ? "bg-white text-black border-white" 
                : "bg-black/50 text-white/50 border-white/10 hover:text-white"
            )}
          >
            {isSelected ? "Selected" : "Select"}
          </button>
        )}
      </div>

      <div className="h-48 md:h-64 overflow-hidden relative border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent z-10" />
        <img
          src={hero.image_url}
          alt={hero.name}
          className="w-full h-full object-contain object-center grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-0 left-0 p-4 z-20">
          <h3 className="text-2xl font-serif italic text-white drop-shadow-md">{hero.name}</h3>
          <p className="text-[10px] uppercase tracking-widest text-white/50">{hero.secret_identity}</p>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4 bg-white/[0.01]"
          >
            <div className="pt-4 space-y-4">
              <p className="text-sm font-mono text-white/70 leading-relaxed">{hero.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {hero.teams?.map((team) => (
                  <span key={team} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] uppercase tracking-widest font-mono bg-white/5 border border-white/10 text-white/50">
                    {team}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center px-2 py-3 bg-white/[0.02] border border-white/5 rounded-md mt-4">
                 <div className="flex flex-col items-center gap-1">
                   <Heart className="w-3.5 h-3.5 text-white/40" />
                   <span className="text-[10px] font-mono font-medium text-emerald-400/80">{hero.health}</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                   <Wind className="w-3.5 h-3.5 text-white/40" />
                   <span className="text-[10px] font-mono font-medium text-amber-400/80">{hero.speed}</span>
                 </div>
                 <div className="flex flex-col items-center gap-1">
                   <Dumbbell className="w-3.5 h-3.5 text-white/40" />
                   <span className="text-[10px] font-mono font-medium text-rose-400/80">{hero.strength}</span>
                 </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2 text-[10px] uppercase tracking-widest text-white/40">
                  <span className="flex items-center">Win Rate</span>
                  <span className="font-mono text-white/70">
                    {Math.round((hero.wins / (hero.wins + hero.losses)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-white/40 h-full"
                    style={{ width: `${(hero.wins / (hero.wins + hero.losses)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-white/30 mt-2">
                  <span>W: {hero.wins}</span>
                  <span>L: {hero.losses}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
