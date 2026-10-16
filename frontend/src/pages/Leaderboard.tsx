import React, { useState } from 'react';
import { Trophy, Medal, TrendingUp, Star, Crown, Zap, Activity } from 'lucide-react';

const leaderboardData = [
  { rank: 1,  name: 'Dhiraj',       avatar: 'AC', score: 98.4, streak: 14, sessions: 28, badge: 'Elite',       country: '🇺🇸' },
  { rank: 2,  name: 'Niraj',      avatar: 'MP', score: 97.1, streak: 11, sessions: 24, badge: 'Pro',         country: '🇮🇳' },
  { rank: 3,  name: 'Joy',     avatar: 'LS', score: 96.8, streak: 9,  sessions: 22, badge: 'Pro',         country: '🇧🇷' },
  { rank: 4,  name: 'Sawan',    avatar: 'EJ', score: 95.2, streak: 8,  sessions: 21, badge: 'Advanced',    country: '🇬🇧' },
  { rank: 5,  name: 'Rohit',      avatar: 'KT', score: 94.7, streak: 7,  sessions: 19, badge: 'Advanced',    country: '🇯🇵' },
  { rank: 6,  name: 'Virat',   avatar: 'SK', score: 93.1, streak: 6,  sessions: 17, badge: 'Advanced',    country: '🇵🇱' },
  { rank: 7,  name: 'Amit',      avatar: 'JO', score: 91.5, streak: 5,  sessions: 15, badge: 'Intermediate',country: '🇬🇭' },
  { rank: 8,  name: 'Yash',      avatar: 'PN', score: 90.8, streak: 5,  sessions: 14, badge: 'Intermediate',country: '🇮🇳' },
  { rank: 9,  name: 'Ankit',     avatar: 'DP', score: 89.3, streak: 4,  sessions: 13, badge: 'Intermediate',country: '🇰🇷' },
  { rank: 10, name: 'Ram',  avatar: 'SM', score: 87.6, streak: 3,  sessions: 11, badge: 'Beginner',    country: '🇲🇽' },
];

const tabs = ['Global', 'Weekly', 'Monthly'];

const badgeConfig: Record<string, { color: string; bg: string; icon: any }> = {
  'Elite':        { color: 'text-amber-700',   bg: 'bg-amber-100 border-amber-200',  icon: Crown },
  'Pro':          { color: 'text-purple-700',  bg: 'bg-purple-100 border-purple-200',icon: Star },
  'Advanced':     { color: 'text-teal-700',    bg: 'bg-teal-100 border-teal-200',    icon: TrendingUp },
  'Intermediate': { color: 'text-blue-700',    bg: 'bg-blue-100 border-blue-200',    icon: Zap },
  'Beginner':     { color: 'text-slate-600',   bg: 'bg-slate-100 border-slate-200',  icon: Activity },
};

const rankColors = ['from-amber-400 to-yellow-500', 'from-slate-400 to-slate-500', 'from-orange-400 to-amber-500'];
const rankEmojis = ['🥇', '🥈', '🥉'];

const TopThreeCard = ({ user }: { user: typeof leaderboardData[0] }) => {
  const isFirst = user.rank === 1;
  return (
    <div className={`relative flex flex-col items-center ${isFirst ? 'order-2 -mt-4' : user.rank === 2 ? 'order-1' : 'order-3'}`}>
      {isFirst && (
        <div className="absolute -top-6 text-3xl animate-float">👑</div>
      )}
      <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${rankColors[user.rank - 1]} flex items-center justify-center text-white text-lg font-extrabold shadow-xl mb-2 ${isFirst ? 'w-20 h-20 text-xl' : ''}`}>
        {user.avatar}
        <span className="absolute -bottom-2 -right-2 text-lg">{rankEmojis[user.rank - 1]}</span>
      </div>
      <p className={`font-bold text-slate-900 text-center text-sm ${isFirst ? 'text-base' : ''}`}>{user.name}</p>
      <p className="text-xs text-slate-500 font-medium">{user.country}</p>
      <div className={`mt-2 px-3 py-1 rounded-full font-extrabold text-sm ${isFirst ? 'bg-amber-100 text-amber-700 border border-amber-200 text-base' : 'bg-slate-100 text-slate-700'}`}>
        {user.score}%
      </div>
      <div className={`w-full mt-3 rounded-t-xl flex items-end justify-center bg-gradient-to-t from-slate-100 to-white border-x border-t border-slate-200 ${isFirst ? 'h-24' : user.rank === 2 ? 'h-16' : 'h-12'}`} />
    </div>
  );
};

export const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('Global');
  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center space-x-3">
            <span>Leaderboard</span>
            <Trophy className="text-amber-500" size={30} />
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Top athletes ranked by average form score</p>
        </div>
        {/* Tab switcher */}
        <div className="flex bg-slate-100 rounded-xl p-1">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* My Rank Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-5 flex items-center justify-between shadow-lg shadow-teal-500/20">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-white font-extrabold text-base">
            ME
          </div>
          <div>
            <p className="text-teal-100 text-xs font-semibold uppercase tracking-wider">Your Ranking</p>
            <p className="text-white font-extrabold text-lg">You're in the top 15%!</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white text-3xl font-extrabold stat-number">#23</p>
          <p className="text-teal-200 text-xs font-semibold">87.2% avg score</p>
        </div>
      </div>

      {/* Podium */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center mb-8">Top 3 This {activeTab === 'Weekly' ? 'Week' : activeTab === 'Monthly' ? 'Month' : 'Time'}</h3>
        <div className="flex items-end justify-center gap-4">
          {topThree.sort((a, b) => {
            if (a.rank === 1) return 0;
            if (b.rank === 1) return 0;
            return a.rank - b.rank;
          }).map(user => <TopThreeCard key={user.rank} user={user} />)}
        </div>
      </div>

      {/* Full rankings */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Full Rankings</h3>
          <span className="text-xs text-slate-400 font-medium">Updated daily</span>
        </div>
        <div className="divide-y divide-slate-50">
          {/* My rank in list */}
          <div className="flex items-center px-6 py-4 bg-teal-50/50 border-l-4 border-l-teal-500">
            <span className="w-8 text-center font-extrabold text-teal-600 text-sm">#23</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-xs font-extrabold mx-3 shadow-sm">
              ME
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">You</p>
              <p className="text-xs text-slate-500">4 sessions this week</p>
            </div>
            <div className="flex items-center space-x-2 mr-4">
              <span className="text-xs bg-teal-100 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full font-bold">Intermediate</span>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-teal-700">87.2%</p>
              <p className="text-xs text-slate-400">Streak: 3d</p>
            </div>
          </div>

          {leaderboardData.map(user => {
            const badge = badgeConfig[user.badge];
            const BadgeIcon = badge.icon;
            return (
              <div key={user.rank} className="flex items-center px-6 py-4 hover:bg-slate-50 transition-colors group">
                <span className={`w-8 text-center font-extrabold text-sm ${user.rank <= 3 ? 'text-amber-600' : 'text-slate-400'}`}>
                  {user.rank <= 3 ? rankEmojis[user.rank - 1] : `#${user.rank}`}
                </span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user.rank <= 3 ? rankColors[user.rank - 1] : 'from-slate-400 to-slate-500'} flex items-center justify-center text-white text-xs font-extrabold mx-3 shadow-sm`}>
                  {user.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-bold text-slate-900 truncate group-hover:text-teal-700 transition-colors">{user.name}</p>
                    <span>{user.country}</span>
                  </div>
                  <p className="text-xs text-slate-500">{user.sessions} sessions · {user.streak}d streak</p>
                </div>
                <div className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full border text-xs font-bold mr-4 ${badge.bg} ${badge.color}`}>
                  <BadgeIcon size={11} />
                  <span>{user.badge}</span>
                </div>
                <div className="text-right">
                  <p className={`font-extrabold text-sm ${user.rank === 1 ? 'text-amber-600' : 'text-slate-900'}`}>{user.score}%</p>
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full" style={{ width: `${user.score}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement badges */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-4">Your Achievements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: '🔥', title: 'On Fire', desc: '3-day streak', earned: true },
            { icon: '💯', title: 'Perfect Form', desc: '100% score once', earned: true },
            { icon: '🏆', title: 'First Workout', desc: 'Completed session 1', earned: true },
            { icon: '⚡', title: 'Speed Run', desc: '< 20 min session', earned: false },
          ].map((a, i) => (
            <div key={i} className={`p-4 rounded-xl border text-center ${a.earned ? 'border-teal-200 bg-teal-50' : 'border-slate-200 bg-slate-50 opacity-50'}`}>
              <div className="text-3xl mb-2">{a.icon}</div>
              <p className="text-xs font-bold text-slate-900">{a.title}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{a.desc}</p>
              {a.earned && <span className="text-[10px] text-teal-600 font-bold mt-1 block">Earned ✓</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
