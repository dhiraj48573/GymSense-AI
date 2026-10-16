import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { MainLayout } from './components/layout/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { Dashboard } from './pages/Dashboard';
import { LiveWorkout } from './pages/LiveWorkout';
import { WorkoutHistory } from './pages/WorkoutHistory';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';
import { Leaderboard } from './pages/Leaderboard';
import { Login, Register } from './pages/AuthPages';

import { Pricing, AboutUs, PrivacyPolicy, TermsOfService, Features, Exercises } from './pages/StaticPages';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/live" element={<LiveWorkout />} />
          <Route path="/history" element={<WorkoutHistory />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* App Pages */}
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Static Pages */}
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/features" element={<Features />} />
          <Route path="/exercises" element={<Exercises />} />

          {/* Aliases & Fallback */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
