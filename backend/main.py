import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Updated absolute imports to play nicely with your root PYTHONPATH setup
from backend.routes import auth, predict, dashboard, analytics

app = FastAPI(title="AutoValue AI API Server", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include only active service domains (History removed completely)
app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(dashboard.router)
app.include_router(analytics.router)

@app.get("/")
def health_check():
    return {"status": "online", "service": "AutoValue AI Platform Node"}

if __name__ == "__main__":
    # Pointed target app instance to its absolute folder path location
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)