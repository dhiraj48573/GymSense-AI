import pytest
import time
from exercise_logic import ExerciseTracker, calculate_angle

def create_mock_landmark(idx, x, y, visibility=1.0):
    return {"id": idx, "x": x, "y": y, "z": 0.0, "visibility": visibility}

def test_squat_full_rep():
    tracker = ExerciseTracker(exercise_type="Squat")
    tracker.cooldown_sec = -1.0 # Disable cooldown for fast testing
    
    # Hip: 23, Knee: 25, Ankle: 27
    
    # Frame 1: Standing (Angle ~ 170)
    # Hip at (0, 0), Knee at (0, 1), Ankle at (0, 2) -> Angle is 180
    f1 = [create_mock_landmark(23, 0, 0), create_mock_landmark(25, 0, 1), create_mock_landmark(27, 0, 2)]
    reps, _, score, cue = tracker.process_frame(f1)
    assert reps == 0
    assert tracker.state == "START"
    
    # Frame 2: Lowering (Angle < 145)
    # Hip at (0, 1), Knee at (1, 1), Ankle at (0, 2) -> Angle is 45-ish? Let's just create points that make specific angles.
    # We can fake it since we know how the angle is calculated.
    # Angle 130
    f2 = [create_mock_landmark(23, 1, 0), create_mock_landmark(25, 0, 1), create_mock_landmark(27, 0, 2)] # This forms 135 deg
    tracker.process_frame(f2)
    assert tracker.state == "LOWERING"
    
    # Frame 3: Bottom (Angle <= 100)
    # Angle 90
    f3 = [create_mock_landmark(23, 1, 1), create_mock_landmark(25, 0, 1), create_mock_landmark(27, 0, 2)]
    tracker.process_frame(f3)
    assert tracker.state == "BOTTOM"
    
    # Frame 4: Returning (Angle > 115)
    tracker.process_frame(f2)
    assert tracker.state == "RETURNING"
    
    # Frame 5: Standing (Angle >= 150)
    tracker.process_frame(f1)
    assert tracker.reps == 1
    assert tracker.state == "START"
    assert tracker.last_score == 100 # Good form
    
def test_squat_incomplete_rep():
    tracker = ExerciseTracker(exercise_type="Squat")
    tracker.cooldown_sec = -1.0
    
    f_start = [create_mock_landmark(23, 0, 0), create_mock_landmark(25, 0, 1), create_mock_landmark(27, 0, 2)]
    f_lowering = [create_mock_landmark(23, 1, 0), create_mock_landmark(25, 0, 1), create_mock_landmark(27, 0, 2)]
    
    tracker.process_frame(f_start)
    tracker.process_frame(f_lowering)
    assert tracker.state == "LOWERING"
    
    # Goes back up without hitting bottom
    tracker.process_frame(f_start)
    assert tracker.reps == 0
    assert tracker.state == "START" # Should abort and reset
    assert tracker.last_score < 100 # Score should deduct due to aborted rep

def test_missing_landmarks():
    tracker = ExerciseTracker(exercise_type="Squat")
    f_missing = [create_mock_landmark(23, 0, 0)] # Missing knee and ankle
    _, _, _, cue = tracker.process_frame(f_missing)
    assert cue == "Ensure legs are fully visible"
    
def test_low_visibility():
    tracker = ExerciseTracker(exercise_type="Squat")
    f_low_vis = [
        create_mock_landmark(23, 0, 0, visibility=0.1), 
        create_mock_landmark(25, 0, 1, visibility=0.9), 
        create_mock_landmark(27, 0, 2, visibility=0.9)
    ]
    _, _, _, cue = tracker.process_frame(f_low_vis)
    assert cue == "Ensure legs are fully visible"

def test_set_transition():
    tracker = ExerciseTracker(exercise_type="Squat")
    tracker.reps = 10
    tracker.complete_set()
    assert tracker.reps == 0
    assert tracker.sets == 1
    assert tracker.state == "START"
