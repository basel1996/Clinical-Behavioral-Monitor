import { useState } from 'react';
import { storage } from '../lib/storage';
import { COGNITIVE_DISTORTIONS, RuminationLog } from '../types';

export function RuminationInterceptor({ active = true }: { active?: boolean }) {
  const [isAvoiding, setIsAvoiding] = useState<boolean | null>(null);
  const [distortion, setDistortion] = useState<string>('');
  
  const handleSave = () => {
    if (isAvoiding === true && !distortion) {
      alert("You must select a cognitive distortion.");
      return;
    }

    const log: RuminationLog = {
      id: crypto.randomUUID(),
      isAvoiding: isAvoiding || false,
      distortion: isAvoiding ? distortion : null,
      timestamp: Date.now()
    };

    storage.saveRumination(log);
    setIsAvoiding(null);
    setDistortion('');
    alert("Record saved to Local Storage.");
  };

  return (
    <section className={`col-span-1 md:col-span-8 xl:row-span-6 border-2 border-black bg-white p-5 flex-col ${active ? 'flex' : 'hidden md:flex'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold uppercase text-sm tracking-widest">Rumination Interceptor</h2>
        <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5">03</span>
      </div>
      
      <div className="flex flex-col gap-6 flex-grow">
        <div className="p-4 border border-black bg-[#F2F2F2]">
          <p className="text-lg font-bold mb-3">Are you currently engaging in avoidance?</p>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsAvoiding(true)}
              className={`border-2 border-black flex-1 py-2 font-bold uppercase transition-colors ${isAvoiding === true ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
            >
              Yes
            </button>
            <button 
              onClick={() => setIsAvoiding(false)}
              className={`border-2 border-black flex-1 py-2 font-bold uppercase transition-colors ${isAvoiding === false ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}
            >
              No
            </button>
          </div>
        </div>

        {isAvoiding === true && (
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold">Active Cognitive Distortion</label>
            <select 
              value={distortion} 
              onChange={e => setDistortion(e.target.value)}
              className="w-full border-2 border-black p-3 font-mono text-sm bg-white appearance-none cursor-pointer"
            >
              <option value="" disabled>Select from library...</option>
              {COGNITIVE_DISTORTIONS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-auto">
          <button 
            onClick={handleSave}
            disabled={isAvoiding === null}
            className="w-full bg-[#141414] text-white py-4 font-bold text-sm uppercase transition-colors disabled:opacity-30 hover:bg-black"
          >
            Commit Record
          </button>
        </div>
      </div>
    </section>
  );
}
