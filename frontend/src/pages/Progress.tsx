import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { TrendingUp, Award, Activity, Zap, Target } from 'lucide-react';

const mockProgress = [
  { day: 'Squats',     duration: 22, volume: 48, score: 94 },
  { day: 'Push-ups',  duration: 15, volume: 45, score: 88 },
  { day: 'Curls',     duration: 18, volume: 50, score: 96 },
  { day: 'Deadlifts', duration: 25, volume: 30, score: 82 },
];

const weeklyTrend = [
  { week: 'Wk 1', score: 78, volume: 120, sessions: 3 },
  { week: 'Wk 2', score: 83, volume: 145, sessions: 4 },
  { week: 'Wk 3', score: 88, volume: 162, sessions: 4 },
  { week: 'Wk 4', score: 91, volume: 180, sessions: 5 },
  { week: 'Wk 5', score: 94, volume: 195, sessions: 5 },
];

const radarData = [
  { skill: 'Squat Form',   value: 94 },
  { skill: 'Push-up Form', value: 88 },
  { skill: 'Curl Form',    value: 96 },
  { skill: 'Consistency',  value: 82 },
  { skill: 'Volume',       value: 78 },
  { skill: 'Streak',       value: 70 },
];

const ChartCard = ({ title, subtitle, children }: any) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden card-hover hover:shadow-lg hover:border-slate-300 transition-all">
    <div className="px-6 py-5 border-b border-slate-100">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-slate-200 rounded-xl px-4 py-3 shadow-xl min-w-[120px]">
      <p className="text-xs text-slate-500 font-semibold mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name}: {p.value}{typeof p.value === 'number' && p.name.includes('Score') ? '%' : ''}
        </p>
      ))}
    </div>
  );
};

export const Progress = () => {
  const [progressData, setProgressData] = useState<any[]>(mockProgress);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/workouts/progress`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          const formatted = data.progress.map((p: any) => ({
            day: p.exercise.substring(0, 8),
            duration: Math.round(p.totalDuration / 60),
            volume: p.totalReps * p.totalSets,
            score: p.avgFormScore,
          }));
          if (formatted.length) setProgressData(formatted);
        }
      } catch { /* use mock */ } finally { setLoading(false); }
    };
    fetchProgress();
  }, []);

  const bestScore = Math.max(...progressData.map(p => p.score));
  const totalVol  = progressData.reduce((a, p) => a + p.volume, 0);
  const avgScore  = Math.round(progressData.reduce((a, p) => a + p.score, 0) / progressData.length);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 skeleton rounded-xl w-1/3" />
        <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <div key={i} className="h-24 skeleton rounded-2xl" />)}</div>
        <div className="h-80 skeleton rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Progress Analytics</h1>
        <p className="text-slate-500 text-sm font-medium mt-1">Data-driven insights into your fitness journey</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Best Form Score', value: `${bestScore}%`, icon: Award,     color: 'text-amber-600',  bg: 'bg-amber-50' },
          { label: 'Total Volume',    value: totalVol,         icon: Activity,  color: 'text-teal-600',   bg: 'bg-teal-50' },
          { label: 'Avg Form Score',  value: `${avgScore}%`,   icon: Target,    color: 'text-emerald-600',bg: 'bg-emerald-50' },
          { label: 'Trend',           value: '+12%',           icon: TrendingUp,color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center space-x-3 shadow-sm card-hover hover:shadow-lg hover:border-slate-300 transition-all">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <s.icon className={s.color} size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold">{s.label}</p>
              <p className="text-xl font-extrabold text-slate-900 stat-number">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Weekly trend */}
        <ChartCard title="Form Score Trend" subtitle="5-week rolling average">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="week" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" name="Score" stroke="#14b8a6" strokeWidth={2.5} fill="url(#scoreGrad2)"
                  dot={{ r: 4, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Volume per exercise */}
        <ChartCard title="Volume by Exercise" subtitle="Total reps × sets">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="volume" name="Volume" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Form score per exercise */}
        <ChartCard title="Form Score by Exercise" subtitle="Average score per movement">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                <YAxis type="category" dataKey="day" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} width={55} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" name="Score" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Radar / skills chart */}
        <ChartCard title="Fitness Skill Radar" subtitle="Overall performance breakdown">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                <Radar name="Score" dataKey="value" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Weekly sessions line */}
      <ChartCard title="Weekly Sessions & Volume Over Time" subtitle="Combined training load">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklyTrend} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
              <Line type="monotone" dataKey="volume" name="Volume" stroke="#6366f1" strokeWidth={2.5}
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} />
              <Line type="monotone" dataKey="sessions" name="Sessions" stroke="#f59e0b" strokeWidth={2.5}
                dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

    </div>
  );
};
