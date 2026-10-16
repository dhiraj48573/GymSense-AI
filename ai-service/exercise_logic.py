import numpy as np
from typing import List, Dict, Tuple, Optional
import time

def calculate_angle(a: Dict[str, float], b: Dict[str, float], c: Dict[str, float]) -> float:
    """Calculate the angle between three points (a, b, c) with b as vertex."""
    radians = np.arctan2(c['y'] - b['y'], c['x'] - b['x']) - np.arctan2(a['y'] - b['y'], a['x'] - b['x'])
    angle = np.abs(radians * 180.0 / np.pi)
    if angle > 180.0:
        angle = 360.0 - angle
    return angle

def get_landmark(landmarks: List[Dict], idx: int) -> Optional[Dict]:
    for lm in landmarks:
        if lm['id'] == idx:
            return lm
    return None

class ExerciseTracker:
    def __init__(self, exercise_type: str = "Squat"):
        self.exercise_type = exercise_type
        
        # State: "START", "LOWERING", "BOTTOM", "RETURNING"
        self.state = "START"
        self.reps = 0
        self.sets = 0
        
        # Form tracking variables for the current rep
        self.current_rep_issues = []
        self.last_score = 100
        self.current_cue = "Ready to start!"
        
        # Jitter prevention
        self.last_transition_time = time.time()
        self.cooldown_sec = 0.3
        
        # Thresholds
        self.thresholds = {
            "Squat": {"start": 160, "bottom": 100, "too_shallow": 110},
            "Push-up": {"start": 150, "bottom": 90, "too_shallow": 100, "body_straightness_min": 150},
            "Bicep Curl": {"start": 150, "bottom": 60, "too_shallow": 75}
        }
    
    def set_exercise(self, exercise_type: str):
        if self.exercise_type != exercise_type:
            self.exercise_type = exercise_type
            self.reset_session()
            
    def reset_session(self):
        self.state = "START"
        self.reps = 0
        self.sets = 0
        self.last_score = 100
        self.current_cue = "Ready to start!"
        self.current_rep_issues = []
        
    def complete_set(self):
        self.sets += 1
        self.reps = 0
        self.current_cue = "Set complete! Take a rest."
        self.state = "START"

    def process_frame(self, landmarks: List[Dict]) -> Tuple[int, int, int, str]:
        """
        Process a frame and return (reps, sets, form_score, cue).
        Uses simple visibility checks (visibility > 0.5) before processing.
        """
        if not landmarks:
            return self.reps, self.sets, self.last_score, "No person detected"
            
        t = self.thresholds.get(self.exercise_type)
        if not t:
            return self.reps, self.sets, self.last_score, f"Unsupported: {self.exercise_type}"
            
        if self.exercise_type == "Squat":
            self._process_squat(landmarks, t)
        elif self.exercise_type == "Push-up":
            self._process_pushup(landmarks, t)
        elif self.exercise_type == "Bicep Curl":
            self._process_bicep_curl(landmarks, t)
            
        return self.reps, self.sets, self.last_score, self.current_cue

    def _update_state(self, new_state: str, cue: str = ""):
        now = time.time()
        if now - self.last_transition_time > self.cooldown_sec or new_state == "START":
            self.state = new_state
            self.last_transition_time = now
            if cue:
                self.current_cue = cue

    def _process_squat(self, landmarks: List[Dict], t: Dict):
        hip = get_landmark(landmarks, 23) or get_landmark(landmarks, 24) # Left or Right Hip
        knee = get_landmark(landmarks, 25) or get_landmark(landmarks, 26) # Left or Right Knee
        ankle = get_landmark(landmarks, 27) or get_landmark(landmarks, 28) # Left or Right Ankle
        
        if not (hip and knee and ankle) or hip['visibility'] < 0.5 or knee['visibility'] < 0.5:
            self.current_cue = "Ensure legs are fully visible"
            return
            
        angle = calculate_angle(hip, knee, ankle)
        
        if self.state == "START":
            if angle < t["start"] - 15:
                self._update_state("LOWERING", "Lowering...")
                self.current_rep_issues = []
                
        elif self.state == "LOWERING":
            if angle <= t["bottom"]:
                self._update_state("BOTTOM", "Good depth! Push up.")
            elif angle > t["start"] - 10:
                # Aborted rep
                self._update_state("START", "Rep aborted.")
                self.last_score = max(0, self.last_score - 20)
                
        elif self.state == "BOTTOM":
            if angle > t["bottom"] + 15:
                self._update_state("RETURNING", "Pushing up...")
                
        elif self.state == "RETURNING":
            if angle >= t["start"] - 10:
                self.reps += 1
                self._update_state("START", "Great rep!")
                self.last_score = min(100, self.last_score + 5)
            elif angle <= t["bottom"]:
                 self._update_state("BOTTOM")

    def _process_pushup(self, landmarks: List[Dict], t: Dict):
        shoulder = get_landmark(landmarks, 11) or get_landmark(landmarks, 12)
        elbow = get_landmark(landmarks, 13) or get_landmark(landmarks, 14)
        wrist = get_landmark(landmarks, 15) or get_landmark(landmarks, 16)
        hip = get_landmark(landmarks, 23) or get_landmark(landmarks, 24)
        ankle = get_landmark(landmarks, 27) or get_landmark(landmarks, 28)
        
        if not (shoulder and elbow and wrist and hip and ankle) or elbow['visibility'] < 0.5:
            self.current_cue = "Ensure upper body is visible"
            return
            
        elbow_angle = calculate_angle(shoulder, elbow, wrist)
        body_angle = calculate_angle(shoulder, hip, ankle)
        
        if body_angle < t["body_straightness_min"]:
            self.current_cue = "Keep your core tight and body straight!"
            if self.state in ["LOWERING", "BOTTOM", "RETURNING"]:
                self.current_rep_issues.append("sagging_core")
                
        if self.state == "START":
            if elbow_angle < t["start"] - 15:
                self._update_state("LOWERING", "Lowering...")
                self.current_rep_issues = []
        elif self.state == "LOWERING":
            if elbow_angle <= t["bottom"]:
                self._update_state("BOTTOM", "Good depth! Push up.")
            elif elbow_angle > t["start"] - 10:
                self._update_state("START", "Rep aborted.")
                self.last_score = max(0, self.last_score - 20)
        elif self.state == "BOTTOM":
            if elbow_angle > t["bottom"] + 15:
                self._update_state("RETURNING", "Pushing up...")
        elif self.state == "RETURNING":
            if elbow_angle >= t["start"] - 10:
                self.reps += 1
                score_deduction = len(set(self.current_rep_issues)) * 15
                self.last_score = max(0, min(100, (100 if score_deduction == 0 else self.last_score - score_deduction)))
                self._update_state("START", "Great rep!" if score_deduction == 0 else "Rep complete, watch core.")
            elif elbow_angle <= t["bottom"]:
                self._update_state("BOTTOM")

    def _process_bicep_curl(self, landmarks: List[Dict], t: Dict):
        shoulder = get_landmark(landmarks, 11) or get_landmark(landmarks, 12)
        elbow = get_landmark(landmarks, 13) or get_landmark(landmarks, 14)
        wrist = get_landmark(landmarks, 15) or get_landmark(landmarks, 16)
        
        if not (shoulder and elbow and wrist) or elbow['visibility'] < 0.5:
            self.current_cue = "Ensure arm is visible"
            return
            
        angle = calculate_angle(shoulder, elbow, wrist)
        
        if self.state == "START":
            if angle < t["start"] - 15:
                self._update_state("LOWERING", "Curling up...")
                self.current_rep_issues = []
        elif self.state == "LOWERING":
            if angle <= t["bottom"]:
                self._update_state("BOTTOM", "Squeeze at top!")
            elif angle > t["start"] - 10:
                self._update_state("START", "Rep aborted.")
                self.last_score = max(0, self.last_score - 10)
        elif self.state == "BOTTOM":
            if angle > t["bottom"] + 15:
                self._update_state("RETURNING", "Lowering...")
        elif self.state == "RETURNING":
            if angle >= t["start"] - 10:
                self.reps += 1
                self._update_state("START", "Good curl!")
                self.last_score = min(100, self.last_score + 5)
            elif angle <= t["bottom"]:
                self._update_state("BOTTOM")
