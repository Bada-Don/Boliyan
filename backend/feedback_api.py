# feedback_api.py
import sqlite3
from flask import Flask, request, jsonify
from flask_cors import CORS # Import CORS
import os

# --- SETUP (Same as before) ---
# Make sure you've run the setup_database.py script once to create feedback.db
# setup_database.py:
# import sqlite3
# conn = sqlite3.connect('feedback.db')
# cursor = conn.cursor()
# cursor.execute("""
# CREATE TABLE IF NOT EXISTS feedback (
#     id INTEGER PRIMARY KEY AUTOINCREMENT,
#     key TEXT NOT NULL,
#     value TEXT NOT NULL,
#     received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# );
# """)
# conn.commit()
# conn.close()
# --------------------------------

app = Flask(__name__)
# This is crucial: enable CORS to allow requests from your React app
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000") 
CORS(app, origins=[FRONTEND_URL], supports_credentials=True)

DATABASE_PATH = os.environ.get("DATABASE_PATH", "feedback.db")

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/api/feedback', methods=['POST'])
def receive_feedback():
    try:
        data = request.get_json()
        key = data.get('key')
        value = data.get('value')

        if not key or not value:
            return jsonify({"error": "Missing 'key' or 'value' in payload"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO feedback (key, value) VALUES (?, ?)", (key, value))
        conn.commit()
        conn.close()
        
        print(f"Received feedback: key='{key}', value='{value}'")
        return jsonify({"message": "Feedback received successfully!"}), 201

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": "An internal server error occurred."}), 500

# Run this API on a different port, e.g., 5001
app.run(host='0.0.0.0', port=5001) 