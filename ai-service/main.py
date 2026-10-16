from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn
from typing import List, Dict, Optional, Any
import json
import logging

from pose_estimation import process_frame, decode_base64_image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="GymSense AI Service", description="Computer Vision API for Pose Detection")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FrameRequest(BaseModel):
    image_b64: str = Field(..., description="Base64 encoded image string (JPEG or PNG)")
    annotate: bool = Field(default=False, description="Whether to return an annotated frame")

class Landmark(BaseModel):
    id: int
    x: float
    y: float
    z: float
    visibility: float

class PoseResponse(BaseModel):
    landmarks: List[Landmark]
    angles: Dict[str, float]
    annotated_image: Optional[str] = None
    person_detected: bool
    error: Optional[str] = None

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "GymSense AI Service is running"}

@app.post("/analyze", response_model=PoseResponse)
def analyze_frame(request: FrameRequest):
    """
    Analyze a single base64 encoded frame.
    """
    try:
        if not request.image_b64:
            raise ValueError("Empty image string")
            
        frame = decode_base64_image(request.image_b64)
        if frame is None:
            raise ValueError("Failed to decode image")
            
        landmarks_dict, angles, annotated_b64 = process_frame(frame, annotate=request.annotate)
        
        person_detected = len(landmarks_dict) > 0
        
        return PoseResponse(
            landmarks=landmarks_dict,
            angles=angles,
            annotated_image=annotated_b64,
            person_detected=person_detected
        )
    except Exception as e:
        logger.error(f"Error processing frame: {e}")
        return PoseResponse(
            landmarks=[],
            angles={},
            person_detected=False,
            error=str(e)
        )

from exercise_logic import ExerciseTracker

@app.websocket("/ws/analyze")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time video frame processing.
    Expects JSON messages containing {"image_b64": "...", "annotate": bool, "exercise": "Squat"}
    """
    await websocket.accept()
    logger.info("WebSocket connection established")
    
    tracker = ExerciseTracker()
    
    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                image_b64 = payload.get("image_b64")
                annotate = payload.get("annotate", False)
                exercise = payload.get("exercise", "Squat")
                
                tracker.set_exercise(exercise)
                
                if payload.get("action") == "complete_set":
                    tracker.complete_set()
                    await websocket.send_json({
                        "person_detected": True,
                        "reps": tracker.reps,
                        "sets": tracker.sets,
                        "form_score": tracker.last_score,
                        "cue": tracker.current_cue
                    })
                    continue
                
                if not image_b64:
                    await websocket.send_json({"error": "No image data provided"})
                    continue
                    
                frame = decode_base64_image(image_b64)
                if frame is None:
                    await websocket.send_json({"error": "Failed to decode image"})
                    continue
                    
                landmarks_dict, angles, annotated_b64 = process_frame(frame, annotate)
                
                reps, sets, score, cue = tracker.process_frame(landmarks_dict)
                
                response = {
                    "person_detected": len(landmarks_dict) > 0,
                    "landmarks": landmarks_dict,
                    "angles": angles,
                    "reps": reps,
                    "sets": sets,
                    "form_score": score,
                    "cue": cue
                }
                if annotate:
                    response["annotated_image"] = annotated_b64
                    
                await websocket.send_json(response)
                
            except json.JSONDecodeError:
                await websocket.send_json({"error": "Invalid JSON format"})
            except Exception as e:
                logger.error(f"WebSocket frame processing error: {e}")
                await websocket.send_json({"error": str(e)})
                
    except WebSocketDisconnect:
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket unexpected error: {e}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
