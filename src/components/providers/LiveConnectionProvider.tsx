import { STUN_URL } from '@/statics/dataChannel';
import type { LiveConnectionMessage, LiveConnectionRole, Guest } from '@/types/liveConnection.type';
import { messageToGuests, parseSDP, waitForIceComplete } from '@/utils/dataChannel';
import { generateShortUUID } from '@/utils/uuid';
import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react';
import { useNavigate } from 'react-router';

const LiveConnectionContext = createContext<{
  role: LiveConnectionRole | null;
  setRole: Dispatch<SetStateAction<LiveConnectionRole | null>>;
  guests: Guest[];
  setGuests: Dispatch<SetStateAction<Guest[]>>;
  guestDcState: RTCDataChannelState | 'none';
  setGuestDcState: Dispatch<RTCDataChannelState | 'none'>;
  guestPc: RTCPeerConnection | null;
  setGuestPc: Dispatch<SetStateAction<RTCPeerConnection | null>>;
  guestDc: RTCDataChannel | null;
  setGuestDc: Dispatch<SetStateAction<RTCDataChannel | null>>;
}>({
  role: null,
  setRole: () => {},
  guests: [],
  setGuests: () => [],
  guestDcState: 'none',
  setGuestDcState: () => {},
  guestPc: null,
  setGuestPc: () => {},
  guestDc: null,
  setGuestDc: () => {},
});

const LiveConnectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<LiveConnectionRole | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);

  const [guestPc, setGuestPc] = useState<RTCPeerConnection | null>(null);
  const [guestDc, setGuestDc] = useState<RTCDataChannel | null>(null);
  const [guestDcState, setGuestDcState] = useState<RTCDataChannelState | 'none'>('none');

  return (
    <LiveConnectionContext.Provider
      value={{
        role,
        setRole,
        guests,
        setGuests,
        guestDcState,
        setGuestDcState,
        guestPc,
        setGuestPc,
        guestDc,
        setGuestDc,
      }}
    >
      {children}
    </LiveConnectionContext.Provider>
  );
};

export const useLiveConnection = () => {
  const navigate = useNavigate();
  const {
    role,
    setRole,
    guests,
    setGuests,
    guestDcState,
    setGuestDcState,
    guestPc,
    setGuestPc,
    guestDc,
    setGuestDc,
  } = useContext(LiveConnectionContext);
  const [isPreparingGuestOffer, setIsPreparingGuestOffer] = useState(false);
  const [isApplyingAnswer, setIsApplyingAnswer] = useState(false);

  /**
   * Initialize Host and declare actions
   */
  const initHost = async () => {
    if (role !== 'host') return;
    setIsPreparingGuestOffer(true);

    const pc = new RTCPeerConnection({ iceServers: [{ urls: STUN_URL }] });
    const dc = pc.createDataChannel('votes');
    const id = `guest-${generateShortUUID()}`;

    const guest: Guest = { id, pc, dc, state: 'none', localSDP: '', remoteSDP: '' };

    // DataChannel handlers
    const attachDc = (channel: RTCDataChannel) => {
      guest.dc = channel;
      guest.state = channel.readyState;
      setGuests((arr) => arr.map((x) => (x.id === guest.id ? { ...guest } : x)));

      channel.onopen = () => {
        guest.state = channel.readyState;
        setGuests((arr) => arr.map((x) => (x.id === guest.id ? { ...guest } : x)));
      };
      channel.onclose = () => {
        guest.state = channel.readyState;
        setGuests((arr) => arr.map((x) => (x.id === guest.id ? { ...guest } : x)));
      };
      channel.onerror = () => {
        guest.state = channel.readyState;
        setGuests((arr) => arr.map((x) => (x.id === guest.id ? { ...guest } : x)));
      };
      channel.onmessage = () => {};
    };

    attachDc(dc);

    pc.ondatachannel = (ev) => attachDc(ev.channel);

    pc.onconnectionstatechange = () => {
      setGuests((state) => state.map((x) => (x.id === guest.id ? { ...guest } : x)));
    };
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await waitForIceComplete(pc);
    guest.localSDP = JSON.stringify(pc.localDescription);
    setGuests((state) => [...state, guest]);
    setIsPreparingGuestOffer(false);
  };

  /**
   * Apply answer SDP from Guest
   */
  const hostApplyAnswer = async (peerId: string, remoteSDP: string) => {
    setIsApplyingAnswer(true);
    const guest = guests.find((p) => p.id === peerId);
    if (!guest) return;
    setGuests((arg) => arg.map((x) => (x.id === guest.id ? { ...x, remoteSDP } : x)));
    await guest.pc.setRemoteDescription(parseSDP(remoteSDP));
    setIsApplyingAnswer(false);
  };

  /**
   * Initialize Guest and declare actions
   */
  const initGuest = async (guestRemoteSDP: string): Promise<string> => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: STUN_URL }] });
    setGuestPc(pc);

    pc.ondatachannel = ({ channel }) => {
      setGuestDc(channel);
      setGuestDcState(channel.readyState);

      channel.onopen = () => setGuestDcState(channel.readyState);
      channel.onclose = () => setGuestDcState(channel.readyState);
      channel.onerror = () => setGuestDcState(channel.readyState);
      channel.onmessage = (event) => {
        const { type, payload } = JSON.parse(event.data) as LiveConnectionMessage;

        if (type === 'start_vote') {
          const { roundId, pair } = payload;
          navigate('/vote', { state: { roundId, pair, role: 'guest' } });
          return;
        }
      };
    };

    await pc.setRemoteDescription(parseSDP(guestRemoteSDP));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await waitForIceComplete(pc);
    const localDesc = JSON.stringify(pc.localDescription);
    return localDesc;
  };

  /**
   * Sending message from Guest
   */
  const guestSendMessage = (msg: LiveConnectionMessage) => {
    const channel = guestDc;
    if (!channel || channel.readyState !== 'open') return alert('Data channel is not open.');

    // TODO: Do something

    channel.send(JSON.stringify(msg));
  };

  /**
   * Sending message from Host to all Guests
   */
  const hostSendMessage = (msg: LiveConnectionMessage) => {
    messageToGuests(msg, guests);
  };

  /**
   * Reset all states and connections
   */
  const resetAll = () => {
    guests.forEach((p) => {
      p.dc?.close();
      p.pc.close();
    });
    setGuests([]);

    guestDc?.close();
    guestPc?.close();
    setGuestDc(null);
    setGuestPc(null);
    setRole(null);
    setGuestDcState('none');
  };

  return {
    role,
    setRole,
    guests,
    setGuests,
    guestDcState,
    isPreparingGuestOffer,
    isApplyingAnswer,
    initHost,
    hostApplyAnswer,
    initGuest,
    guestSendMessage,
    hostSendMessage,
    resetAll,
  };
};

export default LiveConnectionProvider;
