import React, { useState } from 'react';
import {
  Settings, LogOut, Award, User, Shield, Camera, Bell,
  Target, Dumbbell, Flame, Trophy, Edit3, Check, X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const StatBadge = ({ icon: Icon, label, value, color, bg }: any) => (
  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
    <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center mb-2`}>
      <Icon className={color} size={18} />
    </div>
    <p className="text-xl font-extrabold text-slate-900 stat-number">{value}</p>
    <p className="text-xs text-slate-500 font-semibold text-center">{label}</p>
  </div>
);

const SettingRow = ({ icon: Icon, title, desc, action }: any) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
    <div className="flex items-center space-x-3">
      <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
        <Icon size={16} className="text-slate-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </div>
    {action}
  </div>
);

export const Profile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(user?.name ?? '');
  const [notifications, setNotifications] = useState(true);

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) ?? 'U';

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      await fetch(`${apiUrl}/api/auth/logout`, { method: 'POST', credentials: 'include' });
      setUser(null);
      navigate('/landing');
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">

      {/* Profile hero card */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(20,184,166,0.4) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(16,185,129,0.3) 0%, transparent 50%)' }} />
        <div className="relative z-10 p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl shadow-teal-500/30">
              {initials}
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Camera size={14} className="text-slate-700" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-1">
              {editingName ? (
                <div className="flex items-center space-x-2">
                  <input
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    className="bg-white/10 border border-white/30 rounded-lg px-3 py-1.5 text-white text-lg font-bold focus:outline-none focus:border-teal-400 w-48"
                  />
                  <button onClick={() => setEditingName(false)} className="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center hover:bg-teal-400 transition-colors">
                    <Check size={14} className="text-white" />
                  </button>
                  <button onClick={() => setEditingName(false)} className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors">
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-extrabold text-white">{user?.name}</h1>
                  <button onClick={() => setEditingName(true)} className="text-slate-400 hover:text-white transition-colors">
                    <Edit3 size={15} />
                  </button>
                </>
              )}
            </div>
            <p className="text-slate-400 text-sm mb-3">{user?.email}</p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center space-x-1.5 bg-amber-500/20 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-xs font-bold">
                <Award size={12} />
                <span>Pro Member</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 bg-teal-500/20 border border-teal-500/30 text-teal-400 px-3 py-1 rounded-full text-xs font-bold">
                <Shield size={12} />
                <span>Privacy Verified</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 bg-white/10 border border-white/20 text-slate-400 px-3 py-1 rounded-full text-xs font-medium">
                Member since Oct 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBadge icon={Dumbbell} label="Total Sessions" value="28"    color="text-teal-600"   bg="bg-teal-50" />
        <StatBadge icon={Flame}    label="Best Streak"    value="14d"   color="text-orange-500" bg="bg-orange-50" />
        <StatBadge icon={Trophy}   label="Avg Form Score" value="92%"   color="text-amber-600"  bg="bg-amber-50" />
        <StatBadge icon={Target}   label="This Month"     value="12"    color="text-indigo-600" bg="bg-indigo-50" />
      </div>

      {/* Settings panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Account Settings */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Account Settings</h3>
          </div>
          <div className="px-6 py-2">
            <SettingRow
              icon={User}
              title="Full Name"
              desc={user?.name ?? 'Set your display name'}
              action={
                <button onClick={() => setEditingName(true)} className="text-teal-600 hover:text-teal-700 text-xs font-bold">
                  Edit
                </button>
              }
            />
            <SettingRow
              icon={Shield}
              title="Email Address"
              desc={user?.email ?? '—'}
              action={<span className="text-xs text-slate-400 font-medium">Verified ✓</span>}
            />
            <SettingRow
              icon={Settings}
              title="Password"
              desc="Last changed never"
              action={<button className="text-teal-600 hover:text-teal-700 text-xs font-bold">Change</button>}
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Preferences</h3>
          </div>
          <div className="px-6 py-2">
            <SettingRow
              icon={Bell}
              title="Push Notifications"
              desc="Workout reminders & tips"
              action={
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-11 h-6 rounded-full transition-all duration-200 relative ${notifications ? 'bg-teal-500' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${notifications ? 'left-5' : 'left-0.5'}`} />
                </button>
              }
            />
            <SettingRow
              icon={Camera}
              title="Camera Quality"
              desc="720p (recommended)"
              action={<button className="text-teal-600 hover:text-teal-700 text-xs font-bold">Change</button>}
            />
            <SettingRow
              icon={Shield}
              title="Privacy Mode"
              desc="Camera data stays local"
              action={<span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Active</span>}
            />
          </div>
        </div>

      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100">
          <h3 className="font-bold text-red-600">Danger Zone</h3>
        </div>
        <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Log Out of GymSense AI</p>
            <p className="text-xs text-slate-500 mt-0.5">You'll need to log in again to access your data.</p>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shrink-0">
            <LogOut size={16} className="mr-2" /> Log Out
          </Button>
        </div>
        <div className="px-6 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-red-100 pt-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">Delete Account</p>
            <p className="text-xs text-slate-500 mt-0.5">Permanently remove all data. This cannot be undone.</p>
          </div>
          <Button variant="danger" className="shrink-0">
            Delete My Account
          </Button>
        </div>
      </div>

    </div>
  );
};
