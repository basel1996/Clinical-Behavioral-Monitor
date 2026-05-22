import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { AvoidanceLog, AVOIDANCE_TAGS } from '../types';

export function AvoidanceTracker({ active = true }: { active?: boolean }) {
  const [intentTime, setIntentTime] = useState<number | null>(null);
  const [lastLog, setLastLog] = useState<AvoidanceLog | null>(null);
  const [logs, setLogs] = useState<AvoidanceLog[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');

  // Restore intent across reloads
  useEffect(() => {
    const savedIntent = localStorage.getItem('active_intent');
    const savedTag = localStorage.getItem('active_intent_tag');
    if (savedIntent) setIntentTime(parseInt(savedIntent, 10));
    if (savedTag) setSelectedTag(savedTag);
    setLogs(storage.getAvoidance());
  }, []);

  const handleIntent = () => {
    if (!selectedTag) return;
    const now = Date.now();
    setIntentTime(now);
    localStorage.setItem('active_intent', now.toString());
    localStorage.setItem('active_intent_tag', selectedTag);
  };

  const handleEngagement = () => {
    if (!intentTime) return;
    const now = Date.now();
    const latencyMs = now - intentTime;
    const latencyMinutes = +(latencyMs / 60000).toFixed(2);

    const log: AvoidanceLog = {
      id: crypto.randomUUID(),
      intentTime,
      engagementTime: now,
      latencyMinutes,
      tag: selectedTag
    };

    storage.saveAvoidance(log);
    setLastLog(log);
    setLogs(storage.getAvoidance());
    setIntentTime(null);
    setSelectedTag('');
    localStorage.removeItem('active_intent');
    localStorage.removeItem('active_intent_tag');
  };

  const handleReset = () => {
    setIntentTime(null);
    setSelectedTag('');
    localStorage.removeItem('active_intent');
    localStorage.removeItem('active_intent_tag');
  };

  const getHighestAvoidanceTag = () => {
    if (logs.length === 0) return "-";
    const today = new Date().setHours(0, 0, 0, 0);
    const todaysLogs = logs.filter(l => l.engagementTime >= today && l.tag);
    
    if (todaysLogs.length === 0) return "-";

    const tagStats = todaysLogs.reduce((acc, log) => {
      if (!acc[log.tag!]) acc[log.tag!] = { total: 0, count: 0 };
      acc[log.tag!].total += log.latencyMinutes;
      acc[log.tag!].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    let maxTag = "-";
    let maxAvg = -1;

    for (const [tag, stats] of Object.entries(tagStats)) {
      const avg = stats.total / stats.count;
      if (avg > maxAvg) {
        maxAvg = avg;
        maxTag = tag;
      }
    }

    return maxTag;
  };

  return (
    <section className={`col-span-1 md:col-span-5 xl:row-span-4 border-2 border-black bg-white p-5 flex-col ${active ? 'flex' : 'hidden md:flex'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold uppercase text-sm tracking-widest">Avoidance Latency Tracker</h2>
        <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5">01</span>
      </div>
      
      <div className="flex-grow flex flex-col gap-4">
        <select 
          value={selectedTag} 
          onChange={e => setSelectedTag(e.target.value)}
          disabled={intentTime !== null}
          className="w-full border-2 border-black p-4 font-mono text-sm bg-white appearance-none cursor-pointer rounded-none disabled:opacity-50 focus:outline-none"
        >
          <option value="" disabled>-- SELECT TASK CATEGORY --</option>
          {AVOIDANCE_TAGS.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <button
          onClick={handleIntent}
          disabled={intentTime !== null || selectedTag === ''}
          className="w-full border-2 border-black py-4 font-bold text-sm uppercase transition-colors disabled:opacity-30 enabled:hover:bg-black enabled:hover:text-white"
        >
          {intentTime ? `Intent Logged: ${new Date(intentTime).toLocaleTimeString()}` : "Intent to Start High-Effort Task"}
        </button>

        <button
          onClick={handleEngagement}
          disabled={intentTime === null}
          className="w-full border-2 border-black py-4 font-bold text-sm uppercase transition-colors disabled:opacity-30 enabled:hover:bg-black enabled:hover:text-white"
        >
          Actual Task Engagement
        </button>
        
        {intentTime && (
          <button onClick={handleReset} className="text-[10px] text-center w-full uppercase font-bold opacity-60 hover:opacity-100">
            [Cancel Active Intent]
          </button>
        )}

        <div className="mt-auto flex flex-col gap-4">
          <div className="pt-4 border-t border-black border-dashed flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col border-r border-black border-dashed pr-4">
                <span className="text-[10px] uppercase font-bold opacity-50">Total Session Logs</span>
                <span className="text-2xl font-mono font-bold leading-none mt-1">
                  {logs.length.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col pl-2 text-right">
                <span className="text-[10px] uppercase block opacity-50">Avg Latency</span>
                <span className="font-mono text-2xl font-bold mt-1 leading-none">
                  {logs.length > 0 ? (logs.reduce((acc, l) => acc + l.latencyMinutes, 0) / logs.length).toFixed(1) : "-"}
                  <span className="text-sm font-sans opacity-60 ml-1">m</span>
                </span>
              </div>
            </div>
            <div className="border-t border-black border-dashed pt-4 flex flex-col">
              <span className="text-[10px] uppercase font-bold opacity-50">Highest Avoidance Tag (Today)</span>
              <span className="font-mono text-sm font-bold mt-1 leading-none truncate block">
                {getHighestAvoidanceTag()}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-black border-dashed flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold opacity-50">Current Latency</span>
              <span className="text-4xl font-mono font-bold leading-none">
                {lastLog ? lastLog.latencyMinutes : "-"}
                <span className="text-base font-sans opacity-60 ml-1">m</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase block opacity-50">Last Logged</span>
              <span className="font-mono text-xs">{lastLog ? new Date(lastLog.engagementTime).toLocaleTimeString() : "--:--:--"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
