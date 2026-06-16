export type SessionType = "work" | "short-break" | "long-break";

export interface SessionLog {
  _id: string;
  taskName: string;
  tags: string[];
  sessionType: SessionType;
  actualDurationSeconds: number;
  startTime: string;
}

export interface NewLog {
  taskName: string;
  sessionType: SessionType;
  actualDurationSeconds: number;
  startTime: string;
  endTime: string;
  status: "completed" | "abandoned";
  plannedDurationSeconds: number;
}

export type CreateSessionPayload = Omit<NewLog, "status"> & {
  status: "completed";
};