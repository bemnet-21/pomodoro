"use client";

import useSWR from "swr";
import { getRecentSessionLogs } from "../api/session.service";
import HistoryDashboard, { SessionLog } from "../components/history/HistoryDashboard";



export default function HistoryPage() {
  const {  data: recentLogsData, error: recentLogsError, isLoading: recentLogsLoading } = useSWR("recentLogs", () => getRecentSessionLogs(10));
  const logs: SessionLog[] = recentLogsData?.data.data || [];
  console.log("Recent Logs Data:", logs);

  if (recentLogsError) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load session logs.</div>;
  }
  if (recentLogsLoading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading session logs...</div>;
  }
  return (
    <div className="min-h-screen bg-background text-white py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <header className="mb-10">
          <span className="text-primary font-mono text-xs tracking-widest uppercase">Raw Data Ledger</span>
          <h1 className="text-4xl font-bold tracking-tighter mt-2">Session History</h1>
        </header>

        <HistoryDashboard initialLogs={logs} />
      </div>
    </div>
  );
}