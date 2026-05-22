import { AvoidanceTracker } from './components/AvoidanceTracker';
import { EmotionalLogger } from './components/EmotionalLogger';
import { RuminationInterceptor } from './components/RuminationInterceptor';
import { DataExport } from './components/DataExport';
import { UrgeSurfer } from './components/UrgeSurfer';
import { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('AVOID');

  const tabs = [
    { id: 'AVOID', label: 'Avoidance' },
    { id: 'EMOT', label: 'Emotional' },
    { id: 'RUMIN', label: 'Rumination' },
    { id: 'EXPORT', label: 'Data Export' },
    { id: 'SURF', label: 'Urge Surfer' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#E4E3E0] text-[#141414] font-sans flex flex-col p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-baseline border-b-2 border-black pb-4 mb-4 md:mb-6 gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Clinical Behavioral Monitor</h1>
          <p className="text-xs font-mono opacity-60">BUILD: 2023.08.24-KOTLIN-ROOM-LOCAL</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600"></div>DATABASE: ACTIVE (LOCAL)
          </div>
          <div className="px-2 py-1 bg-black text-white">USER_ID: 9942-X</div>
        </div>
      </header>

      <nav className="md:hidden grid grid-cols-3 gap-2 mb-4 font-mono text-[10px] uppercase font-bold">
        {tabs.map(t => (
          <button 
            key={t.id} 
            onClick={() => setActiveTab(t.id)}
            className={`border-2 border-black py-2.5 px-1 truncate text-center transition-colors ${activeTab === t.id ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-200'}`}
          >
            {t.label}
          </button>
        ))}
      </nav>
      
      <main className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-grow overflow-y-auto pb-8 xl:pb-0">
        <AvoidanceTracker active={activeTab === 'AVOID'} />
        <EmotionalLogger active={activeTab === 'EMOT'} />
        <RuminationInterceptor active={activeTab === 'RUMIN'} />
        <DataExport active={activeTab === 'EXPORT'} />
        <UrgeSurfer active={activeTab === 'SURF'} onAbort={() => setActiveTab('EMOT')} />
      </main>

      <footer className="mt-6 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono uppercase tracking-widest opacity-60 gap-2">
        <span>Secured Local Volume: /data/user/0/com.clin.behavior/databases/room_local</span>
        <span>No External Network Access Detected</span>
      </footer>
    </div>
  );
}

