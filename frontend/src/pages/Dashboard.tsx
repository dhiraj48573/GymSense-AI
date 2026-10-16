import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, Dumbbell, Flame, Trophy, Play, Clock, TrendingUp,
  ChevronRight, Zap, Target, Brain, Award
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockActivityData = [
  { name: 'Mon', score: 82 },
  { name: 'Tue', score: 88 },
  { name: 'Wed', score: 93 },
  { name: 'Thu', score: 0 },
  { name: 'Fri', score: 95 },
  { name: 'Sat', score: 91 },
  { name: 'Sun', score: 87 },
];

const recentSessions = [
  { type: 'Squats',     date: 'Today, 6:30 PM',    score: 94, sets: 4, reps: 12, color: 'bg-teal-100 text-teal-600' },
  { type: 'Push-ups',  date: 'Yesterday, 7:00 AM', score: 88, sets: 3, reps: 15, color: 'bg-emerald-100 text-emerald-600' },
  { type: 'Bicep Curls', date: '2 days ago',       score: 96, sets: 5, reps: 10, color: 'bg-indigo-100 text-indigo-600' },
];

// Animated counter hook
function useCounter(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setValue(current);
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return value;
}

const StatCard = ({ label, rawValue, displayValue, icon: Icon, color, bg, trend }: any) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-5 card-hover shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shadow-sm`}>
        <Icon className={color} size={20} />
      </div>
      {trend && (
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center">
          <TrendingUp size={10} className="mr-1" />{trend}
        </span>
      )}
    </div>
    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
    <h3 className="text-2xl font-extrabold text-slate-900 stat-number">{displayValue}</h3>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass border border-slate-200 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-xs text-slate-500 font-semibold mb-1">{label}</p>
        <p className="text-lg font-extrabold text-teal-600">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export const Dashboard = () => {
  const workoutCount = useCounter(4);
  const streakDays   = useCounter(3);
  const avgScore     = useCounter(92);

  return (
    <div className="space-y-7 animate-fade-in-up">

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-teal-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-600" />
        <div className="absolute inset-0 opacity-20"
          style={{backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-300/20 rounded-full blur-2xl" />

        <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-xs font-bold border border-white/30">
              <span className="live-dot w-2 h-2 bg-white shrink-0" />
              <span>AI Coach Standing By</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Ready to crush<br/>today's session?
            </h1>
            <p className="text-teal-100 text-sm font-medium max-w-sm">
              GymSense tracks your form in real-time using computer vision. No hardware needed — just your camera.
            </p>
            <div className="flex flex-wrap gap-4 text-white/70 text-sm">
              <span className="flex items-center space-x-1.5"><Zap size={14} className="text-yellow-300" /><span>Sub-100ms feedback</span></span>
              <span className="flex items-center space-x-1.5"><Brain size={14} className="text-purple-300" /><span>Groq AI coaching</span></span>
              <span className="flex items-center space-x-1.5"><Target size={14} className="text-emerald-300" /><span>33-point tracking</span></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link to="/live">
              <Button size="lg" className="w-full sm:w-auto bg-white text-teal-700 hover:bg-teal-50 border-none shadow-xl px-8 font-bold">
                <Play className="mr-2.5 fill-teal-600" size={18} />
                Start Workout
              </Button>
            </Link>
            <Link to="/history">
              <Button size="lg" className="w-full sm:w-auto bg-white/15 backdrop-blur text-white hover:bg-white/25 border border-white/30 font-semibold px-6">
                View History
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Workouts This Week"
          displayValue={workoutCount}
          icon={Dumbbell}
          color="text-teal-600"
          bg="bg-teal-50"
          trend="+2 vs last"
        />
        <StatCard
          label="Active Streak"
          displayValue={`${streakDays} Days`}
          icon={Flame}
          color="text-orange-500"
          bg="bg-orange-50"
          trend="🔥 On fire"
        />
        <StatCard
          label="Avg Form Score"
          displayValue={`${avgScore}%`}
          icon={Trophy}
          color="text-amber-500"
          bg="bg-amber-50"
          trend="+4% this week"
        />
        <StatCard
          label="Time Active"
          displayValue="3h 45m"
          icon={Clock}
          color="text-indigo-500"
          bg="bg-indigo-50"
        />
      </div>

      {/* Chart + Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden card-hover hover:shadow-lg hover:border-slate-300 transition-all">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Form Score</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Average across all exercises</p>
            </div>
            <span className="text-xs bg-teal-50 text-teal-700 font-bold px-3 py-1 rounded-full border border-teal-100">
              This Week
            </span>
          </div>
          <div className="p-5">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockActivityData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#cbd5e1" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#14b8a6"
                    strokeWidth={2.5}
                    fill="url(#scoreGrad)"
                    dot={{ r: 4, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: '#0d9488', stroke: '#fff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden card-hover hover:shadow-lg hover:border-slate-300 transition-all">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Recent Sessions</h3>
            <Link to="/history" className="text-xs text-teal-600 font-bold hover:text-teal-700">View all</Link>
          </div>
          <div className="p-4 space-y-3">
            {recentSessions.map((session, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group border border-transparent hover:border-slate-200"
              >
                <div className={`w-9 h-9 rounded-xl ${session.color} flex items-center justify-center shrink-0 text-sm font-bold`}>
                  {session.type.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate group-hover:text-teal-700 transition-colors">{session.type}</p>
                  <p className="text-xs text-slate-500 font-medium">{session.sets} sets · {session.reps} reps · {session.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold text-teal-600">{session.score}%</p>
                  <p className="text-[10px] text-slate-400 font-medium">Form</p>
                </div>
              </div>
            ))}

            <Link to="/live">
              <button className="mt-2 w-full py-2.5 rounded-xl border-2 border-dashed border-teal-200 text-teal-600 text-sm font-bold hover:bg-teal-50 hover:border-teal-300 transition-all flex items-center justify-center space-x-2">
                <Play size={14} className="fill-teal-500" />
                <span>New Session</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* AI Tips Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Brain,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            title: 'AI Tip: Squat Depth',
            desc: 'Your hip crease dropped below parallel on 8/12 reps this week. Great consistency — aim for 12/12 next session.',
          },
          {
            icon: Award,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            title: 'Achievement Unlocked',
            desc: '🏆 "Perfect Week" — Maintained above 90% form score for 5 consecutive sessions. Keep it up!',
          },
          {
            icon: Target,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
            title: "This Week's Goal",
            desc: '4 of 5 workouts complete. One more session to hit your weekly target and extend your streak.',
          },
        ].map((tip, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 card-hover hover:shadow-lg hover:border-slate-300 transition-all shadow-sm">
            <div className={`w-9 h-9 rounded-xl ${tip.bg} flex items-center justify-center mb-4`}>
              <tip.icon className={tip.color} size={18} />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1.5">{tip.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{tip.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
