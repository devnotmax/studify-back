export enum SessionType {
  FOCUS = "focus",
  BREAK = "short_break",
  LONG_BREAK = "long_break",
}

export interface Session {
  id: string;
  type: SessionType;
  duration: number;
  start: Date;
  end: Date;
  userId: string;
  isCompleted: boolean;
  isCancelled: boolean;
  isPaused: boolean;
  isResumed: boolean;
}

export interface UserStats {
  totalSessions: number;
  totalTime: number;
  averageSessionDuration: number;
  longestSession: number;
  longestSessionDate: Date;
  totalFocusTime: number;
  totalBreakTime: number;
  totalLongBreakTime: number;
}
