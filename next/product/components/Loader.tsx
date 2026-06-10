"use client";

export default function Loader({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-primary text-white">
      <p className="mb-6 text-2xl font-space font-medium tracking-[0.2em] uppercase animate-pulse">
        Loading Experience
      </p>
      
      <div className="relative h-1 w-80 overflow-hidden rounded-full bg-neutral-800">
        <div 
          className="absolute left-0 top-0 h-full bg-primary-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(249,115,22,0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="mt-4 text-base text-neutral-500 font-mono tracking-wider">
        {progress}%
      </p>
    </div>
  );
}
