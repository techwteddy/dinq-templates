"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { Phone, PhoneOff, Mic, MicOff, Video as VideoIcon, VideoOff } from "lucide-react";
import { Avatar } from "@/components/Avatar";

type CallType = "audio" | "video";

type PeerInfo = { id: string; username: string; avatar_url: string | null };
type Me = { id: string; username: string };

type ActiveCall = {
  callId: string;
  role: "caller" | "callee";
  peer: PeerInfo;
  type: CallType;
  status: "ringing" | "incoming" | "connecting" | "active" | "ended";
};

type CallContextValue = {
  startCall: (peer: PeerInfo, type: CallType) => void;
};

const CallContext = createContext<CallContextValue | null>(null);

export function useCall() {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error("useCall must be used inside <CallProvider>");
  return ctx;
}

const ICE_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

type SignalMessage =
  | {
      kind: "offer";
      callId: string;
      sdp: RTCSessionDescriptionInit;
      from: PeerInfo;
      toId: string;
      callType: CallType;
    }
  | {
      kind: "answer";
      callId: string;
      sdp: RTCSessionDescriptionInit;
      fromId: string;
      toId: string;
    }
  | {
      kind: "ice";
      callId: string;
      candidate: RTCIceCandidateInit;
      fromId: string;
      toId: string;
    }
  | { kind: "hangup"; callId: string; fromId: string; toId: string }
  | { kind: "reject"; callId: string; fromId: string; toId: string };

export function CallProvider({
  me,
  children,
}: {
  me: Me;
  children: React.ReactNode;
}) {
  const [call, setCall] = useState<ActiveCall | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const inboxChannelRef = useRef<RealtimeChannel | null>(null);
  const pendingOfferRef = useRef<SignalMessage | null>(null);
  const pendingIceRef = useRef<RTCIceCandidateInit[]>([]);
  const currentCallRef = useRef<ActiveCall | null>(null);
  const [muted, setMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);

  // Keep a ref in sync with state so event handlers can see latest value
  useEffect(() => {
    currentCallRef.current = call;
  }, [call]);

  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  if (!supabaseRef.current) supabaseRef.current = createClient();
  const supabase = supabaseRef.current;

  const sendSignal = useCallback(
    async (toId: string, msg: SignalMessage) => {
      const ch = supabase.channel(`calls-to-${toId}`);
      await new Promise<void>((resolve) => {
        ch.subscribe((status) => {
          if (status === "SUBSCRIBED") {
            ch.send({ type: "broadcast", event: msg.kind, payload: msg }).then(() =>
              resolve(),
            );
          }
        });
      });
      setTimeout(() => supabase.removeChannel(ch), 400);
    },
    [supabase],
  );

  const cleanup = useCallback(() => {
    try {
      pcRef.current?.getSenders().forEach((s) => s.track?.stop());
      pcRef.current?.close();
    } catch {}
    pcRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    remoteStreamRef.current = null;
    pendingOfferRef.current = null;
    pendingIceRef.current = [];
    setMuted(false);
    setVideoOff(false);
    setCall(null);
  }, []);

  const createPC = useCallback(
    (callId: string, peerId: string) => {
      const pc = new RTCPeerConnection(ICE_CONFIG);
      pcRef.current = pc;
      remoteStreamRef.current = new MediaStream();

      pc.ontrack = (e) => {
        e.streams[0].getTracks().forEach((t) => {
          remoteStreamRef.current?.addTrack(t);
        });
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStreamRef.current;
        if (remoteAudioRef.current) remoteAudioRef.current.srcObject = remoteStreamRef.current;
      };

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          sendSignal(peerId, {
            kind: "ice",
            callId,
            candidate: e.candidate.toJSON(),
            fromId: me.id,
            toId: peerId,
          });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === "connected") {
          setCall((c) => (c ? { ...c, status: "active" } : c));
        } else if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
          cleanup();
        }
      };

      return pc;
    },
    [cleanup, me.id, sendSignal],
  );

  // Subscribe to my inbox — receives all offers/answers/ICE/hangups addressed to me
  useEffect(() => {
    const ch = supabase.channel(`calls-to-${me.id}`, {
      config: { broadcast: { self: false } },
    });

    const handleSignal = async (msg: SignalMessage) => {
      if (msg.kind === "offer") {
        if (pcRef.current || currentCallRef.current) {
          // busy — auto-reject
          sendSignal(msg.from.id, {
            kind: "reject",
            callId: msg.callId,
            fromId: me.id,
            toId: msg.from.id,
          });
          return;
        }
        pendingOfferRef.current = msg;
        setCall({
          callId: msg.callId,
          role: "callee",
          peer: msg.from,
          type: msg.callType,
          status: "incoming",
        });
      } else if (msg.kind === "answer") {
        const pc = pcRef.current;
        const current = currentCallRef.current;
        if (!pc || !current || msg.callId !== current.callId) return;
        try {
          await pc.setRemoteDescription(msg.sdp);
          for (const c of pendingIceRef.current) {
            try {
              await pc.addIceCandidate(c);
            } catch {}
          }
          pendingIceRef.current = [];
          setCall((c) => (c ? { ...c, status: "connecting" } : c));
        } catch (e) {
          console.error("[call] setRemoteDescription failed", e);
        }
      } else if (msg.kind === "ice") {
        const pc = pcRef.current;
        const current = currentCallRef.current;
        if (!current || msg.callId !== current.callId) return;
        if (pc && pc.remoteDescription) {
          try {
            await pc.addIceCandidate(msg.candidate);
          } catch {}
        } else {
          pendingIceRef.current.push(msg.candidate);
        }
      } else if (msg.kind === "hangup" || msg.kind === "reject") {
        const current = currentCallRef.current;
        if (current && msg.callId === current.callId) cleanup();
      }
    };

    (["offer", "answer", "ice", "hangup", "reject"] as const).forEach((evt) => {
      ch.on("broadcast", { event: evt }, (p) => handleSignal(p.payload as SignalMessage));
    });

    ch.subscribe();
    inboxChannelRef.current = ch;
    return () => {
      supabase.removeChannel(ch);
      inboxChannelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.id]);

  // Start outgoing call
  const startCall = useCallback(
    async (peer: PeerInfo, type: CallType) => {
      if (pcRef.current) return;
      const callId = `${me.id}-${peer.id}-${Date.now()}`;
      setCall({ callId, role: "caller", peer, type, status: "ringing" });

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: type === "video" ? { facingMode: "user" } : false,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        const pc = createPC(callId, peer.id);
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        await sendSignal(peer.id, {
          kind: "offer",
          callId,
          sdp: offer,
          from: { id: me.id, username: me.username, avatar_url: null },
          toId: peer.id,
          callType: type,
        });
      } catch (err) {
        console.error("[call] start failed:", err);
        alert(err instanceof Error ? err.message : "Could not start call");
        cleanup();
      }
    },
    [cleanup, createPC, me.id, me.username, sendSignal],
  );

  // Accept incoming call
  const acceptCall = useCallback(async () => {
    const offerMsg = pendingOfferRef.current;
    if (!offerMsg || offerMsg.kind !== "offer" || !call) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: call.type === "video" ? { facingMode: "user" } : false,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = createPC(call.callId, call.peer.id);
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));

      await pc.setRemoteDescription(offerMsg.sdp);
      // Flush any ICE that arrived before acceptance
      for (const c of pendingIceRef.current) {
        try {
          await pc.addIceCandidate(c);
        } catch {}
      }
      pendingIceRef.current = [];

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      await sendSignal(call.peer.id, {
        kind: "answer",
        callId: call.callId,
        sdp: answer,
        fromId: me.id,
        toId: call.peer.id,
      });
      setCall((c) => (c ? { ...c, status: "connecting" } : c));
    } catch (err) {
      console.error("[call] accept failed:", err);
      alert(err instanceof Error ? err.message : "Could not accept call");
      cleanup();
    }
  }, [call, cleanup, createPC, me.id, sendSignal]);

  const rejectCall = useCallback(() => {
    if (!call) return;
    sendSignal(call.peer.id, {
      kind: "reject",
      callId: call.callId,
      fromId: me.id,
      toId: call.peer.id,
    });
    cleanup();
  }, [call, cleanup, me.id, sendSignal]);

  const hangUp = useCallback(() => {
    if (!call) return;
    sendSignal(call.peer.id, {
      kind: "hangup",
      callId: call.callId,
      fromId: me.id,
      toId: call.peer.id,
    });
    cleanup();
  }, [call, cleanup, me.id, sendSignal]);

  const toggleMute = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMuted(!track.enabled);
  }, []);

  const toggleVideo = useCallback(() => {
    const track = localStreamRef.current?.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setVideoOff(!track.enabled);
  }, []);

  // Rebind video refs when UI mounts
  useEffect(() => {
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    if (remoteVideoRef.current && remoteStreamRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
    if (remoteAudioRef.current && remoteStreamRef.current) {
      remoteAudioRef.current.srcObject = remoteStreamRef.current;
    }
  }, [call]);

  return (
    <CallContext.Provider value={{ startCall }}>
      {children}

      {call && (
        <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col">
          <div className="flex-1 relative flex items-center justify-center">
            {call.type === "video" ? (
              <>
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover bg-neutral-900"
                />
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute top-4 right-4 w-28 h-40 rounded-lg object-cover border border-white/20 bg-neutral-800"
                  style={{ transform: "scaleX(-1)" }}
                />
              </>
            ) : (
              <>
                <audio ref={remoteAudioRef} autoPlay />
                <div className="flex flex-col items-center gap-4">
                  <Avatar
                    username={call.peer.username}
                    avatarUrl={call.peer.avatar_url}
                    size={120}
                  />
                  <div className="text-xl font-semibold">{call.peer.username}</div>
                </div>
              </>
            )}

            <div className="absolute top-6 left-0 right-0 text-center text-sm text-white/80">
              {call.status === "ringing" && "Ringing…"}
              {call.status === "incoming" &&
                (call.type === "video" ? "Incoming video call" : "Incoming call")}
              {call.status === "connecting" && "Connecting…"}
              {call.status === "active" && "Connected"}
            </div>
          </div>

          <div className="pb-10 pt-6 flex items-center justify-center gap-6">
            {call.status === "incoming" ? (
              <>
                <button
                  onClick={rejectCall}
                  className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center"
                  aria-label="Decline"
                >
                  <PhoneOff size={26} />
                </button>
                <button
                  onClick={acceptCall}
                  className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center"
                  aria-label="Accept"
                >
                  <Phone size={26} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleMute}
                  className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>
                {call.type === "video" && (
                  <button
                    onClick={toggleVideo}
                    className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"
                    aria-label={videoOff ? "Turn camera on" : "Turn camera off"}
                  >
                    {videoOff ? <VideoOff size={22} /> : <VideoIcon size={22} />}
                  </button>
                )}
                <button
                  onClick={hangUp}
                  className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center"
                  aria-label="Hang up"
                >
                  <PhoneOff size={26} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </CallContext.Provider>
  );
}
