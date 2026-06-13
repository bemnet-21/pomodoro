"use client";

import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Calendar, ChevronDown, Clock } from 'lucide-react';
import { formatTime } from '@/util/formatter';
import ManualLogForm from './ManualLogForm';
import { addSessionLog, deleteSessionLog } from '@/app/api/session.service';

export interface SessionLog {
  _id: string;
  taskName: string;
  tags: string[]; 
  sessionType: 'work' | 'short-break' | 'long-break';
  actualDurationSeconds: number;
  startTime: string; 
}

interface HistoryDashboardProps {
  initialLogs: SessionLog[];
}

type SortOption = 'date-desc' | 'date-asc' | 'duration-desc';

export interface NewLog {
    taskName: string;
    sessionType: 'work' | 'short-break' | 'long-break';
    actualDurationSeconds: number;
    startTime: string; 
    endTime: string;
    status: string;
    plannedDurationSeconds: number;
  }

export default function HistoryDashboard({ initialLogs }: HistoryDashboardProps) {
  const [logs, setLogs] = useState<SessionLog[]>(initialLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showManualForm, setShowManualForm] = useState(false);
  
  const itemsPerPage = 10;

  

  const handleAddLog = async (log: Omit<SessionLog, '_id'>) => {
  try {
    const payload: NewLog = {
      ...log,
      plannedDurationSeconds: log.actualDurationSeconds,
      endTime: new Date(Date.parse(log.startTime) + log.actualDurationSeconds * 1000).toISOString(),
      status: 'completed',
    };

    const res = await addSessionLog(payload);

    if (res.status !== 201) throw new Error('API returned an error');

    setLogs((prevLogs) => [res.data.data, ...prevLogs]);
    setShowManualForm(false);
    setCurrentPage(1);

  } catch (error) {
    alert('Failed to add the log. Please try again.');
    console.error('Add Log Error:', error);
  }
};

  const handleDeleteLog = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the log for "${name}"? This action cannot be undone.`)) {
        const res = await deleteSessionLog(id);
        if (res.status === 200) {
          setLogs(logs.filter((log) => log._id !== id));
        } else {
          alert('Failed to delete the log. Please try again.');
        }
    }
    
  };

  const filteredLogs = useMemo(() => {
    let result = [...logs];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(log => log.taskName.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      if (sortBy === 'date-asc') return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      if (sortBy === 'duration-desc') return b.actualDurationSeconds - a.actualDurationSeconds;
      return 0;
    });

    return result;
  }, [logs, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-3xl">
          
          <div className="relative flex-1 min-w-50">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search objective..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-[#111] border border-[#1F1F1F] rounded pl-10 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-[#111] border border-[#1F1F1F] rounded pl-3.5 pr-8 py-2 text-xs font-mono text-gray-400 focus:outline-none focus:border-primary/50 cursor-pointer uppercase"
            >
              <option value="date-desc">NEWEST FIRST</option>
              <option value="date-asc">OLDEST FIRST</option>
              <option value="duration-desc">LONGEST DURATION</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={() => setShowManualForm(!showManualForm)}
          className="flex items-center justify-center gap-2 bg-primary text-black font-mono font-bold text-xs py-2 px-5 rounded hover:bg-primary/80 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[3px]" /> MANUAL ENTRY
        </button>
      </div>

      {showManualForm && (
        <ManualLogForm
          onClose={() => setShowManualForm(false)} 
          onSubmit={handleAddLog} 
        />
      )}

      <section className="bg-[#111] border border-[#1F1F1F] rounded-xl overflow-hidden pb-4">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#1F1F1F] text-gray-500 text-[10px] font-mono uppercase tracking-wider bg-black/40">
                <th className="px-6 py-4">Task Name</th>
                <th className="px-6 py-4 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Duration</th>
                <th className="px-6 py-4"><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date</span></th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 font-mono text-gray-600 text-xs">
                    NO LOGS FOUND WITH CURRENT FILTERS.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  return (
                    <tr key={log._id} className="border-b border-[#1F1F1F]/50 hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 font-bold max-w-75 truncate">{log.taskName}</td>
                      <td className="px-6 py-4 font-mono text-gray-300">{formatTime(log.actualDurationSeconds)}</td>
                      <td className="px-6 py-4 font-mono text-gray-400 text-xs">
                        {new Date(log.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDeleteLog(log._id, log.taskName)} className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-6 gap-4">
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              Showing <span className="text-white font-bold">{startIndex + 1}</span> - <span className="text-white font-bold">{Math.min(startIndex + itemsPerPage, filteredLogs.length)}</span> of <span className="text-white font-bold">{filteredLogs.length}</span> entries
            </span>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} className="px-3 py-1 font-mono text-[10px] border border-[#1F1F1F] rounded text-gray-400 hover:text-white hover:border-primary/50 disabled:opacity-30">PREV</button>
              <div className="flex gap-1 sm:flex">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setCurrentPage(p)} className={`w-7 py-1 font-mono text-[10px] border rounded transition-all ${currentPage === p ? 'border-primary text-primary bg-primary/10 font-bold' : 'border-[#1F1F1F] text-gray-500 hover:text-white'}`}>
                    {p}
                  </button>
                ))}
              </div>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)} className="px-3 py-1 font-mono text-[10px] border border-[#1F1F1F] rounded text-gray-400 hover:text-white hover:border-primary/50 disabled:opacity-30">NEXT</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}