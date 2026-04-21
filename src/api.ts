import { Hero } from './types';

export async function fetchHeroes(q = '', team = 'all', universe = 'all'): Promise<Hero[]> {
  const url = new URL('/api/heroes', window.location.origin);
  if (q) url.searchParams.set('q', q);
  if (team !== 'all') url.searchParams.set('team', team);
  if (universe !== 'all') url.searchParams.set('universe', universe);
  return fetch(url.toString()).then(r => r.json());
}

export async function fetchTeams(): Promise<{id: string; name: string}[]> {
  return fetch('/api/teams').then(r => r.json());
}

export async function fetchUniverses(): Promise<string[]> {
  return fetch('/api/universes').then(r => r.json());
}

export async function fetchHero(id: string): Promise<Hero> {
  return fetch(`/api/heroes/${id}`).then(r => r.json());
}
