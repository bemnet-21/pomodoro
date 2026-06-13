"use client";

import { getHeatmapData, getWeeklyData } from "../api/analytics.service";
import Heatmap from "../components/analytics/HeatMapCard";
import useSWR from "swr";
import ProductivityTrend from "../components/analytics/ProductivityTrend";
import { mapISODateToWeekday } from "@/util/dateToWeekday";
import StreakStats from "../components/analytics/StreakStats";
import { getUserSummary } from "../api/user.service";
import RecentLogs from "../components/analytics/RecentLogs";
import { getRecentSessionLogs } from "../api/session.service";


interface HeatmapData {
  _id: string; 
  count: number; 
}

interface WeeklyData {
  _id: number; 
  totalMinutes: number; 
  date: string; 
}

interface SummaryData {
  currentStreak: number; 
  totalFocusMinutes: number; 
  totalSessions: number; 
  lastActive: string; 
}

interface RecentLog {
  _id: string;
  taskName: string;
  sessionType: string; 
  actualDurationSeconds: number;
  startTime: string;
}

export default function AnalyticsPage() {

  const { data, error, isLoading } = useSWR("heatmap", getHeatmapData);
  const heatmapData: HeatmapData[] = data?.data.data || [];
  console.log("Heatmap Data:", heatmapData);

  const { data: weeklyData, error: weeklyError, isLoading: weeklyLoading } = useSWR("weekly-stats", getWeeklyData);
  const weekly: WeeklyData[] = (weeklyData?.data.data || []).map((item: WeeklyData) => ({
    ...item,
    date: mapISODateToWeekday(item.date, "long"),
  }));
  console.log("Weekly Data:", weekly);

  const { data: summaryData, error: summaryError, isLoading: summaryLoading } = useSWR("userSummary", getUserSummary)
  const summary: SummaryData = summaryData?.data.data || {};
  console.log("Summary Data:", summary);

  const { data: recentLogsData, error: recentLogsError, isLoading: recentLogsLoading } = useSWR("recentLogs", getRecentSessionLogs)
  const recent: RecentLog[] = recentLogsData?.data.data || [];
  console.log("Recent Logs Data:", recent);

  if (error) return <div className="p-6">Failed to load analytics.</div>;
  if (isLoading) return <div className="p-6">Loading analytics...</div>;
  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-6 bg-background min-h-screen text-white">
      <header className="mb-10">
        <span className="text-primary font-mono text-xs tracking-widest uppercase">Performance Metrics</span>
        <h1 className="text-4xl font-bold tracking-tighter mt-2">Analytics</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-12">
          <Heatmap data={heatmapData} />
        </div>
        
        <div className="md:col-span-7">
          <ProductivityTrend data={weekly} error={weeklyError} isLoading={weeklyLoading} />
        </div>

        <div className="md:col-span-5">
          <StreakStats data={summary} error={summaryError} isLoading={summaryLoading} />
        </div>


        <div className="md:col-span-12">
          <RecentLogs logs={recent} error={recentLogsError} isLoading={recentLogsLoading} />
        </div>
      </div>
    </div>
  );
}