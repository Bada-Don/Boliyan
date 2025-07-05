# feedback_api.py
import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# CORS configuration - Railway will provide the frontend URL
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
CORS(app, origins=[FRONTEND_URL], supports_credentials=True)

# Database configuration
DATABASE_PATH = os.environ.get("DATABASE_PATH", "feedback.db")

def get_db_connection():
    """Create and return a database connection"""
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        raise

def init_db():
    """Initialize the database with required tables"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        create_table_query = """
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            key TEXT NOT NULL,
            value TEXT NOT NULL,
            received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """
        
        cursor.execute(create_table_query)
        conn.commit()
        conn.close()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization error: {e}")
        raise

@app.route('/api/feedback', methods=['POST'])
def receive_feedback():
    """Handle feedback submission"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400
            
        key = data.get('key')
        value = data.get('value')

        if not key or not value:
            return jsonify({"error": "Missing 'key' or 'value' in payload"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO feedback (key, value) VALUES (?, ?)", (key, value))
        conn.commit()
        conn.close()
        
        logger.info(f"Received feedback: key='{key}', value='{value}'")
        return jsonify({"message": "Feedback received successfully!"}), 201

    except Exception as e:
        logger.error(f"Error processing feedback: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint for Railway"""
    try:
        # Test database connection
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM feedback")
        count = cursor.fetchone()[0]
        conn.close()
        
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "feedback_count": count
        }), 200
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return jsonify({
            "status": "unhealthy",
            "error": str(e)
        }), 500

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        "message": "Feedback API is running",
        "endpoints": {
            "health": "/api/health",
            "feedback": "/api/feedback"
        }
    }), 200

# Initialize database on startup
if __name__ == '__main__':
    init_db()
    # Use Railway's PORT environment variable or default to 5001
    port = int(os.environ.get("PORT", 5001))
    app.run(host='0.0.0.0', port=port, debug=False) 