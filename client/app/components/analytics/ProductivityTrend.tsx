"use client";
import { useMemo } from 'react';

export interface TrendData {
  _id: number; 
  totalMinutes: number;
  date?: string; 
}

export interface ProductivityTrendProps {
  data: TrendData[];
  error: Error;
  isLoading: boolean;
}

export default function ProductivityTrend({ data, error, isLoading }: ProductivityTrendProps) {
  const { strokePath, fillPath, points } = useMemo(() => {
    if (!data.length) return { strokePath: "", fillPath: "", points: [] };
    
    const width = 440;
    const height = 85;
    const bottomY = 100;
    const paddingX = 30;

    const chartPoints = data.map((d, idx) => {
      const x = paddingX + (idx * (width / 6));
      const scoreRatio = Math.min(d.totalMinutes / 300, 1); 
      const y = bottomY - (scoreRatio * height);
      return { x, y, ...d };
    });

    let d = `M ${chartPoints[0].x} ${chartPoints[0].y}`;
    for (let i = 0; i < chartPoints.length - 1; i++) {
      const p0 = chartPoints[i];
      const p1 = chartPoints[i + 1];
      const cpX = p0.x + (p1.x - p0.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const fD = `${d} L ${chartPoints[chartPoints.length - 1].x} ${bottomY} L ${chartPoints[0].x} ${bottomY} Z`;
    return { strokePath: d, fillPath: fD, points: chartPoints };
  }, [data]);
  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">Failed to load trend data.</div>;
  return (
    <section className="flex h-full flex-col justify-between rounded-xl border border-[#1F1F1F] bg-[#111] p-4 sm:p-6">
      <div>
        <span className="font-mono text-[10px] text-primary uppercase tracking-widest">Efficiency Wave</span>
        <h3 className="text-xl font-bold mt-1 text-white">Weekly Focus Trend</h3>
      </div>
      
      <div className="relative mt-6 h-44 w-full select-none sm:h-48">
        <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF4D00" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FF4D00" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={fillPath} fill="url(#trendGrad)" />
          <path d={strokePath} fill="none" stroke="#FF4D00" strokeWidth="2.5" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="4" fill="#0A0A0A" stroke="#FF4D00" strokeWidth="2" />
          ))}
        </svg>

        {/* Labels */}
        <div className="absolute bottom-0 mt-2 flex w-full justify-between px-3 font-mono text-[9px] uppercase text-gray-500 sm:px-7 sm:text-[10px]">
          {data.map((d, i) => <span key={i}>{d.date || d._id}</span>)}
        </div>
      </div>
    </section>
  );
}