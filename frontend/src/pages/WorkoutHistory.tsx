import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Trophy, ChevronRight, Activity, Filter, Search, Dumbbell } from 'lucide-react';
import { WorkoutSession } from '../types';

const scoreColor = (score: number) => {
  if (score >= 90) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Excellent' };
  if (score >= 75) return { text: 'text-teal-600',    bg: 'bg-teal-50',    border: 'border-teal-200',    label: 'Good' };
  if (score >= 60) return { text: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   label: 'Fair' };
  return                 { text: 'text-red-600',      bg: 'bg-red-50',     border: 'border-red-200',     label: 'Needs Work' };
};

const exerciseIcon = (exercise: string) => {
  const map: Record<string, string> = { Squats: '🦵', 'Push-ups': '💪', 'Bicep Curls': '🏋️', Deadlifts: '🔱' };
  return map[exercise] ?? '🏃';
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-14 h-14 skeleton rounded-2xl" />
      <div className="flex-1 space-y-2">
        <div className="h-4 skeleton rounded w-1/3" />
        <div className="h-3 skeleton rounded w-2/3" />
      </div>
      <div className="w-16 h-8 skeleton rounded-xl" />
    </div>
  </div>
);

export const WorkoutHistory = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/workouts`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.sessions.map((s: any) => ({
          id: s._id,
          userId: s.userId,
          date: s.createdAt,
          durationMinutes: Math.round(s.durationSec / 60),
          exercise: s.exercise,
          sets: s.sets,
          reps: s.reps,
          averageFormScore: s.formScore,
        }));
        setSessions(mapped);
      }
    } catch { /* fallback mock */ } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const exercises = ['All', ...Array.from(new Set(sessions.map(s => s.exercise)))];
  const filtered = sessions.filter(s =>
    (filter === 'All' || s.exercise === filter) &&
    s.exercise.toLowerCase().includes(search.toLowerCase())
  );

  // Summary stats
  const totalSets  = sessions.reduce((a, s) => a + s.sets, 0);
  const totalReps  = sessions.reduce((a, s) => a + s.reps, 0);
  const avgScore   = sessions.length ? Math.round(sessions.reduce((a, s) => a + s.averageFormScore, 0) / sessions.length) : 0;

  return (
    <div className="space-y-6 animate-fade-in-up max-w-5xl mx-auto">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Workout History</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Review your past sessions and AI coaching feedback</p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-slate-400">{sessions.length} sessions logged</span>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Sets', value: totalSets, icon: Dumbbell, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Total Reps', value: totalReps, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg Form Score', value: `${avgScore}%`, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center space-x-3 shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={s.color} size={18} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">{s.label}</p>
              <p className="text-xl font-extrabold text-slate-900 stat-number">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400 transition-all"
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <Filter size={14} className="text-slate-400 shrink-0" />
          {exercises.map(ex => (
            <button
              key={ex}
              onClick={() => setFilter(ex)}
              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === ex
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/25'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700'
              }`}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions list */}
      {loading ? (
        <div className="space-y-3">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🏋️</div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No sessions found</h3>
          <p className="text-slate-500 text-sm">Complete your first workout to see it here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((session) => {
            const sc = scoreColor(session.averageFormScore);
            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all duration-200 cursor-pointer group card-hover overflow-hidden"
              >
                <div className="flex items-center p-5 gap-4">
                  {/* Date block */}
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-50 border border-slate-200 rounded-2xl shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {new Date(session.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-extrabold text-slate-900 leading-tight">
                      {new Date(session.date).getDate()}
                    </span>
                  </div>

                  {/* Exercise icon + info */}
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <span className="text-3xl shrink-0">{exerciseIcon(session.exercise)}</span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors text-sm truncate">{session.exercise}</h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                        <span className="flex items-center text-xs text-slate-500"><Clock size={11} className="mr-1" />{session.durationMinutes}m</span>
                        <span className="flex items-center text-xs text-slate-500"><Calendar size={11} className="mr-1" />{session.sets} sets, {session.reps} reps</span>
                      </div>
                    </div>
                  </div>

                  {/* Score badge */}
                  <div className={`shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border ${sc.bg} ${sc.border}`}>
                    <span className={`text-lg font-extrabold ${sc.text}`}>{session.averageFormScore}%</span>
                    <span className={`text-[10px] font-bold ${sc.text}`}>{sc.label}</span>
                  </div>

                  <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-500 transition-colors shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
