import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { UrgeSurfLog } from '../types';

export function UrgeSurfer({ active = true, onAbort }: { active?: boolean, onAbort?: () => void }) {
  const DEFAULT_SECONDS = 900; // 15:00
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS);
  const [isTiming, setIsTiming] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTiming && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTiming && secondsLeft === 0) {
      // Completed, log silently
      const log: UrgeSurfLog = {
        id: crypto.randomUUID(),
        startTime: startTime!,
        durationCompletedSeconds: DEFAULT_SECONDS,
        status: 'COMPLETED',
      };
      storage.saveUrgeSurf(log);
      setIsTiming(false);
      setSecondsLeft(DEFAULT_SECONDS);
      setStartTime(null);
    }
    return () => clearInterval(interval);
  }, [isTiming, secondsLeft, startTime]);

  const handleStart = () => {
    setIsTiming(true);
    setStartTime(Date.now());
  };

  const handleAbort = () => {
    const log: UrgeSurfLog = {
      id: crypto.randomUUID(),
      startTime: startTime!,
      durationCompletedSeconds: DEFAULT_SECONDS - secondsLeft,
      status: 'ABORTED',
    };
    storage.saveUrgeSurf(log);
    setIsTiming(false);
    setSecondsLeft(DEFAULT_SECONDS);
    setStartTime(null);

    // Force-navigate to Emotional Logger
    if (onAbort) onAbort();
    setTimeout(() => {
      const target = document.getElementById('emotional-logger');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        // Focus and populate the input to prompt documentation
        const input = document.getElementById('emotional-trigger-input') as HTMLTextAreaElement;
        if (input) {
          input.focus();
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set;
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(input, "(Aborted Urge Surf) ");
            const ev = new Event('input', { bubbles: true });
            input.dispatchEvent(ev);
          }
        }
      }
    }, 50);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <section className={`col-span-1 md:col-span-12 xl:row-span-4 border-2 border-black bg-white p-5 flex-col items-center justify-center ${active ? 'flex' : 'hidden md:flex'}`}>
      <div className="flex justify-between items-center w-full mb-8">
        <h2 className="font-bold uppercase text-sm tracking-widest">"Urge Surfing" Distress Timer</h2>
        <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5">05</span>
      </div>
      
      <div className="flex flex-col items-center w-full max-w-lg mb-4">
        <div className="text-8xl md:text-9xl font-mono font-black tracking-tighter leading-none mb-12 text-[#141414] select-none">
          {formatTime(secondsLeft)}
        </div>
        
        <div className="w-full flex">
          {!isTiming ? (
            <button 
              onClick={handleStart}
              className="w-full py-6 bg-white text-[#141414] border-4 border-[#141414] font-bold text-2xl tracking-widest uppercase transition-colors hover:bg-[#141414] hover:text-white"
            >
              [INITIATE_SURF]
            </button>
          ) : (
            <button 
              onClick={handleAbort}
              className="w-full py-6 bg-[#141414] text-white border-4 border-[#141414] font-bold text-2xl tracking-widest uppercase transition-colors hover:bg-gray-800"
            >
              [ABORT_SURF]
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
