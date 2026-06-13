"use client";
import { useMemo, useState } from 'react';

export interface HeatmapData {
  _id: string; // Expected format: "YYYY-MM-DD"
  count: number;
}

export interface HeatmapProps {
  data: HeatmapData[];
}

export default function Heatmap({ data }: HeatmapProps) {
  const [hovered, setHovered] = useState<HeatmapData | null>(null);

  // Helper to format date objects to local YYYY-MM-DD without timezone shifts
  const toDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const grid = useMemo(() => {
    const weeks = [];
    const now = new Date();
    
    // 1. Calculate a start date that is exactly 52 weeks ago, 
    // and adjust it to the preceding Sunday so the rows align.
    const startDate = new Date();
    startDate.setDate(now.getDate() - 364); // 52 weeks
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Set to Sunday

    // 2. Map API data for O(1) lookup
    const dataMap = data.reduce((acc: Record<string, number>, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    // 3. Build 53 columns (weeks)
    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + (w * 7 + d));
        const dateStr = toDateString(date);
        
        week.push({
          _id: dateStr,
          count: dataMap[dateStr] || 0,
          displayDate: date.toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric' 
          })
        });
      }
      weeks.push(week);
    }
    return weeks;
  }, [data]);

  const monthLabels = useMemo(() => {
    const labels: { label: string; column: number }[] = [];
    let lastMonth = -1;

    grid.forEach((week, weekIndex) => {
      // Check the date of the first day of the week
      const firstDayOfWeek = new Date(week[0]._id + "T00:00:00");
      const currentMonth = firstDayOfWeek.getMonth();

      if (currentMonth !== lastMonth) {
        labels.push({
          label: firstDayOfWeek.toLocaleString('en-US', { month: 'short' }),
          column: weekIndex
        });
        lastMonth = currentMonth;
      }
    });
    return labels;
  }, [grid]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-[#1A1A1A]'; 
    if (count < 2) return 'bg-[#3a0b00]';   
    if (count < 4) return 'bg-[#852400]';   
    if (count < 6) return 'bg-[#ae3200]';   
    return 'bg-[#FF4D00]';                 
  };

  return (
    <section className="bg-background border border-[#1F1F1F] p-6 rounded-xl relative overflow-hidden">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-sm font-mono text-gray-400 uppercase tracking-[0.2em]">Focus Intensity</h3>
          <p className="text-xs text-gray-600 mt-1">Sessions completed over the last year</p>
        </div>
        <div className="flex gap-1.5 items-center text-[10px] text-gray-500 font-mono uppercase">
          <span>Less</span>
          {[0, 1, 3, 5, 7].map(c => (
            <div key={c} className={`w-3 h-3 rounded-xs ${getColor(c)}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="relative">
        {/* Month Labels */}
        <div
          className="grid text-[10px] text-gray-600 font-mono mb-2"
          style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}
        >
          {monthLabels.map((month) => (
            <span
              key={`${month.label}-${month.column}`}
              style={{ gridColumnStart: month.column + 1 }}
            >
              {month.label}
            </span>
          ))}
        </div>

        {/* The Grid */}
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}
        >
          {grid.map((week, wIdx) => (
            <div key={wIdx} className="grid grid-rows-7 gap-1">
              {week.map((day) => (
                <div
                  key={day._id}
                  onMouseEnter={() => setHovered(day)}
                  onMouseLeave={() => setHovered(null)}
                  className={`w-full aspect-square rounded-[1px] transition-all duration-300 hover:ring-1 hover:ring-white/50 cursor-crosshair ${getColor(day.count)}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hovered && (
        <div className="absolute bottom-4 left-6 bg-black border border-primary/30 px-3 py-2 rounded shadow-2xl z-10 pointer-events-none animate-in fade-in zoom-in duration-200">
          <p className="text-[10px] font-mono text-primary uppercase font-bold">
            {hovered._id}
          </p>
          <p className="text-xs text-white">
            {hovered.count} {hovered.count === 1 ? 'session' : 'sessions'} completed
          </p>
        </div>
      )}
    </section>
  );
}