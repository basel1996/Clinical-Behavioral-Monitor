import { storage } from '../lib/storage';

export function DataExport({ active = true }: { active?: boolean }) {
  return (
    <section className={`col-span-1 md:col-span-4 xl:row-span-6 border-2 border-black bg-white p-5 flex-col ${active ? 'flex' : 'hidden md:flex'}`}>
      <div className="flex justify-between items-center mb-4">
         <h2 className="font-bold uppercase text-sm tracking-widest">Raw Data Engine</h2>
         <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5">04</span>
      </div>
      
      <div className="flex flex-col gap-3 mt-auto h-full justify-between">
        <div className="flex-grow font-mono text-[10px] overflow-hidden whitespace-nowrap opacity-60 flex flex-col gap-1 mb-4 pt-4">
          <div>TIMESTAMP,TYPE,VAL</div>
          <div>{Date.now()},SYS,START</div>
          <div className="italic">... [RESTRICTED] ...</div>
        </div>
        
        <div className="border-t border-black pt-4 mb-2">
          <span className="text-[10px] uppercase font-bold block mb-1">Data Storage</span>
          <span className="text-2xl font-mono text-[#141414] font-black">LOCAL_ENV</span>
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={storage.exportToCsv}
            className="w-full bg-[#141414] text-white py-4 font-bold text-sm uppercase flex items-center justify-center transition-colors hover:bg-black"
          >
            Export Combined (.CSV)
          </button>
          
          <button 
            onClick={storage.exportSeparateCsvs}
            className="w-full border-2 border-[#141414] bg-white text-[#141414] py-4 font-bold text-sm uppercase flex items-center justify-center transition-colors hover:bg-[#F2F2F2]"
          >
            Export Separate Files (4x .CSV)
          </button>
        </div>
      </div>
    </section>
  );
}
