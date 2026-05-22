export interface AvoidanceLog {
  id: string;
  intentTime: number; // Unix timestamp
  engagementTime: number; // Unix timestamp
  latencyMinutes: number;
  tag?: string;
}

export const AVOIDANCE_TAGS = [
  "[BOARD_EXAM_PREP]",
  "[CLINICAL_DUTY]",
  "[HOUSEHOLD_SUPPORT]",
  "[FITNESS_ROUTINE]",
  "[GUITAR_PRACTICE]",
  "[DEV_PROJECT]",
];

export interface EmotionalLog {
  id: string;
  trigger: string;
  intensity: number;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  isInterpersonal: boolean;
  interpersonalDynamic?: string | null;
}

export const INTERPERSONAL_DYNAMICS = [
  "[ROMANTIC_RUMINATION]",
  "[FAMILY_DYNAMICS_GUILT]",
  "[FRIEND_GROUP_ESTRANGEMENT]",
  "[WORKPLACE_CLINICAL]",
  "[ISOLATION_DISTANT_PEERS]",
];

export interface RuminationLog {
  id: string;
  isAvoiding: boolean;
  distortion: string | null;
  timestamp: number;
}

export interface UrgeSurfLog {
  id: string;
  startTime: number;
  durationCompletedSeconds: number;
  status: 'COMPLETED' | 'ABORTED';
}

export const COGNITIVE_DISTORTIONS = [
  "All-or-Nothing Thinking",
  "Overgeneralization",
  "Mental Filter",
  "Discounting the Positive",
  "Jumping to Conclusions (Mind Reading)",
  "Jumping to Conclusions (Fortune Telling)",
  "Magnification/Minimization",
  "Emotional Reasoning",
  "Should Statements",
  "Labeling",
  "Personalization and Blame",
];
