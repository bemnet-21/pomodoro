"use client";
import { useState } from "react";
import type { TagData } from '../../types/analytics';

export interface TagDistributionProps {
  data: TagData[];
  error: Error;
  isLoading: boolean;
}

export default function TagDistribution({ data, error, isLoading }: TagDistributionProps) {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6">Failed to load tag distribution.</div>;
  
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const colors = ['#FF4D00', '#00E676', '#0070F3', '#7928CA', '#F5A623'];
  const totalMinutes = data.reduce((acc, curr) => acc + curr.totalMinutes, 0);
  const percentages = data.map((item) => item.totalMinutes / totalMinutes);
  const offsets = percentages.map((_, i) =>
    percentages.slice(0, i).reduce((sum, p) => sum + p * circumference, 0)
  );

  return (
    <section className="bg-[#111] border border-[#1F1F1F] p-8 rounded-xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div>
        <span className="font-mono text-[10px] text-primary uppercase tracking-widest">Resource Allocation</span>
        <h3 className="text-xl font-bold mt-1 mb-6 text-white">Time per Tag</h3>
        
        <div className="space-y-3">
          {data.map((item, i) => {
            const percentage = Math.round((item.totalMinutes / totalMinutes) * 100);
            const isHovered = hoveredTag === item._id;
            
            return (
              <div 
                key={item._id} 
                onMouseEnter={() => setHoveredTag(item._id)}
                onMouseLeave={() => setHoveredTag(null)}
                className={`flex justify-between items-center font-mono text-sm p-2 rounded transition-colors cursor-pointer ${isHovered ? 'bg-white/5' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                  <span className="text-white font-medium">{item._id}</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-500 text-xs">{(item.totalMinutes / 60).toFixed(1)}h</span>
                  <span className="text-white font-bold w-8 text-right">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative flex justify-center">
        <svg width="240" height="240" viewBox="0 0 100 100" className="transform -rotate-90">
          {data.map((item, i) => {
            const percentage = percentages[i];
            const strokeDasharray = `${percentage * circumference} ${circumference}`;
            const strokeDashoffset = -offsets[i];
            const isHovered = hoveredTag === item._id;

            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={colors[i % colors.length]}
                strokeWidth={isHovered ? "12" : "8"}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredTag(item._id)}
                onMouseLeave={() => setHoveredTag(null)}
              />
            );
          })}
        </svg>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {hoveredTag ? (
             <>
               <span className="text-3xl font-bold font-mono text-white">
                 {Math.round((data.find(d => d._id === hoveredTag)!.totalMinutes / totalMinutes) * 100)}%
               </span>
               <span className="text-[9px] text-primary uppercase font-mono mt-1 tracking-widest">{hoveredTag}</span>
             </>
          ) : (
            <>
              <span className="text-3xl font-bold font-mono text-white">{(totalMinutes / 60).toFixed(1)}h</span>
              <span className="text-[10px] text-gray-500 uppercase mt-1">Total Tracked</span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}