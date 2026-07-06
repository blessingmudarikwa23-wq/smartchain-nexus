from fastapi import FastAPI

app = FastAPI(
    title="SmartChain Nexus API",
    description="AI-Powered Enterprise Supply Chain Management Platform",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to SmartChain Nexus API",
        "status": "Running",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {
        "status": "Healthy"
    }