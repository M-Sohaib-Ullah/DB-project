import React, { useEffect, useState } from 'react';
import { Hero } from './types';
import { fetchHeroes, fetchTeams, fetchUniverses } from './api';
import { HeroCard } from './components/HeroCard';
import { ComparisonDashboard } from './components/ComparisonDashboard';
import { TacticalDuel } from './components/TacticalDuel';
import { Search, Filter, X, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [allDataHeroes, setAllDataHeroes] = useState<Hero[]>([]);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [teams, setTeams] = useState<{id: string; name: string}[]>([]);
  const [universes, setUniverses] = useState<string[]>([]);
  
  const [query, setQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [universeFilter, setUniverseFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState<'registry' | 'arena'>('registry');
  
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    fetchTeams().then(setTeams);
    fetchUniverses().then(setUniverses);
    fetchHeroes('', 'all', 'all').then(setAllDataHeroes);
  }, []);

  useEffect(() => {
    fetchHeroes(query, teamFilter, universeFilter).then(setHeroes);
  }, [query, teamFilter, universeFilter]);

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const getCompareHeroes = () => {
    return compareIds.map(id => heroes.find(h => h.id === id)).filter(Boolean) as Hero[];
  };

  const compareHeroes = getCompareHeroes();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-sans flex flex-col items-center">
      <div className="w-full max-w-[1024px] flex flex-col p-8 gap-8">
        <header className="h-16 border-b border-white/10 flex items-center justify-between pb-4">
          <div className="flex items-center gap-8">
            <h1 className="font-serif italic text-2xl tracking-tight text-white">
              HeroMatch DB
            </h1>
            <nav className="hidden md:flex gap-6 text-[10px] uppercase tracking-widest text-white/50 font-medium">
              <span onClick={() => setCurrentTab('registry')} className={currentTab === 'registry' ? "text-white border-b border-white/40 pb-1 cursor-pointer" : "hover:text-white transition-colors cursor-pointer text-white/30"}>Encyclopedia</span>
              <span onClick={() => setCurrentTab('arena')} className={currentTab === 'arena' ? "text-white border-b border-white/40 pb-1 cursor-pointer" : "hover:text-white transition-colors cursor-pointer text-white/30"}>Tactical Arena</span>
            </nav>
          </div>
          
          {currentTab === 'registry' && (
            <div className="flex items-center gap-4">
              <div className="relative flex-1 w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded px-9 py-1.5 text-[10px] uppercase tracking-widest focus:border-white/30 outline-none transition-colors text-white placeholder-white/30 font-medium"
                />
              </div>
              
              <div className="relative w-40">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <select
                  value={universeFilter}
                  onChange={e => setUniverseFilter(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded pl-9 pr-4 py-1.5 text-[10px] uppercase tracking-widest focus:border-white/30 outline-none appearance-none cursor-pointer text-white font-medium"
                >
                  <option value="all">All Universes</option>
                  {universes.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="relative w-40">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                <select
                  value={teamFilter}
                  onChange={e => setTeamFilter(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded pl-9 pr-4 py-1.5 text-[10px] uppercase tracking-widest focus:border-white/30 outline-none appearance-none cursor-pointer text-white font-medium"
                >
                  <option value="all">All Teams</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 flex flex-col gap-8">
          {currentTab === 'arena' ? (
            <TacticalDuel allHeroes={allDataHeroes} />
          ) : (
            <>
              {/* Comparison Section */}
              <AnimatePresence>
                {compareHeroes.length === 2 && (
              <motion.section
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="relative z-10 overflow-hidden"
              >
                 <button 
                  onClick={() => setCompareIds([])} 
                  className="absolute top-4 right-4 px-4 py-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded hover:bg-stone-200 z-50 flex items-center gap-2"
                  title="Clear comparison"
                >
                  <X className="w-3 h-3" /> CLEAR
                </button>
                <ComparisonDashboard heroA={compareHeroes[0]} heroB={compareHeroes[1]} />
              </motion.section>
            )}
          </AnimatePresence>

          {/* Info Box if waiting for comparison */}
          {compareIds.length === 1 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/[0.02] border border-white/10 p-4 rounded text-center text-[10px] uppercase tracking-widest text-white/50"
            >
              <strong className="text-white font-serif italic text-sm normal-case mr-2">{getCompareHeroes()[0]?.name}</strong>
              selected. Select one more hero to execute analysis.
            </motion.div>
          )}

          {/* Grid View */}
          <section className="flex-1 bg-white/[0.02] border border-white/10 rounded-lg flex flex-col overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <h2 className="font-serif italic text-lg text-white">
                  heroes.registry
                </h2>
                <span className="text-[10px] bg-white/5 text-white/40 px-2 py-1 rounded uppercase tracking-widest font-mono">
                  {heroes.length} Entities
                </span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {heroes.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {heroes.map(hero => (
                      <motion.div 
                        key={hero.id}
                        layoutId={hero.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <HeroCard 
                          hero={hero} 
                          onCompareSelect={toggleCompare} 
                          isSelected={compareIds.includes(hero.id)} 
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="text-center py-20 text-[10px] uppercase tracking-widest text-white/30">
                  No records match current filters
                </div>
              )}
            </div>
          </section>
          </>
          )}
        </main>
      </div>
    </div>
  );
}
