import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, ArrowRight, Video, Target, TrendingUp, CheckCircle2,
  Menu, X, Zap, BarChart3, Users, BookOpen
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const navLinks = [
  { label: 'Features',  to: '/features',  icon: Zap },
  { label: 'Exercises', to: '/exercises', icon: Target },
  { label: 'About',     to: '/about',    icon: Users },
  { label: 'Pricing',   to: '/pricing',  icon: BookOpen },
];

export const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 py-3.5">

          {/* Logo */}
          <Link to="/landing" className="flex items-center space-x-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Activity className="text-white" size={20} />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-none">GymSense AI</span>
              <span className="text-[9px] font-bold text-teal-600 uppercase tracking-widest">AI Fitness Coach</span>
            </div>
          </Link>

          {/* Desktop nav links — flat, side by side */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((nav) => {
              const Icon = nav.icon;
              return (
                <Link
                  key={nav.to}
                  to={nav.to}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-all"
                >
                  <Icon size={15} className="text-slate-400" />
                  <span>{nav.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">
              Log in
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" className="shadow-lg shadow-teal-500/20 font-bold">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* Mobile menu — flat vertical list */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 space-y-1 shadow-lg">
            {navLinks.map((nav) => {
              const Icon = nav.icon;
              return (
                <Link
                  key={nav.to}
                  to={nav.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-teal-600" />
                  </div>
                  <span>{nav.label}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-slate-700 border border-slate-200 hover:bg-slate-50 justify-center">
                  Log in
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                <Button variant="primary" className="w-full justify-center shadow-md shadow-teal-500/20">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-6 lg:px-8 py-24 md:py-32 overflow-hidden flex flex-col items-center text-center">
          {/* Subtle background blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-100 px-4 py-2 rounded-full text-sm text-teal-700 font-semibold mb-8 relative z-10 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>AI-Powered Computer Vision Coach</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl leading-tight relative z-10">
            Perfect your form.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">
              Maximize your gains.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed relative z-10">
            GymSense uses state-of-the-art AI to analyze your workout in real-time right from your browser, providing instant feedback on your posture, rep counts, and overall technique.
          </p>

          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 relative z-10">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto text-base shadow-xl shadow-teal-500/20 px-8">
                Start Your Free Trial
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base bg-white border-slate-300 hover:bg-slate-50 text-slate-700">
                View Dashboard
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Why choose GymSense?</h2>
              <p className="mt-4 text-slate-600">Train smarter with precise, data-driven feedback.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Real-time Analysis", icon: Video, desc: "Instant form feedback using just your webcam or phone camera. No extra hardware required." },
                { title: "Smart Rep Counting", icon: Target, desc: "Never lose track. GymSense automatically counts accurate reps based on your full range of motion." },
                { title: "Data-driven Progress", icon: TrendingUp, desc: "Detailed analytics on your form score and volume, complete with an AI generative coach." }
              ].map((feature, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 p-8 rounded-2xl transition hover:shadow-lg hover:-translate-y-1 duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center mb-6 shadow-sm">
                    <feature.icon className="text-teal-600" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Supported Exercises Section */}
        <section id="exercises" className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Supported Exercises</h2>
              <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
                Our vision models are trained to track the most essential compound movements perfectly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Squat Card */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 group">
                <div className="h-64 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800"
                    alt="Squat Exercise"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white">Squats</h3>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 mb-4">Tracks hip depth, knee alignment, and back posture to ensure a safe and effective leg workout.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-slate-700"><CheckCircle2 size={16} className="text-teal-500 mr-2" /> Depth tracking</li>
                    <li className="flex items-center text-sm text-slate-700"><CheckCircle2 size={16} className="text-teal-500 mr-2" /> Knee cave alerts</li>
                  </ul>
                </div>
              </div>

              {/* Push-up Card */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 group">
                <div className="h-64 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&q=80&w=800"
                    alt="Push-up Exercise"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white">Push-ups</h3>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 mb-4">Monitors elbow angles and core alignment to guarantee full range of motion for your chest.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-slate-700"><CheckCircle2 size={16} className="text-teal-500 mr-2" /> Core straightness</li>
                    <li className="flex items-center text-sm text-slate-700"><CheckCircle2 size={16} className="text-teal-500 mr-2" /> Elbow lockout</li>
                  </ul>
                </div>
              </div>

              {/* Bicep Curl Card */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 group">
                <div className="h-64 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800"
                    alt="Bicep Curl Exercise"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white">Bicep Curls</h3>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 mb-4">Ensures your elbows remain tucked and isolates the bicep to prevent swinging or cheating.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-slate-700"><CheckCircle2 size={16} className="text-teal-500 mr-2" /> Upper arm stability</li>
                    <li className="flex items-center text-sm text-slate-700"><CheckCircle2 size={16} className="text-teal-500 mr-2" /> Contraction angle</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="text-teal-500" size={24} />
              <span className="text-xl font-bold text-white">GymSense AI</span>
            </div>
            <p className="mb-6 max-w-sm">
              The next generation of fitness tracking. Train perfectly at home without buying expensive mirrors or hardware.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/features" className="hover:text-teal-400 transition">Features</Link></li>
              <li><Link to="/exercises" className="hover:text-teal-400 transition">Exercises</Link></li>
              <li><Link to="/pricing" className="hover:text-teal-400 transition">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-teal-400 transition">About Us</Link></li>
              <li><Link to="/privacy" className="hover:text-teal-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-teal-400 transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
          &copy; {new Date().getFullYear()} GymSense AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
