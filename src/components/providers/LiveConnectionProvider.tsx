import { STUN_URL } from '@/statics/dataChannel';
import type {
  LiveConnectionMessage,
  LiveConnectionRole,
  LiveConnectionState,
  Peer,
} from '@/types/liveConnection.type';
import {
  messageToPeers,
  parseSDP,
  setupDataChannel,
  waitForIceComplete,
} from '@/utils/dataChannel';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

const LiveConnectionContext = createContext<{
  role: LiveConnectionRole | null;
  setRole: Dispatch<SetStateAction<LiveConnectionRole | null>>;
  connectionState: LiveConnectionState;
  setConnectionState: Dispatch<SetStateAction<LiveConnectionState>>;
  peers: Peer[];
  setPeers: Dispatch<SetStateAction<Peer[]>>;
  guestLocalSDP: string;
  setGuestLocalSDP: Dispatch<SetStateAction<string>>;
  guestRemoteSDP: string;
  setGuestRemoteSDP: Dispatch<SetStateAction<string>>;
  guestDcState: RTCDataChannelState | 'none';
  setGuestDcState: Dispatch<RTCDataChannelState | 'none'>;
  guestPc: RTCPeerConnection | null;
  setGuestPc: Dispatch<SetStateAction<RTCPeerConnection | null>>;
  guestDc: RTCDataChannel | null;
  setGuestDc: Dispatch<SetStateAction<RTCDataChannel | null>>;
}>({
  role: null,
  setRole: () => {},
  connectionState: 'disconnected',
  setConnectionState: () => {},
  peers: [],
  setPeers: () => [],
  guestLocalSDP: '',
  setGuestLocalSDP: () => {},
  guestRemoteSDP: '',
  setGuestRemoteSDP: () => {},
  guestDcState: 'none',
  setGuestDcState: () => {},
  guestPc: null,
  setGuestPc: () => {},
  guestDc: null,
  setGuestDc: () => {},
});

const LiveConnectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<LiveConnectionRole | null>(null);
  const [status, setStatus] = useState<LiveConnectionState>('disconnected');
  const [peers, setPeers] = useState<Peer[]>([]);

  const [guestPc, setGuestPc] = useState<RTCPeerConnection | null>(null);
  const [guestDc, setGuestDc] = useState<RTCDataChannel | null>(null);
  const [guestLocalSDP, setGuestLocalSDP] = useState('');
  const [guestRemoteSDP, setGuestRemoteSDP] = useState('');
  const [guestDcState, setGuestDcState] = useState<RTCDataChannelState | 'none'>('none');

  // Setting connection state
  useEffect(() => {
    // TODO: Condition needs to be improved
    const isConnecting =
      role === 'host'
        ? peers.some((p) => p.pc.connectionState === 'connecting')
        : guestPc?.connectionState === 'connecting';

    const isConnected =
      role === 'host'
        ? peers.some((p) => p.pc.connectionState === 'connected')
        : guestPc?.connectionState === 'connected';

    setStatus(isConnecting ? 'connecting' : isConnected ? 'connected' : 'disconnected');
  }, [role, peers, guestPc?.connectionState]);

  return (
    <LiveConnectionContext.Provider
      value={{
        role,
        setRole,
        connectionState: status,
        setConnectionState: setStatus,
        peers,
        setPeers,
        guestLocalSDP,
        setGuestLocalSDP,
        guestRemoteSDP,
        setGuestRemoteSDP,
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
  const {
    role,
    setRole,
    connectionState,
    setConnectionState,
    peers,
    setPeers,
    guestLocalSDP,
    setGuestLocalSDP,
    guestRemoteSDP,
    setGuestRemoteSDP,
    guestDcState,
    setGuestDcState,
    guestPc,
    setGuestPc,
    guestDc,
    setGuestDc,
  } = useContext(LiveConnectionContext);

  const hostCreatePeerOffer = async () => {
    if (role !== 'host') return;
    const pc = new RTCPeerConnection({ iceServers: [{ urls: STUN_URL }] });
    const dc = pc.createDataChannel('votes');

    function onInit(peer: Peer) {
      setPeers((state) => state.map((x) => (x.id === peer.id ? { ...peer } : x)));
    }

    function onOpen(peer: Peer) {
      setPeers((state) => state.map((x) => (x.id === peer.id ? { ...peer } : x)));
      // dc.send(JSON.stringify({ type: 'sync', votes } satisfies Msg)); //TODO: Sync votes
    }

    function onClose(peer: Peer) {
      setPeers((state) => state.map((x) => (x.id === peer.id ? { ...peer } : x)));
    }

    function onError(peer: Peer) {
      setPeers((state) => state.map((x) => (x.id === peer.id ? { ...peer } : x)));
    }

    function onMessage(_: Peer, message: MessageEvent) {
      const msg = JSON.parse(message.data) as LiveConnectionMessage; // TODO: Do something
      // if (msg.type === 'vote') {
      //   setVotes((v) => {
      //     const nv = { ...v, [msg.choice]: v[msg.choice] + 1 } as Record<VoteChoice, number>;
      //     // ブロードキャスト
      //     broadcast({ type: 'sync', votes: nv });
      //     return nv;
      //   });
      // }
    }

    const params = {
      peerConnection: pc,
      onInit,
      onOpen,
      onClose,
      onError,
      onMessage,
    };

    const peer = setupDataChannel({
      ...params,
      channel: dc,
    });

    pc.ondatachannel = (ev) => setupDataChannel({ ...params, channel: ev.channel });
    pc.onconnectionstatechange = () => {
      setPeers((state) => state.map((x) => (x.id === peer.id ? { ...peer } : x)));
    };
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await waitForIceComplete(pc);
    peer.localSDP = JSON.stringify(pc.localDescription);
    setPeers((state) => [...state, peer]);
  };

  const hostApplyAnswer = async (peerId: string) => {
    const peer = peers.find((p) => p.id === peerId);
    if (!peer) return;
    if (!peer.remoteSDP) return alert('Please set remote SDP first.');
    await peer.pc.setRemoteDescription(parseSDP(peer.remoteSDP));
  };

  const guestSetOfferCreateAnswer = async () => {
    if (!guestRemoteSDP) return alert('Please set remote SDP first.');
    const pc = new RTCPeerConnection({ iceServers: [{ urls: STUN_URL }] });
    setGuestPc(pc);

    pc.ondatachannel = (ev) => {
      const ch = ev.channel;
      setGuestDc(ch);
      setGuestDcState(ch.readyState);

      ch.onopen = () => setGuestDcState(ch.readyState);
      ch.onclose = () => setGuestDcState(ch.readyState);
      ch.onerror = () => setGuestDcState(ch.readyState);
      ch.onmessage = (ev) => {
        const msg = JSON.parse(ev.data) as LiveConnectionMessage;
        // if (msg.type === 'sync') setVotes(msg.votes); // TODO: Sync votes
      };
    };

    await pc.setRemoteDescription(parseSDP(guestRemoteSDP));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    await waitForIceComplete(pc);
    setGuestLocalSDP(JSON.stringify(pc.localDescription));
  };

  const guestSendMessage = (msg: LiveConnectionMessage) => {
    const channel = guestDc;
    if (!channel || channel.readyState !== 'open') return alert('Data channel is not open.');

    // TODO: Do something

    channel.send(JSON.stringify(msg));
  };

  const hostSendMessage = (msg: LiveConnectionMessage) => {
    messageToPeers(msg, peers);
  };

  const resetAll = () => {
    peers.forEach((p) => {
      p.dc?.close();
      p.pc.close();
    });
    setPeers([]);

    guestDc?.close();
    guestPc?.close();
    setGuestDc(null);
    setGuestPc(null);
    setRole(null);
    setConnectionState('disconnected');
    setGuestLocalSDP('');
    setGuestRemoteSDP('');
    setGuestDcState('none');
  };

  return {
    role,
    connectionState,
    peers,
    guestLocalSDP,
    guestDcState,
    hostCreatePeerOffer,
    hostApplyAnswer,
    guestSetOfferCreateAnswer,
    guestSendMessage,
    hostSendMessage,
    resetAll,
  };
};

export default LiveConnectionProvider;
