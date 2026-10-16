import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, AlertCircle, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const AuthLayout = ({ children, side }: { children: React.ReactNode; side: React.ReactNode }) => (
  <div className="min-h-screen flex bg-slate-50">
    {/* Left: form */}
    <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <Link to="/landing" className="inline-flex items-center space-x-2.5 mb-10 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform">
            <Activity className="text-white" size={20} />
          </div>
          <span className="text-xl font-extrabold text-slate-900">GymSense AI</span>
        </Link>
        {children}
      </div>
    </div>

    {/* Right: feature showcase */}
    <div className="hidden lg:flex flex-1 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-600 relative overflow-hidden items-center justify-center">
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 70%, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="relative z-10 max-w-sm px-8 text-white">{side}</div>
    </div>
  </div>
);

const FeaturePoint = ({ text }: { text: string }) => (
  <div className="flex items-center space-x-3 mb-4">
    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
      <CheckCircle2 size={14} className="text-white" />
    </div>
    <span className="text-teal-100 text-sm font-medium">{text}</span>
  </div>
);

export const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to login');
      setUser(data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout side={
      <>
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
          <Activity className="text-white" size={28} />
        </div>
        <h2 className="text-2xl font-extrabold mb-2">Train smarter,<br/>not harder.</h2>
        <p className="text-teal-200 text-sm mb-8 leading-relaxed">GymSense uses AI + computer vision to give you real-time coaching right in your browser.</p>
        <FeaturePoint text="Real-time form feedback at 30+ FPS" />
        <FeaturePoint text="Deterministic rep counting — no false positives" />
        <FeaturePoint text="Groq-powered AI voice coaching" />
        <FeaturePoint text="Camera frames never leave your device" />
        <div className="mt-8 p-4 bg-white/10 backdrop-blur rounded-2xl border border-white/20">
          <p className="text-xs text-teal-200 font-medium">"GymSense caught my knee cave issue on the third rep — something I'd been doing wrong for months."</p>
          <p className="text-xs text-white font-bold mt-2">— Alex Chen, Top Ranked User</p>
        </div>
      </>
    }>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Welcome back</h1>
      <p className="text-slate-500 text-sm mb-8">Sign in to continue your fitness journey.</p>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-center space-x-2.5 text-red-600 text-sm font-medium">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400 transition-all"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400 transition-all"
          />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="flex justify-end">
          <a href="#" className="text-xs text-teal-600 font-semibold hover:text-teal-700">Forgot password?</a>
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          {!loading && <>Sign In <ArrowRight size={16} className="ml-2" /></>}
        </Button>
      </form>

      <p className="text-center text-slate-500 text-sm mt-8">
        Don't have an account?{' '}
        <Link to="/register" className="text-teal-600 hover:text-teal-700 font-bold">Create one free</Link>
      </p>
    </AuthLayout>
  );
};

export const Register = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');
      setUser(data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthColors = ['bg-slate-200', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400'];
  const strengthLabels = ['', 'Weak', 'Medium', 'Strong'];

  return (
    <AuthLayout side={
      <>
        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
          <Activity className="text-white" size={28} />
        </div>
        <h2 className="text-2xl font-extrabold mb-2">Start your AI<br/>fitness journey.</h2>
        <p className="text-teal-200 text-sm mb-8 leading-relaxed">Join thousands of athletes using GymSense to perfect their form and maximize every rep.</p>
        <FeaturePoint text="Free to get started — no credit card" />
        <FeaturePoint text="Works in any modern browser" />
        <FeaturePoint text="100% private — no video stored" />
        <FeaturePoint text="Unlimited workouts on free tier" />
        <div className="mt-8 grid grid-cols-2 gap-3">
          {[
            { label: 'Active Users', value: '12K+' },
            { label: 'Sessions Logged', value: '84K+' },
            { label: 'Avg Score Gain', value: '+18%' },
            { label: 'Satisfaction', value: '4.9★' },
          ].map((s, i) => (
            <div key={i} className="p-3 bg-white/10 rounded-xl border border-white/20 text-center">
              <p className="text-white font-extrabold text-lg">{s.value}</p>
              <p className="text-teal-200 text-xs font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </>
    }>
      <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Create account</h1>
      <p className="text-slate-500 text-sm mb-8">Join GymSense AI and perfect your form today.</p>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-center space-x-2.5 text-red-600 text-sm font-medium">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="relative">
          <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400 transition-all"
          />
        </div>

        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400 transition-all"
          />
        </div>

        <div>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Create password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full pl-11 pr-12 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400 transition-all"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {password && (
            <div className="mt-2 flex items-center space-x-2">
              <div className="flex-1 flex space-x-1">
                {[1,2,3].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColors[strength] : 'bg-slate-200'}`} />
                ))}
              </div>
              <span className={`text-xs font-bold ${strength === 3 ? 'text-emerald-600' : strength === 2 ? 'text-amber-600' : 'text-red-500'}`}>
                {strengthLabels[strength]}
              </span>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full mt-2" size="lg" isLoading={loading}>
          {!loading && <>Create Free Account <ArrowRight size={16} className="ml-2" /></>}
        </Button>

        <p className="text-center text-xs text-slate-400">
          By signing up you agree to our{' '}
          <Link to="/terms" className="text-teal-600 hover:underline">Terms</Link> and{' '}
          <Link to="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>
        </p>
      </form>

      <p className="text-center text-slate-500 text-sm mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-teal-600 hover:text-teal-700 font-bold">Sign in</Link>
      </p>
    </AuthLayout>
  );
};
