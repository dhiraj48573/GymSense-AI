import pytest
import numpy as np
from pose_estimation import calculate_angle

def test_calculate_angle_90_degrees():
    a = [0, 1]
    b = [0, 0]
    c = [1, 0]
    angle = calculate_angle(a, b, c)
    assert np.isclose(angle, 90.0), f"Expected 90, got {angle}"

def test_calculate_angle_180_degrees():
    a = [-1, 0]
    b = [0, 0]
    c = [1, 0]
    angle = calculate_angle(a, b, c)
    assert np.isclose(angle, 180.0), f"Expected 180, got {angle}"

def test_calculate_angle_0_degrees():
    a = [1, 0]
    b = [0, 0]
    c = [2, 0]
    angle = calculate_angle(a, b, c)
    assert np.isclose(angle, 0.0), f"Expected 0, got {angle}"
    
def test_calculate_angle_reflex():
    # If the interior angle is 90 but drawn the other way, it should still return the acute/obtuse <= 180
    a = [0, 1]
    b = [0, 0]
    c = [-1, 0]
    angle = calculate_angle(a, b, c)
    assert np.isclose(angle, 90.0), f"Expected 90, got {angle}"
