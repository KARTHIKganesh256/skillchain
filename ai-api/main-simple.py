from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="SkillChain AI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "SkillChain AI API is running!", "status": "healthy"}

@app.get("/health")
async def health():
    return {"status": "healthy", "message": "AI API is working"}

@app.get("/api/skills/calculate")
async def calculate_skill_value(skill: str, level: int = 5):
    """Calculate skill value using AI"""
    # Simple calculation for demo
    base_value = 50000
    multiplier = level * 0.2
    value = int(base_value * (1 + multiplier))
    
    return {
        "skill": skill,
        "level": level,
        "estimated_value": value,
        "confidence": 0.85
    }

@app.post("/api/learning/assist")
async def learning_assistance(question: str):
    """AI Learning Assistant"""
    return {
        "question": question,
        "answer": f"Here's a helpful response to your question about '{question}'. This is a demo response from the AI assistant.",
        "confidence": 0.9
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)

