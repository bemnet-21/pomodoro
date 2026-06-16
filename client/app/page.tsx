"use client";
import { addSessionLog } from "./api/session.service";
import CounterCard from "./components/CounterCard";
import type { CreateSessionPayload, NewLog } from "./types/history";
import { getUserSettings } from "./api/user.service";
import type { UserSettings } from "./types/profile";
import useSWR from "swr";

const DEFAULT_SETTINGS: UserSettings = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartWork: false,
};

const normalizeSettings = (raw: unknown): UserSettings => {
  const candidate = (raw && typeof raw === "object" ? raw : {}) as Partial<UserSettings>;

  const safeMinutes = (value: unknown, fallback: number) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric <= 0) return fallback;
    return numeric;
  };

  return {
    workDuration: safeMinutes(candidate.workDuration, DEFAULT_SETTINGS.workDuration),
    shortBreak: safeMinutes(candidate.shortBreak, DEFAULT_SETTINGS.shortBreak),
    longBreak: safeMinutes(candidate.longBreak, DEFAULT_SETTINGS.longBreak),
    longBreakInterval: safeMinutes(candidate.longBreakInterval, DEFAULT_SETTINGS.longBreakInterval),
    autoStartBreaks: Boolean(candidate.autoStartBreaks),
    autoStartWork: Boolean(candidate.autoStartWork),
  };
};

export default function Home() {
  const { data: settingsData } = useSWR("settings", getUserSettings);
  const settings: UserSettings = normalizeSettings(settingsData?.data?.data ?? settingsData?.data ?? DEFAULT_SETTINGS);
  
  // This function acts as the bridge between the Timer UI and your Backend
  const handleSessionComplete = async (sessionPayload: NewLog) => {
    if (sessionPayload.status !== "completed") {
      return;
    }

    if (sessionPayload.actualDurationSeconds <= 0) {
      return;
    }

    const createPayload: CreateSessionPayload = {
      taskName: sessionPayload.taskName,
      sessionType: sessionPayload.sessionType,
      status: "completed",
      startTime: sessionPayload.startTime,
      endTime: sessionPayload.endTime,
      actualDurationSeconds: sessionPayload.actualDurationSeconds,
      plannedDurationSeconds: sessionPayload.plannedDurationSeconds,
    };

   try {
      const res = await addSessionLog(createPayload);
      if (res.status >= 200 && res.status < 300) {
        console.log("Session log successfully saved to MongoDB!");
      } else {
        console.error("API returned an error:", res.statusText);
      }
   } catch(err) {
      console.error("Error during session completion handling:", err);
   }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-4 py-6 font-sans selection:bg-primary selection:text-white sm:px-6 lg:px-10">
      <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none overflow-hidden">
        <div className="w-200 h-200 bg-primary opacity-[0.03] rounded-full blur-[120px]" />
      </div>

      {/* The Timer Card */}
      <div className="z-10 flex w-full justify-center">
        <CounterCard
          key={`${settings.workDuration}-${settings.shortBreak}-${settings.longBreak}-${settings.longBreakInterval}`}
          onSessionComplete={handleSessionComplete}
          durations={{
            work: settings.workDuration,
            shortBreak: settings.shortBreak,
            longBreak: settings.longBreak,
          }}
          longBreakInterval={settings.longBreakInterval}
        />
      </div>
    </main>
  );
}