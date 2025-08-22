import type { LiveConnectionMessage, Peer } from '@/types/liveConnection.type';
import { generateShortUUID } from './uuid';

interface SetUpDataChannelParams {
  channel: RTCDataChannel;
  peerConnection: RTCPeerConnection;
  onInit?: (peer: Peer) => void;
  onOpen?: (peer: Peer) => void;
  onClose?: (peer: Peer) => void;
  onError?: (peer: Peer, error: RTCErrorEvent) => void;
  onMessage?: (peer: Peer, message: MessageEvent) => void;
}

export function setupDataChannel({
  channel,
  peerConnection,
  onInit,
  onOpen,
  onClose,
  onError,
  onMessage,
}: SetUpDataChannelParams): Peer {
  const id = `peer-${generateShortUUID()}`;

  const peer: Peer = {
    id,
    pc: peerConnection,
    dc: channel,
    state: 'none',
    localSDP: '',
    remoteSDP: '',
  };

  peer.dc = channel;
  peer.state = channel.readyState;

  if (onInit) onInit(peer);

  channel.onopen = () => {
    peer.state = channel.readyState;
    if (onOpen) onOpen(peer);
  };
  channel.onclose = () => {
    peer.state = channel.readyState;
    if (onClose) onClose(peer);
  };
  channel.onerror = (err) => {
    peer.state = channel.readyState;
    if (onError) onError(peer, err);
  };
  channel.onmessage = (ev) => {
    if (onMessage) onMessage(peer, ev);
  };

  return peer;
}

export function waitForIceComplete(pc: RTCPeerConnection): void {
  new Promise<void>((resolve) => {
    if (pc.iceGatheringState === 'complete') return resolve();
    const onChange = () => {
      if (pc.iceGatheringState === 'complete') {
        pc.removeEventListener('icegatheringstatechange', onChange);
        resolve();
      }
    };
    pc.addEventListener('icegatheringstatechange', onChange);
  });
}

export function parseSDP(sdp: string): RTCSessionDescription {
  return new RTCSessionDescription(JSON.parse(sdp));
}

export const messageToPeers = (msg: LiveConnectionMessage, peers: Peer[]) => {
  peers.forEach((p) => {
    if (p.dc && p.dc.readyState === 'open') {
      p.dc.send(JSON.stringify(msg));
    }
  });
};
