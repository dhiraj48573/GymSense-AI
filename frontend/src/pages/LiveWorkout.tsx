import React, { useState, useEffect, useRef } from 'react';
import { Camera, StopCircle, RefreshCcw, AlertCircle, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export const LiveWorkout = () => {
  const [isActive, setIsActive] = useState(false);
  const [exercise, setExercise] = useState('Squats');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(0);
  const [score, setScore] = useState(100);
  const [aiFeedback, setAiFeedback] = useState<string>("Ready to start!");
  const [coachAdvice, setCoachAdvice] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const [isDemoMode, setIsDemoMode] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // AI Coaching State
  const lastCoachTime = useRef<number>(0);
  const prevRepsRef = useRef<number>(0);

  useEffect(() => {
    if (window.location.search.includes('demo=true')) {
      setIsDemoMode(true);
    }
  }, []);

  const startWorkout = async () => {
    setErrorMsg(null);
    try {
      if (isDemoMode) {
        if (videoRef.current) {
          videoRef.current.src = '/squat_demo.mp4';
          videoRef.current.loop = true;
          videoRef.current.muted = true;
          videoRef.current.play();
        }
        setIsActive(true);
        connectWebSocket();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsActive(true);
      connectWebSocket();
    } catch (err: any) {
      setErrorMsg("Camera access denied or unavailable. Please grant permission.");
    }
  };

  const stopWorkout = () => {
    setIsActive(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current) {
      videoRef.current.pause();
      if (isDemoMode) videoRef.current.src = '';
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const triggerAICoach = async (reason: string, currentReps: number, currentScore: number, currentCue: string) => {
    const now = Date.now();
    // Rate limit: Max 1 coaching interaction every 15 seconds
    if (now - lastCoachTime.current < 15000) return;
    lastCoachTime.current = now;

    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/coaching/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise,
          reps: currentReps,
          sets,
          form_score: currentScore,
          recent_cues: [currentCue, reason],
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCoachAdvice(data.coach_message);
        speak(data.coach_message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const connectWebSocket = () => {
    const wsUrl = import.meta.env.VITE_AI_SERVICE_URL 
      ? import.meta.env.VITE_AI_SERVICE_URL.replace('http', 'ws') + '/ws/analyze'
      : 'ws://localhost:8000/ws/analyze';
      
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to AI Service');
      sendFrame();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          console.error("AI Error:", data.error);
        } else {
          if (data.person_detected) {
            const currentReps = data.reps || 0;
            const currentScore = data.form_score ?? 100;
            const currentCue = data.cue || "Tracking...";
            
            setReps(currentReps);
            setSets(data.sets || 0);
            setScore(currentScore);
            setAiFeedback(currentCue);

            // Event-based Coaching Triggers
            if (currentReps > prevRepsRef.current && currentReps > 0 && currentReps % 3 === 0) {
              // Trigger every 3 reps for encouragement
              triggerAICoach(`Completed ${currentReps} reps`, currentReps, currentScore, currentCue);
            } else if (currentScore < 60) {
              // Trigger on poor form
              triggerAICoach("Form score is low, needs urgent correction", currentReps, currentScore, currentCue);
            } else if (currentCue && !currentCue.toLowerCase().includes("good") && !currentCue.toLowerCase().includes("tracking")) {
              // Trigger on specific negative feedback
              triggerAICoach(`Needs form correction: ${currentCue}`, currentReps, currentScore, currentCue);
            }
            
            prevRepsRef.current = currentReps;
          } else {
            setAiFeedback("No person detected in frame.");
          }
        }
      } catch (err) {
        console.error("Failed to parse message", err);
      }
      
      // Request next frame if still active
      if (isActive && ws.readyState === WebSocket.OPEN) {
        requestAnimationFrame(sendFrame);
      }
    };

    ws.onerror = () => {
      setErrorMsg("WebSocket connection error. Is the AI service running?");
      stopWorkout();
    };
  };

  const speak = (text: string) => {
    if (isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const completeSet = async () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action: "complete_set", exercise }));
    }
    
    // 1. Fetch AI Coaching
    setCoachAdvice("Analyzing your set...");
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      
      // Save workout to DB
      await fetch(`${apiUrl}/api/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          exercise,
          reps,
          sets: 1, // saving one set at a time
          formScore: score,
          cues: [aiFeedback],
          durationSec: 60
        })
      }).catch(e => console.error("Failed to save workout", e));

      // Get coaching advice
      const response = await fetch(`${apiUrl}/api/coaching/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise,
          reps,
          sets: sets + 1,
          form_score: score,
          recent_cues: [aiFeedback],
          elapsed_time_sec: 60
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setCoachAdvice(data.coach_message);
        speak(data.coach_message);
      } else {
        setCoachAdvice("Great job! Take a quick rest.");
      }
    } catch (err) {
      setCoachAdvice("Great job! (Offline mode)");
    }
  };

  const sendFrame = () => {
    if (!isActive || !videoRef.current || !canvasRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video.videoWidth === 0) {
      requestAnimationFrame(sendFrame);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.5); // Lower quality for speed
      
      wsRef.current.send(JSON.stringify({
        image_b64: dataUrl,
        annotate: false,
        exercise: exercise
      }));
    }
  };

  useEffect(() => {
    return () => {
      stopWorkout();
    };
  }, []);

  return (
    <div className="h-full flex flex-col space-y-5 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Live Workout Analysis</h1>
          <p className="text-slate-500 text-xs font-medium">Position your camera so your full body is visible in frame.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2.5 rounded-xl border transition-all shadow-sm font-medium text-sm ${
              isMuted ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title={isMuted ? "Unmute Coach" : "Mute Coach"}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <select 
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            disabled={isActive}
            className="bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-2.5 text-slate-900 font-bold text-sm focus:ring-2 focus:ring-teal-500/40 focus:border-teal-400 outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <option value="Squats">🦵 Squats</option>
            <option value="Push-ups">💪 Push-ups</option>
            <option value="Bicep Curls">🏋️ Bicep Curls</option>
            <option value="Deadlifts">🔱 Deadlifts</option>
          </select>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center space-x-3 text-red-600 font-medium shadow-sm">
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      {coachAdvice && (
        <div className="bg-teal-50 border border-teal-200 p-4 rounded-xl flex items-start space-x-3 text-teal-900 shadow-sm">
          <div className="bg-teal-100 p-2 rounded-full shrink-0">
            <Volume2 size={18} className="text-teal-700" />
          </div>
          <div>
            <span className="font-bold text-teal-700 text-xs uppercase tracking-wider mb-1 block">AI Coach</span>
            <p className="text-slate-700 font-medium">{coachAdvice}</p>
          </div>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Camera Feed Area */}
        <Card className="lg:col-span-2 overflow-hidden flex flex-col relative border-slate-200 shadow-sm">
          <div className="flex-1 relative bg-slate-100 flex items-center justify-center border-b border-slate-200">
            <video 
              ref={videoRef} 
              className={`w-full h-full object-cover ${isActive ? 'block' : 'hidden'} transform -scale-x-100`} 
              muted 
              playsInline 
            />
            <canvas ref={canvasRef} className="hidden" />

            {!isActive && (
              <div className="flex flex-col items-center justify-center text-slate-400 space-y-4 absolute inset-0 font-medium">
                <Camera size={48} className="opacity-50" />
                <p>Click start to activate camera</p>
              </div>
            )}
            
            {/* Live Feedback Overlay */}
            {isActive && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 flex items-center space-x-3 shadow-lg">
                {score > 80 ? (
                  <CheckCircle2 className="text-teal-500 shrink-0" size={20} />
                ) : (
                  <AlertCircle className="text-orange-500 shrink-0" size={20} />
                )}
                <span className="text-slate-900 font-bold text-sm whitespace-nowrap">{aiFeedback}</span>
              </div>
            )}
          </div>
          
          <div className="p-4 bg-slate-50 flex justify-center space-x-4 border-t border-slate-100">
            {!isActive ? (
              <Button size="lg" className="w-48 shadow-lg shadow-teal-500/20" onClick={startWorkout}>
                Start Session
              </Button>
            ) : (
              <>
                <Button variant="danger" size="lg" className="w-40" onClick={stopWorkout}>
                  <StopCircle className="mr-2" size={18} /> End
                </Button>
                <Button variant="secondary" size="lg" className="w-40 bg-white text-slate-700 border-slate-300 hover:bg-slate-100" onClick={completeSet}>
                  <RefreshCcw className="mr-2" size={18} /> Complete Set
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Telemetry Sidebar */}
        <div className="space-y-6 overflow-y-auto custom-scrollbar pb-6">
          <Card className={isActive ? "border-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.15)] transition-all" : "shadow-sm border-slate-200"}>
            <CardContent className="p-6">
              <h3 className="text-slate-500 font-bold mb-1 text-xs uppercase tracking-wider">Current Reps</h3>
              <div className="text-7xl font-extrabold text-slate-900 mb-2 font-mono tracking-tighter">
                {reps}<span className="text-3xl text-slate-400 font-sans tracking-normal">/12</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden border border-slate-200">
                <div className="bg-teal-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(reps/12)*100}%` }}></div>
              </div>
              
              <div className="flex justify-between items-center py-3 border-t border-slate-100 mt-4">
                <span className="text-slate-500 font-semibold text-sm">Sets Completed</span>
                <span className="text-xl font-bold text-slate-900">{sets}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6 flex flex-col items-center justify-center py-8">
              <h3 className="text-slate-500 font-bold mb-4 text-xs uppercase tracking-wider">Form Score</h3>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                  <circle 
                    cx="50" cy="50" r="45" fill="none" 
                    stroke={score > 80 ? "#14b8a6" : score > 60 ? "#f59e0b" : "#dc2626"} 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - score / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{score}</span>
                  <span className="text-xs text-slate-500 font-bold uppercase">/ 100</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
};
