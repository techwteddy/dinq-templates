"use client";

import { useCallback, useEffect } from "react";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import { Button } from "@/components/ui/button";

interface VoiceRecorderProps {
  language: "en" | "ur";
  onTranscript: (text: string) => void;
  onRecordingComplete: (blob: Blob | null) => void;
  disabled?: boolean;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function VoiceRecorder({
  language,
  onTranscript,
  onRecordingComplete,
  disabled,
}: VoiceRecorderProps) {
  const {
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
  } = useAudioRecorder({ language, onTranscript });

  const handleStop = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

  // When recordingBlob changes (set after stop), pass it up to the parent
  useEffect(() => {
    onRecordingComplete(recordingBlob);
  }, [recordingBlob, onRecordingComplete]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {!isRecording ? (
          <Button
            type="button"
            onClick={startRecording}
            disabled={disabled}
            variant="outline"
            className="gap-2"
          >
            <MicIcon />
            Start Recording
          </Button>
        ) : (
          <>
            <Button
              type="button"
              onClick={togglePause}
              variant="outline"
              className="gap-2"
            >
              {isPaused ? <PlayIcon /> : <PauseIcon />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button
              type="button"
              onClick={handleStop}
              variant="destructive"
              className="gap-2"
            >
              <StopIcon />
              Stop
            </Button>
          </>
        )}

        {isRecording && (
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                isPaused
                  ? "bg-yellow-500"
                  : "animate-pulse bg-red-500"
              }`}
            />
            <span className="font-mono text-sm text-muted-foreground">
              {formatTime(elapsedSeconds)}
            </span>
          </div>
        )}

        {isTranscribing && (
          <span className="text-xs text-muted-foreground animate-pulse">
            Transcribing...
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="shrink-0 font-medium underline underline-offset-4 hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

function MicIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="14" y="4" width="4" height="16" rx="1" />
      <rect x="6" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <polygon points="6,4 20,12 6,20" />
    </svg>
  );
}
