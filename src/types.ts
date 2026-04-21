export type Hero = {
  id: string;
  name: string;
  secret_identity: string;
  universe: 'Marvel' | 'DC';
  alignment: string;
  description: string;
  wins: number;
  losses: number;
  image_url: string;
  hero_type: 'strength' | 'speed' | 'flight';
  health: number;
  speed: number;
  strength: number;
  teams?: string[];
};
