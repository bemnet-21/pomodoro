export interface SummaryData {
  currentStreak: number;
  totalFocusMinutes: number;
  totalSessions: number;
  lastActive: string;
}

export interface StreakStatsProps {
  data: SummaryData;
  error: Error;
  isLoading: boolean;
}

export default function StreakStats({ data, error, isLoading }: StreakStatsProps) {
  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">Failed to load streak stats.</div>;  
  return (
    <section className="bg-primary/5 border border-primary/20 p-6 rounded-xl flex flex-col justify-between h-full relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-10 blur-3xl rounded-full pointer-events-none"></div>

      <div>
        <span className="font-mono text-[10px] text-primary uppercase tracking-widest">Consistency</span>
        <h3 className="text-xl font-bold mt-1 text-white">Momentum</h3>
      </div>

      <div className="py-6 space-y-6">
        <div>
          <p className="text-primary/70 font-mono text-[10px] uppercase">Current Streak</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-6xl font-bold text-primary tracking-tighter">
              {data.currentStreak}
            </span>
            <span className="text-lg font-bold text-white">Days</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-primary/10 pt-6">
          <div>
            <p className="text-gray-500 font-mono text-[10px] uppercase mb-1">Total Hours</p>
            <p className="text-2xl font-bold text-white">{(data.totalFocusMinutes / 60).toFixed(1)}</p>
          </div>
          <div>
            <p className="text-gray-500 font-mono text-[10px] uppercase mb-1">Sessions</p>
            <p className="text-2xl font-bold text-white">{data.totalSessions}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase mb-1.5">
          <span>Target Progress</span>
          <span>{Math.min(Math.round((data.currentStreak / 30) * 100), 100)}%</span>
        </div>
        <div className="w-full bg-[#1F1F1F] h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-primary h-full transition-all duration-1000" 
            style={{ width: `${Math.min((data.currentStreak / 30) * 100, 100)}%` }} 
          />
        </div>
      </div>
    </section>
  );
}