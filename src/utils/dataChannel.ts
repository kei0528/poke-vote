import type { LiveConnectionMessage, Guest } from '@/types/liveConnection.type';

export async function waitForIceComplete(pc: RTCPeerConnection): Promise<void> {
  await new Promise<void>((resolve) => {
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
export function parseSDP(sdp: string) {
  return new RTCSessionDescription(JSON.parse(sdp));
}

export const messageToGuests = (msg: LiveConnectionMessage, guests: Guest[]) => {
  guests.forEach((p) => {
    if (p.dc && p.dc.readyState === 'open') {
      p.dc.send(JSON.stringify(msg));
    }
  });
};
