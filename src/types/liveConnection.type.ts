export type LiveConnectionMessage<T extends object = object> = { type: string } & T;
export type LiveConnectionRole = 'host' | 'guest';
export type LiveConnectionState = 'connected' | 'disconnected' | 'connecting';
export interface Peer {
  id: string;
  pc: RTCPeerConnection;
  dc: RTCDataChannel | null;
  state: RTCDataChannelState | 'none';
  localSDP: string;
  remoteSDP: string;
}
