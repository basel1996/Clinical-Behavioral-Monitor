import { AvoidanceLog, EmotionalLog, RuminationLog } from '../types';

const KEYS = {
  AVOIDANCE: 'cbt_avoidance_logs',
  EMOTIONAL: 'cbt_emotional_logs',
  RUMINATION: 'cbt_rumination_logs',
  URGE_SURF: 'cbt_urge_surf_logs',
};

const getLogs = <T>(key: string): T[] => {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : [];
};

const saveLog = <T>(key: string, log: T) => {
  const logs = getLogs<T>(key);
  logs.push(log);
  localStorage.setItem(key, JSON.stringify(logs));
};

export const storage = {
  saveAvoidance: (log: AvoidanceLog) => saveLog(KEYS.AVOIDANCE, log),
  getAvoidance: () => getLogs<AvoidanceLog>(KEYS.AVOIDANCE),
  
  saveEmotional: (log: EmotionalLog) => saveLog(KEYS.EMOTIONAL, log),
  getEmotional: () => getLogs<EmotionalLog>(KEYS.EMOTIONAL),
  
  saveRumination: (log: RuminationLog) => saveLog(KEYS.RUMINATION, log),
  getRumination: () => getLogs<RuminationLog>(KEYS.RUMINATION),

  saveUrgeSurf: (log: any) => saveLog(KEYS.URGE_SURF, log),
  getUrgeSurf: () => getLogs<any>(KEYS.URGE_SURF),

  exportToCsv: () => {
    const avoidance = getLogs<Exclude<AvoidanceLog, 'id'>>(KEYS.AVOIDANCE).map(l => 
      `Avoidance,${new Date(l.intentTime).toISOString()},${new Date(l.engagementTime).toISOString()},Latency:${l.latencyMinutes.toFixed(2)}m,Tag:${l.tag || 'NONE'}`
    );
    
    const emotional = getLogs<Exclude<EmotionalLog, 'id'>>(KEYS.EMOTIONAL).map(l => 
      `Emotional,Trigger:${l.trigger},Intensity:${l.intensity},${new Date(l.startTime).toISOString()},${new Date(l.endTime).toISOString()},Duration:${l.durationMinutes.toFixed(2)}m,Interpersonal:${l.isInterpersonal ? 'Y' : 'N'},Dynamic:${l.interpersonalDynamic || 'NONE'}`
    );

    const rumination = getLogs<Exclude<RuminationLog, 'id'>>(KEYS.RUMINATION).map(l => 
      `Rumination,${new Date(l.timestamp).toISOString()},Avoiding? ${l.isAvoiding},Distortion: ${l.distortion || 'N/A'},,`
    );

    const urgeSurf = getLogs<any>(KEYS.URGE_SURF).map(l => 
      `UrgeSurf,${new Date(l.startTime).toISOString()},Status:${l.status},Duration:${l.durationCompletedSeconds}s,,,,`
    );

    const csvContent = [
      "Type,Data 1,Data 2,Data 3,Data 4,Data 5,Data 6,Data 7",
      ...avoidance,
      ...emotional,
      ...rumination,
      ...urgeSurf
    ].join("\\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `clinical_export_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportSeparateCsvs: () => {
    const avoidance = getLogs<Exclude<AvoidanceLog, 'id'>>(KEYS.AVOIDANCE);
    const emotional = getLogs<Exclude<EmotionalLog, 'id'>>(KEYS.EMOTIONAL);
    const rumination = getLogs<Exclude<RuminationLog, 'id'>>(KEYS.RUMINATION);
    const urgeSurf = getLogs<any>(KEYS.URGE_SURF);

    const iso = new Date().toISOString();

    const downloadFile = (filename: string, content: string) => {
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // Avoidance Log CSV
    const avoidanceCsv = [
      "Intent Time,Engagement Time,Latency (Minutes),Tag",
      ...avoidance.map(l => 
        `${new Date(l.intentTime).toISOString()},${new Date(l.engagementTime).toISOString()},${l.latencyMinutes.toFixed(2)},"${l.tag || 'NONE'}"`
      )
    ].join("\\n");
    downloadFile(`avoidance_logs_${iso}.csv`, avoidanceCsv);

    // Emotional Log CSV
    const emotionalCsv = [
      "Trigger,Intensity,Start Time,End Time,Duration (Minutes),Is Interpersonal,Dynamic",
      ...emotional.map(l => 
        `"${l.trigger.replace(/"/g, '""')}",${l.intensity},${new Date(l.startTime).toISOString()},${new Date(l.endTime).toISOString()},${l.durationMinutes.toFixed(2)},${l.isInterpersonal ? 'Y' : 'N'},"${l.interpersonalDynamic || ''}"`
      )
    ].join("\\n");
    downloadFile(`emotional_logs_${iso}.csv`, emotionalCsv);

    // Rumination Log CSV
    const ruminationCsv = [
      "Timestamp,Is Avoiding,Distortion",
      ...rumination.map(l => 
        `${new Date(l.timestamp).toISOString()},${l.isAvoiding},"${l.distortion || 'None'}"`
      )
    ].join("\\n");
    downloadFile(`rumination_logs_${iso}.csv`, ruminationCsv);

    // Urge Surf Log CSV
    const urgeSurfCsv = [
      "Start Time,Status,Duration (Seconds)",
      ...urgeSurf.map(l => 
        `${new Date(l.startTime).toISOString()},${l.status},${l.durationCompletedSeconds}`
      )
    ].join("\\n");
    downloadFile(`urge_surf_logs_${iso}.csv`, urgeSurfCsv);
  }
};
