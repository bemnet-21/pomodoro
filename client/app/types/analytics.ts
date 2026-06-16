export interface HeatmapData {
  _id: string;
  count: number;
}

export interface WeeklyData {
  _id: number;
  totalMinutes: number;
  date: string;
}

export interface SummaryData {
  currentStreak: number;
  totalFocusHours: number;
  totalSessions: number;
  lastActive: string;
}

export interface RecentLog {
  _id: string;
  taskName: string;
  sessionType: string;
  actualDurationSeconds: number;
  startTime: string;
}

export interface TagData {
  _id: string;
  totalMinutes: number;
}