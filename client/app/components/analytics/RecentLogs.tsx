import type { RecentLog } from '../../types/analytics';

export interface RecentLogsProps {
  logs: RecentLog[];
  error: Error | null;
  isLoading: boolean;
}

export default function RecentLogs({ logs, error, isLoading }: RecentLogsProps) {
  if (!logs || logs.length === 0) return null;
  
  if (error) {
    return (
      <div className="bg-[#111] border border-[#1F1F1F] rounded-xl p-6">
        <p className="text-sm text-red-500">Failed to load recent logs.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-[#111] border border-[#1F1F1F] rounded-xl p-6">
        <p className="text-sm text-gray-500">Loading recent logs...</p>
      </div>
    );
  }
  
  return (
    <section className="overflow-hidden rounded-xl border border-[#1F1F1F] bg-[#111]">
      <div className="flex flex-col gap-3 border-b border-[#1F1F1F] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <span className="font-mono text-[10px] text-primary uppercase tracking-widest">Raw Data</span>
          <h3 className="font-bold text-lg text-white mt-1">Activity Ledger</h3>
        </div>
        <button className="text-[10px] font-mono text-primary border border-primary/30 px-4 py-2 rounded hover:bg-primary/10 transition-colors uppercase tracking-wider">
          View Full History
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-xl text-left sm:min-w-2xl md:min-w-4xl">
          <thead>
            <tr className="text-[10px] font-mono text-gray-500 uppercase border-b border-[#1F1F1F] bg-background/50">
              <th className="px-6 py-4 font-normal tracking-wider">Task Context</th>
              <th className="px-6 py-4 font-normal tracking-wider">Type</th>
              <th className="px-6 py-4 font-normal tracking-wider">Duration</th>
              <th className="px-6 py-4 text-right font-normal tracking-wider">Date/Time</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {logs.map((log) => (
              <tr key={log._id} className="border-b border-[#1F1F1F]/50 hover:bg-white/2 transition-colors">
                <td className="max-w-48 truncate px-4 py-4 font-medium text-white sm:max-w-50 sm:px-6">
                  {log.taskName}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${
                    log.sessionType === 'work' 
                      ? 'bg-primary/10 text-primary' 
                      : log.sessionType === 'short-break'
                      ? 'bg-[#00E676]/10 text-[#00E676]'
                      : 'bg-[#0070F3]/10 text-[#0070F3]'        
                  }`}>
                    {log.sessionType}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-gray-300">
                  {Math.floor(log.actualDurationSeconds / 60)}m {log.actualDurationSeconds % 60}s
                </td>
                <td className="px-6 py-4 text-right text-gray-500 font-mono text-xs">
                  {new Date(log.startTime).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}