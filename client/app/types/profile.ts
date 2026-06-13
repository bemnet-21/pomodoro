export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserSettings {
  workDuration: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
}