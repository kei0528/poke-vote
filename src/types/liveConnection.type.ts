import type { Pokemon } from './pokemon.type';

export type LiveConnectionMessage =
  | { type: 'start_vote'; payload: { roundId: string; pair: [Pokemon, Pokemon] } }
  | { type: 'vote'; payload: { roundId: string; choiceId: number } };

export type LiveConnectionRole = 'host' | 'guest';
export interface Guest {
  id: string;
  pc: RTCPeerConnection;
  dc: RTCDataChannel | null;
  state: RTCDataChannelState | 'none';
  localSDP: string;
  remoteSDP: string;
}
