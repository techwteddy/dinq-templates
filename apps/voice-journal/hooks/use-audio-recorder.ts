"use client";

import { useState, useRef, useCallback } from "react";

interface UseAudioRecorderOptions {
  language: "en" | "ur";
  onTranscript: (text: string) => void;
}

interface UseAudioRecorderReturn {
  isRecording: boolean;
  isPaused: boolean;
  isTranscribing: boolean;
  elapsedSeconds: number;
  error: string | null;
  recordingBlob: Blob | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  togglePause: () => void;
  clearError: () => void;
  clearRecordingBlob: () => void;
}

const CHUNK_INTERVAL_MS = 5000;

function getSupportedMimeType(): string | null {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return null;
}

function mimeToExtension(mime: string): string {
  if (mime.includes("webm")) return "webm";
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("ogg")) return "ogg";
  return "webm";
}

export function useAudioRecorder({
  language,
  onTranscript,
}: UseAudioRecorderOptions): UseAudioRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const allChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingRef = useRef(0);
  const languageRef = useRef(language);
  const mimeTypeRef = useRef<string>("audio/webm");
  const isRecordingRef = useRef(false);
  const isPausedRef = useRef(false);

  languageRef.current = language;

  const clearError = useCallback(() => setError(null), []);
  const clearRecordingBlob = useCallback(() => setRecordingBlob(null), []);

  async function transcribeBlob(blob: Blob) {
    if (blob.size < 1000) return; // skip tiny blobs with no real audio

    pendingRef.current++;
    setIsTranscribing(true);

    try {
      const ext = mimeToExtension(mimeTypeRef.current);
      const file = new File([blob], `recording.${ext}`, {
        type: mimeTypeRef.current,
      });

      const formData = new FormData();
      formData.append("audio", file);
      formData.append("language", languageRef.current);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `Server error (${response.status})`);
      }

      const data = await response.json();
      if (data.text && data.text.trim()) {
        onTranscript(data.text.trim());
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Transcription failed";
      setError(msg);
    } finally {
      pendingRef.current--;
      if (pendingRef.current === 0) {
        setIsTranscribing(false);
      }
    }
  }

  function createRecorder(stream: MediaStream): MediaRecorder {
    const recorder = new MediaRecorder(stream, {
      mimeType: mimeTypeRef.current,
      audioBitsPerSecond: 64000,
    });

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    recorder.onerror = () => {
      setError("Recording error occurred. Please try again.");
    };

    return recorder;
  }

  function stopCurrentRecorderAndSend() {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    return new Promise<void>((resolve) => {
      recorder.onstop = () => {
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, {
            type: mimeTypeRef.current,
          });
          chunksRef.current = [];
          allChunksRef.current.push(blob);
          transcribeBlob(blob);
        }
        resolve();
      };
      recorder.stop();
    });
  }

  async function cycleRecorder() {
    if (!isRecordingRef.current || isPausedRef.current) return;
    const stream = streamRef.current;
    if (!stream) return;

    await stopCurrentRecorderAndSend();

    if (!isRecordingRef.current || isPausedRef.current) return;

    const newRecorder = createRecorder(stream);
    recorderRef.current = newRecorder;
    newRecorder.start();
  }

  const cleanup = useCallback(() => {
    if (cycleRef.current) {
      clearInterval(cycleRef.current);
      cycleRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    recorderRef.current = null;
    chunksRef.current = [];
    isRecordingRef.current = false;
    isPausedRef.current = false;
    setIsRecording(false);
    setIsPaused(false);
    setElapsedSeconds(0);
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);

    if (typeof window === "undefined") {
      setError("Recording is only available in the browser.");
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(
        "Your browser does not support audio recording. Please use a modern browser like Chrome, Firefox, or Safari."
      );
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      setError(
        "MediaRecorder is not supported in your browser. Please use Chrome, Firefox, or Safari."
      );
      return;
    }

    const mimeType = getSupportedMimeType();
    if (!mimeType) {
      setError(
        "No supported audio format found. Please try a different browser."
      );
      return;
    }
    mimeTypeRef.current = mimeType;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;
      isRecordingRef.current = true;
      isPausedRef.current = false;
      allChunksRef.current = [];
      setRecordingBlob(null);

      const recorder = createRecorder(stream);
      recorderRef.current = recorder;
      recorder.start();

      setIsRecording(true);
      setIsPaused(false);
      setElapsedSeconds(0);

      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      cycleRef.current = setInterval(() => {
        cycleRecorder();
      }, CHUNK_INTERVAL_MS);
    } catch (err) {
      if (err instanceof DOMException) {
        if (
          err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError"
        ) {
          setError(
            "Microphone access was denied. Please allow microphone access in your browser settings and try again."
          );
          return;
        }
        if (err.name === "NotFoundError") {
          setError(
            "No microphone found. Please connect a microphone and try again."
          );
          return;
        }
      }
      setError("Failed to start recording. Please try again.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleanup]);

  const stopRecording = useCallback(async () => {
    if (cycleRef.current) {
      clearInterval(cycleRef.current);
      cycleRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    isRecordingRef.current = false;
    isPausedRef.current = false;

    await stopCurrentRecorderAndSend();

    if (allChunksRef.current.length > 0) {
      const fullBlob = new Blob(allChunksRef.current, {
        type: mimeTypeRef.current,
      });
      setRecordingBlob(fullBlob);
    }
    allChunksRef.current = [];

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    recorderRef.current = null;
    chunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
    setElapsedSeconds(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const togglePause = useCallback(() => {
    if (!isRecordingRef.current) return;

    if (!isPausedRef.current) {
      // Pausing: stop current recorder and send what we have
      isPausedRef.current = true;
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      stopCurrentRecorderAndSend();
    } else {
      // Resuming: start a new recorder
      isPausedRef.current = false;
      setIsPaused(false);
      const stream = streamRef.current;
      if (stream) {
        const newRecorder = createRecorder(stream);
        recorderRef.current = newRecorder;
        newRecorder.start();
      }
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isRecording,
    isPaused,
    isTranscribing,
    elapsedSeconds,
    error,
    recordingBlob,
    startRecording,
    stopRecording,
    togglePause,
    clearError,
    clearRecordingBlob,
  };
}
