"use client";

interface AudioPlayerProps {
  audioUrl: string;
}

export function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-input bg-muted/30 px-4 py-3">
      <SpeakerIcon />
      <div className="flex-1">
        <p className="text-sm font-medium">Original Recording</p>
        <p className="text-xs text-muted-foreground">
          Listen to the audio used for this note
        </p>
      </div>
      <audio controls preload="metadata" className="h-8 max-w-64">
        <source src={audioUrl} />
        Your browser does not support audio playback.
      </audio>
    </div>
  );
}

function SpeakerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-muted-foreground"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
