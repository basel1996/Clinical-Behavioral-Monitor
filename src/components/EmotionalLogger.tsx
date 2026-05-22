import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { EmotionalLog, INTERPERSONAL_DYNAMICS } from '../types';

export function EmotionalLogger({ active = true }: { active?: boolean }) {
  const [trigger, setTrigger] = useState('');
  const [intensity, setIntensity] = useState<number>(5);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isInterpersonal, setIsInterpersonal] = useState<boolean>(false);
  const [interpersonalDynamic, setInterpersonalDynamic] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  const toggleTimer = () => {
    if (!startTime) {
      if (!trigger) {
        alert("Enter trigger event first.");
        return;
      }
      if (isInterpersonal && !interpersonalDynamic) {
        alert("Select an interpersonal dynamic.");
        return;
      }
      setStartTime(Date.now());
    } else {
      // Stop and save
      const now = Date.now();
      const log: EmotionalLog = {
        id: crypto.randomUUID(),
        trigger,
        intensity,
        startTime,
        endTime: now,
        durationMinutes: +(elapsedSeconds / 60).toFixed(2),
        isInterpersonal,
        interpersonalDynamic: isInterpersonal ? interpersonalDynamic : null,
      };
      
      storage.saveEmotional(log);
      
      // Reset form
      setTrigger('');
      setIntensity(5);
      setStartTime(null);
      setElapsedSeconds(0);
      setIsInterpersonal(false);
      setInterpersonalDynamic('');
      alert("Emotional log saved.");
    }
  };

  const isTiming = startTime !== null;

  return (
    <section id="emotional-logger" className={`col-span-1 md:col-span-7 xl:row-span-4 border-2 border-black bg-white p-5 flex-col ${active ? 'flex' : 'hidden md:flex'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold uppercase text-sm tracking-widest">Emotional Refractory Logger</h2>
        <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5">02</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] uppercase font-bold">Triggering Event</label>
          <textarea 
            id="emotional-trigger-input"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            disabled={isTiming}
            placeholder="Enter descriptive text..."
            className="flex-grow border border-black p-2 font-mono text-xs resize-none placeholder:opacity-30 appearance-none focus:outline-none disabled:opacity-50"
          ></textarea>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold">Intensity ({intensity}/10)</label>
            <div className="flex justify-between font-mono text-xs mb-1">
              <span>1</span>
              <span>10</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              disabled={isTiming}
              className="accent-black w-full h-4 bg-[#E4E3E0] appearance-none disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div 
              className={`flex items-center gap-2 border-2 border-black p-2 uppercase text-[10px] font-bold ${isTiming ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'}`} 
              onClick={() => !isTiming && setIsInterpersonal(!isInterpersonal)}
            >
              <div className={`w-4 h-4 border-2 border-black flex items-center justify-center ${isInterpersonal ? 'bg-black' : 'bg-white'}`}>
              </div>
              [INTERPERSONAL_TRIGGER: {isInterpersonal ? 'Y' : 'N'}]
            </div>
            {isInterpersonal && (
              <select 
                value={interpersonalDynamic}
                onChange={e => setInterpersonalDynamic(e.target.value)}
                disabled={isTiming}
                className="w-full border-2 border-black p-2 font-mono text-[10px] bg-white appearance-none cursor-pointer rounded-none disabled:opacity-50 focus:outline-none"
              >
                <option value="" disabled>-- SELECT DYNAMIC --</option>
                {INTERPERSONAL_DYNAMICS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-auto">
            <label className="text-[10px] uppercase font-bold">Regulated Baseline</label>
            <div className="border-2 border-black flex items-center justify-between p-3">
              <span className="font-mono text-lg">
                {Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}:
                {(elapsedSeconds % 60).toString().padStart(2, '0')}:00
              </span>
              <button 
                onClick={toggleTimer} 
                className={`px-3 py-1 text-xs uppercase font-bold transition-colors ${isTiming ? 'bg-red-600 text-white hover:bg-black' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                {isTiming ? "Stop" : "Start"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={isTiming ? toggleTimer : () => alert("Start and stop the timer to commit a log.")}
        className="w-full bg-black text-white hover:bg-gray-800 transition-colors py-2 mt-4 font-bold text-xs uppercase"
      >
        Commit Log Entry
      </button>
    </section>
  );
}
