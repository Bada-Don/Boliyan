# Feedback API Backend

A Flask-based REST API for collecting and storing feedback data.

## Features

- RESTful API endpoints
- SQLite database storage
- CORS enabled for cross-origin requests
- Health check endpoint
- Production-ready with Gunicorn

## API Endpoints

### GET /
Root endpoint that returns API information.

**Response:**
```json
{
  "message": "Feedback API is running",
  "endpoints": {
    "health": "/api/health",
    "feedback": "/api/feedback"
  }
}
```

### GET /api/health
Health check endpoint for deployment platforms.

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "feedback_count": 5
}
```

### POST /api/feedback
Submit feedback data.

**Request Body:**
```json
{
  "key": "user_rating",
  "value": "5"
}
```

**Response:**
```json
{
  "message": "Feedback received successfully!"
}
```

## Environment Variables

- `PORT`: Server port (default: 5001)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)
- `DATABASE_PATH`: Database file path (default: feedback.db)

## Local Development

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the application:
   ```bash
   python feedback_api.py
   ```

3. The API will be available at `http://localhost:5001`

## Railway Deployment

This application is configured for Railway deployment with the following files:

- `railway.json`: Railway-specific configuration
- `Procfile`: Process definition for Railway
- `runtime.txt`: Python version specification

### Deployment Steps:

1. Push your code to GitHub
2. Connect your repository to Railway
3. Railway will automatically detect the Python application
4. Set environment variables in Railway dashboard if needed
5. Deploy!

## Database

The application uses SQLite for data storage. The database is automatically initialized when the application starts.

**Note:** For production use, consider migrating to a cloud database like PostgreSQL, as SQLite files may be lost during deployments on some platforms. 