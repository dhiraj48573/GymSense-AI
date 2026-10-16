import cv2
from pose_estimation import process_frame

def main():
    print("Starting local webcam test...")
    print("Press 'q' to quit.")
    
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Could not read frame.")
            break
            
        # Process frame with annotation enabled
        landmarks, angles, annotated_b64 = process_frame(frame, annotate=True)
        
        if annotated_b64:
            # We already have the annotated frame internally inside process_frame before base64 encoding.
            # But since process_frame is optimized for web, we'll just re-run Mediapipe drawing locally for demo,
            # or we can modify the demo to use the raw MediaPipe.
            # For simplicity, we just run MediaPipe on the frame directly here or decode the b64.
            import base64
            import numpy as np
            
            img_data = base64.b64decode(annotated_b64)
            np_arr = np.frombuffer(img_data, np.uint8)
            annotated_frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            # Print a few angles to console to verify calculation
            if 'left_knee' in angles:
                cv2.putText(annotated_frame, f"L Knee: {int(angles['left_knee'])}", (10, 30), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
            if 'right_knee' in angles:
                cv2.putText(annotated_frame, f"R Knee: {int(angles['right_knee'])}", (10, 70), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                            
            cv2.imshow('GymSense Pose Estimation Test', annotated_frame)
        else:
            cv2.imshow('GymSense Pose Estimation Test', frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
            
    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
