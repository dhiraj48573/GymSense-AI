import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, Shield, Brain, Mic, BarChart3,
  Cpu, Lock, Zap, Eye, Users, Target, TrendingUp, Heart,
  Code2, Globe, Activity, Camera, RefreshCw, Volume2, Database, Star
} from 'lucide-react';
import { Button } from '../components/ui/Button';

const PageWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900 py-20 px-6 lg:px-8 font-sans">
    <div className="max-w-4xl mx-auto">
      <Link to="/landing" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium mb-8 transition-colors">
        <ArrowLeft size={18} className="mr-2" />
        Back to Home
      </Link>
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-10 tracking-tight">{title}</h1>
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 text-lg text-slate-600 leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

export const Pricing = () => (
  <PageWrapper title="Simple, Transparent Pricing">
    <div className="grid md:grid-cols-2 gap-8 mt-4">
      <div className="border border-teal-200 bg-teal-50/50 p-8 rounded-2xl">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Free Tier</h3>
        <div className="text-4xl font-extrabold text-teal-600 mb-6">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
        <ul className="space-y-4 mb-8">
          <li className="flex"><CheckCircle2 className="text-teal-500 mr-3 shrink-0" /> Basic form tracking</li>
          <li className="flex"><CheckCircle2 className="text-teal-500 mr-3 shrink-0" /> Local history saving</li>
          <li className="flex"><CheckCircle2 className="text-teal-500 mr-3 shrink-0" /> Limited AI coaching</li>
        </ul>
        <Link to="/register"><Button className="w-full">Get Started</Button></Link>
      </div>
      <div className="border border-slate-200 bg-white p-8 rounded-2xl shadow-lg relative">
        <div className="absolute top-0 right-6 -translate-y-1/2 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro Plan</h3>
        <div className="text-4xl font-extrabold text-slate-900 mb-6">$9.99<span className="text-lg text-slate-500 font-normal">/mo</span></div>
        <ul className="space-y-4 mb-8">
          <li className="flex"><CheckCircle2 className="text-teal-500 mr-3 shrink-0" /> Advanced real-time form metrics</li>
          <li className="flex"><CheckCircle2 className="text-teal-500 mr-3 shrink-0" /> Unlimited Generative AI Voice Coaching</li>
          <li className="flex"><CheckCircle2 className="text-teal-500 mr-3 shrink-0" /> Cloud Sync & Advanced Analytics</li>
        </ul>
        <Link to="/register"><Button variant="primary" className="w-full">Start 14-Day Trial</Button></Link>
      </div>
    </div>
  </PageWrapper>
);

export const AboutUs = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

    {/* Back Nav */}
    <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">
      <Link to="/landing" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors">
        <ArrowLeft size={18} className="mr-2" />
        Back to Home
      </Link>
    </div>

    {/* Hero */}
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-teal-400/10 rounded-full blur-[90px]" />
      </div>
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-100 px-4 py-2 rounded-full text-sm text-teal-700 font-semibold mb-6 shadow-sm">
          <Heart size={14} className="text-teal-500" />
          <span>Our Story</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">GymSense AI</span>
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
          We believe everyone deserves a world-class personal trainer in their pocket — without the price tag of a smart mirror or gym membership.
        </p>
      </div>
    </section>

    {/* Mission Cards */}
    <section className="py-16 bg-white border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Target,
              title: "Our Mission",
              desc: "Democratize elite fitness coaching by putting computer vision and generative AI directly in the browser — zero hardware, zero subscriptions required to get started."
            },
            {
              icon: Eye,
              title: "Privacy First",
              desc: "All pose estimation runs 100% locally on your device. Your camera frames never leave your browser. We only store lightweight numerical metrics — never images."
            },
            {
              icon: TrendingUp,
              title: "Science-Backed",
              desc: "Our deterministic rep counters use strict biomechanical joint-angle thresholds — not guesswork — to ensure you get credit only for full range-of-motion repetitions."
            }
          ].map((card, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 p-8 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition duration-300">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-5">
                <card.icon className="text-teal-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
              <p className="text-slate-600 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Story Section */}
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">The Problem We're Solving</h2>
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200 text-lg text-slate-600 leading-relaxed space-y-6">
          <p>
            Gym memberships average <strong className="text-slate-900">$50/month</strong>, personal trainers cost <strong className="text-slate-900">$60–$100/session</strong>, and smart mirrors like Peloton or Tonal run <strong className="text-slate-900">$2,000–$4,000 upfront</strong>. For the vast majority of people, expert form coaching is simply out of reach.
          </p>
          <p>
            GymSense AI was built to change that. By leveraging <strong className="text-slate-900">Google's MediaPipe</strong> — the same framework used in production by Google Meet, YouTube, and fitness apps worldwide — we perform real-time 33-point body landmark detection entirely within your browser. No app to install, no hardware to buy.
          </p>
          <p>
            When a set ends, we send only a handful of numbers (rep count, form score, duration) to <strong className="text-slate-900">Groq's ultra-low-latency LLM API</strong> to generate personalized coaching feedback — spoken aloud via the browser's native SpeechSynthesis API. Your workout stays private, your feedback is instant.
          </p>
        </div>
      </div>
    </section>

    {/* Tech Stack */}
    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Built with Best-in-Class Technology</h2>
          <p className="text-slate-400">A modern, full-stack architecture designed for speed, privacy, and scale.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Frontend", items: ["React 18", "Vite", "TypeScript", "Tailwind CSS", "Recharts"], color: "teal" },
            { label: "Backend", items: ["Node.js", "Express", "TypeScript", "Mongoose", "Zod"], color: "emerald" },
            { label: "AI Service", items: ["Python 3.11", "FastAPI", "MediaPipe", "OpenCV", "NumPy"], color: "cyan" },
            { label: "Infrastructure", items: ["MongoDB", "Groq LLM", "JWT Auth", "WebSockets", "HTTP-Only Cookies"], color: "sky" },
          ].map((stack, i) => (
            <div key={i} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h4 className="text-teal-400 font-bold text-sm uppercase tracking-wider mb-4">{stack.label}</h4>
              <ul className="space-y-2">
                {stack.items.map((item, j) => (
                  <li key={j} className="flex items-center text-slate-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mr-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Architecture Flow */}
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">System Architecture</h2>
        <p className="text-slate-600 text-center mb-12">Three microservices, one seamless experience.</p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {[
            { icon: Camera, label: "Browser Camera", sub: "RequestAnimationFrame", color: "bg-purple-100 text-purple-600" },
            { icon: Globe, label: "React Frontend", sub: "Vite + TypeScript", color: "bg-teal-100 text-teal-600" },
            { icon: Cpu, label: "Python AI Service", sub: "FastAPI + MediaPipe", color: "bg-emerald-100 text-emerald-600" },
            { icon: Code2, label: "Node.js Backend", sub: "Express + MongoDB", color: "bg-blue-100 text-blue-600" },
            { icon: Brain, label: "Groq LLM", sub: "llama3-8b-8192", color: "bg-orange-100 text-orange-600" },
          ].map((node, i, arr) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm ${node.color}`}>
                  <node.icon size={26} />
                </div>
                <p className="font-semibold text-slate-900 text-sm">{node.label}</p>
                <p className="text-slate-400 text-xs mt-1">{node.sub}</p>
              </div>
              {i < arr.length - 1 && (
                <div className="hidden md:block text-slate-300 text-2xl font-light mx-1">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="py-16 bg-teal-600 text-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Our Core Beliefs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {[
            { icon: Lock, title: "Privacy is Non-Negotiable", desc: "Camera frames never leave your device. We will never sell or share your workout data." },
            { icon: Zap, title: "Speed Matters", desc: "Feedback must be instant. Groq inference + browser Speech Synthesis delivers real-time audio coaching with sub-second latency." },
            { icon: Shield, title: "Accuracy Over Vanity", desc: "Rep counting uses strict biomechanical state machines. You only get credit for reps you actually complete." },
            { icon: Users, title: "Accessibility for All", desc: "A webcam is all you need. GymSense runs on any modern browser — no installs, no hardware upgrades." },
          ].map((v, i) => (
            <div key={i} className="flex items-start space-x-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <v.icon size={20} className="text-white" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-1">{v.title}</h4>
                <p className="text-teal-100 text-sm leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 text-center">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to train smarter?</h2>
        <p className="text-slate-600 mb-8">Create your free account and get instant access to AI-powered form coaching in under a minute.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register"><Button variant="primary" size="lg">Get Started — It's Free</Button></Link>
          <Link to="/features"><Button variant="secondary" size="lg">Explore Features</Button></Link>
        </div>
      </div>
    </section>

    {/* Footer Note */}
    <div className="text-center py-6 border-t border-slate-200 text-sm text-slate-400">
      © {new Date().getFullYear()} GymSense AI. All rights reserved.
    </div>
  </div>
);

export const PrivacyPolicy = () => (
  <PageWrapper title="Privacy Policy">
    <p className="mb-6"><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>
    <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">1. Video Processing</h3>
    <p className="mb-6">
      GymSense respects your privacy. All computer vision and pose estimation runs entirely locally within your browser. <strong>We do not save, record, or transmit your camera frames or images to our servers.</strong>
    </p>
    <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">2. Data Collection</h3>
    <p className="mb-6">
      We only store metric data to provide you with historical progress tracking. This includes the names of exercises you perform, the duration, your repetition counts, and your form scores.
    </p>
    <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">3. AI Coaching</h3>
    <p className="mb-6">
      To generate personalized coaching feedback, we send anonymous numerical metrics (like joint angles and rep counts) to our AI provider (Groq). No personal identifiable information or images are sent to the AI.
    </p>
  </PageWrapper>
);

export const TermsOfService = () => (
  <PageWrapper title="Terms of Service">
    <h3 className="text-xl font-bold text-slate-900 mb-4">1. Medical Disclaimer</h3>
    <p className="mb-6">
      GymSense AI is a software tool designed to assist with fitness tracking. It is <strong>not</strong> a medical device and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a physician before starting any new exercise program.
    </p>
    <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">2. Assumption of Risk</h3>
    <p className="mb-6">
      By using GymSense AI, you acknowledge that exercise involves inherent risks. GymSense AI provides form cues based on algorithmic estimations which may be inaccurate due to camera angles, lighting, or hardware limitations. You agree to use the software at your own risk.
    </p>
    <h3 className="text-xl font-bold text-slate-900 mb-4 mt-8">3. Account Responsibilities</h3>
    <p>
      You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
    </p>
  </PageWrapper>
);

const FeatureHero = () => (
  <section className="relative py-20 md:py-28 overflow-hidden text-center">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-teal-400/10 rounded-full blur-[100px]" />
    </div>
    <div className="max-w-4xl mx-auto px-6 relative z-10">
      <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-100 px-4 py-2 rounded-full text-sm text-teal-700 font-semibold mb-6 shadow-sm">
        <Star size={14} className="text-teal-500" />
        <span>Full Feature Breakdown</span>
      </div>
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
        Everything in <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500">GymSense AI</span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
        A complete breakdown of every capability powering your AI fitness coach — from computer vision to generative audio feedback.
      </p>
    </div>
  </section>
);

export const Features = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

    {/* Back Nav */}
    <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-10">
      <Link to="/landing" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium transition-colors">
        <ArrowLeft size={18} className="mr-2" />
        Back to Home
      </Link>
    </div>

    <FeatureHero />

    {/* Core Features Grid */}
    <section className="py-16 bg-white border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900">Core Capabilities</h2>
          <p className="mt-3 text-slate-600">The five pillars that make GymSense AI uniquely powerful.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Eye,
              title: "Real-Time Form Tracking",
              badge: "Computer Vision",
              badgeColor: "bg-purple-100 text-purple-700",
              desc: "MediaPipe's 33-point body landmark model detects your skeleton at 30+ FPS directly in the browser. Joint angles for hips, knees, elbows, and shoulders are calculated every frame — giving you instant posture corrections as you move.",
              bullets: ["33 body landmarks", "30+ FPS processing", "Real-time angle calculation", "No app install needed"]
            },
            {
              icon: RefreshCw,
              title: "Deterministic Rep Counting",
              badge: "State Machine",
              badgeColor: "bg-blue-100 text-blue-700",
              desc: "Reps aren't guessed — they're guaranteed. A biomechanical state machine tracks your movement phase (Standing → Lowering → Bottom → Returning → Standing) and only credits a rep when the full range of motion is completed.",
              bullets: ["Full ROM required", "Phase-based counting", "Zero false positives", "Supports Squats, Push-ups, Curls"]
            },
            {
              icon: Brain,
              title: "Generative AI Coaching",
              badge: "Groq LLM",
              badgeColor: "bg-orange-100 text-orange-700",
              desc: "After each set, GymSense sends your rep count, form score, and set duration to Groq's llama3-8b-8192 model. The LLM synthesizes context-aware, personalized feedback — then reads it aloud using the browser's native SpeechSynthesis API.",
              bullets: ["Groq ultra-low latency inference", "Text-to-speech audio feedback", "Context-aware tips", "10 req/min rate limiting + fallback"]
            },
            {
              icon: Volume2,
              title: "Real-Time Audio Feedback",
              badge: "Web Speech API",
              badgeColor: "bg-emerald-100 text-emerald-700",
              desc: "Coaching tips are spoken aloud instantly using the browser's built-in SpeechSynthesis API — no extra dependency required. Keep your eyes on your form, not a screen. Feedback triggers automatically at the end of every set.",
              bullets: ["Browser-native TTS", "Zero extra latency", "Hands-free coaching", "No earpiece required"]
            },
            {
              icon: BarChart3,
              title: "Progress Analytics Dashboard",
              badge: "Recharts",
              badgeColor: "bg-teal-100 text-teal-700",
              desc: "A rich Recharts-powered dashboard visualizes your training history. See weekly volume trends, form score improvements over time, and per-exercise breakdowns — all aggregated from your MongoDB workout history.",
              bullets: ["Volume over time charts", "Form score trend lines", "Per-exercise breakdowns", "Session duration tracking"]
            },
            {
              icon: Lock,
              title: "Secure Auth & Persistence",
              badge: "JWT + MongoDB",
              badgeColor: "bg-slate-100 text-slate-700",
              desc: "Authentication uses JWTs stored exclusively in HTTP-only, Secure cookies — preventing XSS token theft. Workout data is persisted in MongoDB via Mongoose schemas, with all routes protected by a middleware auth guard.",
              bullets: ["HTTP-only JWT cookies", "No XSS token exposure", "MongoDB persistence", "Zod request validation"]
            },
          ].map((f, i) => (
            <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col">
              <div className="flex items-start justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center shadow-sm">
                  <f.icon className="text-teal-600" size={24} />
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${f.badgeColor}`}>{f.badge}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm mb-5 flex-1">{f.desc}</p>
              <ul className="space-y-2 border-t border-slate-200 pt-4">
                {f.bullets.map((b, j) => (
                  <li key={j} className="flex items-center text-sm text-slate-700">
                    <CheckCircle2 size={15} className="text-teal-500 mr-2 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Privacy Deep Dive */}
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-3xl p-10 md:p-14 text-white">
          <div className="flex items-center space-x-3 mb-6">
            <Shield size={28} className="text-white" />
            <h2 className="text-3xl font-bold">Privacy-First by Design</h2>
          </div>
          <p className="text-teal-100 text-lg leading-relaxed mb-8">
            Your camera is powerful. Your data is yours. GymSense AI was architected from day one with a strict privacy model — not added as an afterthought.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Camera, title: "On-Device Vision", desc: "All pose estimation (MediaPipe) runs entirely in your browser via WebAssembly. No frames are ever sent to our servers." },
              { icon: Database, title: "Minimal Data Storage", desc: "We store only numerical metrics: exercise name, rep count, form score, and session duration. Zero images, zero PII beyond email." },
              { icon: Zap, title: "Anonymous AI Calls", desc: "Groq receives only anonymous numbers (angles, reps, scores). Your name, email, and camera feed are never included in LLM prompts." },
            ].map((p, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p.icon size={22} className="text-white mb-3" />
                <h4 className="font-bold text-white mb-2">{p.title}</h4>
                <p className="text-teal-100 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* API Surface */}
    <section className="py-16 bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">API Surface</h2>
          <p className="text-slate-400">Every endpoint powering the GymSense experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              group: "Authentication",
              color: "border-purple-500",
              badge: "bg-purple-500/20 text-purple-300",
              routes: [
                { method: "POST", path: "/api/auth/register" },
                { method: "POST", path: "/api/auth/login" },
                { method: "POST", path: "/api/auth/logout" },
                { method: "GET", path: "/api/auth/me" },
              ]
            },
            {
              group: "Workouts",
              color: "border-teal-500",
              badge: "bg-teal-500/20 text-teal-300",
              routes: [
                { method: "POST", path: "/api/workouts/" },
                { method: "GET", path: "/api/workouts/" },
                { method: "GET", path: "/api/workouts/progress" },
                { method: "GET", path: "/api/workouts/:id" },
              ]
            },
            {
              group: "Coaching",
              color: "border-orange-500",
              badge: "bg-orange-500/20 text-orange-300",
              routes: [
                { method: "POST", path: "/api/coaching/generate" },
                { method: "WS", path: "ws://…/ws/pose" },
              ]
            },
          ].map((api, i) => (
            <div key={i} className={`bg-slate-800 rounded-2xl p-6 border-t-2 ${api.color} border border-slate-700`}>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${api.badge} mb-4 inline-block`}>{api.group}</span>
              <ul className="space-y-3">
                {api.routes.map((r, j) => (
                  <li key={j} className="flex items-center space-x-3">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      r.method === 'GET' ? 'bg-emerald-900/50 text-emerald-400' :
                      r.method === 'POST' ? 'bg-blue-900/50 text-blue-400' :
                      'bg-yellow-900/50 text-yellow-400'
                    }`}>{r.method}</span>
                    <code className="text-slate-300 text-xs font-mono">{r.path}</code>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Supported Exercises Preview */}
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">Supported Exercises</h2>
        <p className="text-slate-600 text-center mb-12">Three fundamental compound movements. More coming soon.</p>
        <div className="space-y-6">
          {[
            {
              name: "Squats",
              icon: "🦵",
              metrics: ["Hip depth relative to knee", "Knee valgus (cave-in) detection", "Back angle tracking"],
              states: ["Standing", "Lowering", "Bottom", "Returning"],
              threshold: "Hip crease below knee = valid rep"
            },
            {
              name: "Push-ups",
              icon: "💪",
              metrics: ["Elbow flexion angle", "Core straightness", "Full lockout at top"],
              states: ["Up", "Lowering", "Bottom", "Pushing"],
              threshold: "Elbow angle < 90° at bottom, full extension at top"
            },
            {
              name: "Bicep Curls",
              icon: "🏋️",
              metrics: ["Upper arm deviation", "Full extension at bottom", "Maximal contraction at top"],
              states: ["Down", "Curling", "Top", "Lowering"],
              threshold: "No shoulder swing, full ROM required"
            },
          ].map((ex, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition duration-300">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex items-start space-x-4">
                  <span className="text-4xl">{ex.icon}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{ex.name}</h3>
                    <p className="text-sm text-slate-500 font-mono bg-slate-100 px-3 py-1 rounded-full inline-block">{ex.threshold}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 md:text-right">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Metrics Tracked</p>
                    <ul className="space-y-1">
                      {ex.metrics.map((m, j) => (
                        <li key={j} className="text-sm text-slate-600 flex items-center md:justify-end">
                          <CheckCircle2 size={13} className="text-teal-500 mr-1.5 shrink-0" />
                          {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">State Machine</p>
                    <div className="flex flex-wrap gap-1 md:justify-end">
                      {ex.states.map((s, j) => (
                        <span key={j} className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 bg-slate-50 border-t border-slate-200 text-center">
      <div className="max-w-2xl mx-auto px-6">
        <Activity size={36} className="text-teal-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Start training with AI today</h2>
        <p className="text-slate-600 mb-8">All you need is a webcam. Create your free account and begin your first AI-coached session in minutes.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register"><Button variant="primary" size="lg">Create Free Account</Button></Link>
          <Link to="/about"><Button variant="secondary" size="lg">Learn About Us</Button></Link>
        </div>
      </div>
    </section>

    {/* Footer Note */}
    <div className="text-center py-6 border-t border-slate-200 text-sm text-slate-400">
      © {new Date().getFullYear()} GymSense AI. All rights reserved.
    </div>
  </div>
);

export const Exercises = () => (
  <PageWrapper title="Supported Exercises">
    <p className="mb-8">GymSense AI currently supports the fundamental compound movements that provide the highest ROI for your fitness goals. More exercises are added regularly!</p>
    
    <div className="space-y-6">
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Barbell / Bodyweight Squats</h3>
        <p>Evaluates hip crease depth relative to the knee to ensure full depth. Monitors knee tracking to warn against dangerous knee valgus (cave-in).</p>
      </div>
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Push-ups</h3>
        <p>Tracks elbow flexion angle to ensure you break 90 degrees at the bottom, and verifies full elbow lockout at the top of the movement.</p>
      </div>
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Bicep Curls</h3>
        <p>Measures upper arm deviation to detect cheating or swinging. Ensures you achieve full extension at the bottom and maximal contraction at the top.</p>
      </div>
    </div>
  </PageWrapper>
);
