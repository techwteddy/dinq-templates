'use client';

export function LoadingAnimation() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center z-50 overflow-hidden">
      <style>{`
        @keyframes roll-text {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes bounce-3d {
          0%, 100% { 
            transform: translateY(0) scale(1);
            box-shadow: 0 20px 50px rgba(0,0,0,0.4);
          }
          50% { 
            transform: translateY(-80px) scale(1.1);
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
          }
        }
        @keyframes rotate-360 {
          0% { transform: rotateX(0) rotateY(0) rotateZ(0); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(212, 165, 116, 0.8), 
                        inset 0 0 20px rgba(212, 165, 116, 0.4);
          }
          50% { 
            box-shadow: 0 0 40px rgba(212, 165, 116, 1), 
                        inset 0 0 30px rgba(212, 165, 116, 0.6);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(-100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .rolling-ball {
          animation: bounce-3d 1.2s ease-in-out infinite, 
                     rotate-360 2s linear infinite,
                     pulse-glow 2s ease-in-out infinite;
        }
        .roll-text {
          animation: roll-text 4s linear infinite;
          white-space: nowrap;
          font-size: 1.5rem;
          font-weight: bold;
          color: #d4a574;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          letter-spacing: 0.1em;
        }
        .float-icon {
          animation: float 3s ease-in-out infinite;
        }
        .slide-in-left {
          animation: slide-left 0.8s ease-out;
        }
        .slide-in-right {
          animation: slide-right 0.8s ease-out;
        }
      `}</style>

      <div className="text-center z-10 relative">
        {/* Animated Rolling Ball */}
        <div className="float-icon mb-12">
          <div className="rolling-ball w-28 h-28 rounded-full bg-gradient-to-br from-accent via-accent/80 to-accent/60 relative">
            {/* Inner reflections for 3D effect */}
            <div className="absolute top-6 left-8 w-8 h-8 bg-white/30 rounded-full blur-md" />
            <div className="absolute bottom-8 right-6 w-6 h-6 bg-white/20 rounded-full blur-sm" />
          </div>
        </div>

        {/* Scrolling Motto */}
        <div className="overflow-hidden w-full mb-8 h-10 flex items-center justify-center">
          <div className="roll-text">WE ARE LASU WE ARE GREAT</div>
        </div>

        {/* Status Text with animations */}
        <div className="space-y-3">
          <p className="text-white/80 text-base font-medium slide-in-left">
            Loading your education hub...
          </p>
          <div className="flex gap-1 justify-center">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
