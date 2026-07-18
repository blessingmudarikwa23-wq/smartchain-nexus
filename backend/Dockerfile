# Use official Python image
FROM python:3.13-slim

# Prevent Python from writing .pyc files
ENV PYTHONDONTWRITEBYTECODE=1

# Ensure logs appear immediately
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (Docker layer caching)
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Start the application
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]