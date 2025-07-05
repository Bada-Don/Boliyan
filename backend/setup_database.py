# setup_database.py
import sqlite3

# Connect to the database (it will be created if it doesn't exist)
conn = sqlite3.connect('feedback.db')

# Create a cursor object to execute SQL commands
cursor = conn.cursor()

# SQL statement to create a table
# We add an ID as a primary key and a timestamp for when the feedback was received.
create_table_query = """
CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

# Execute the query
cursor.execute(create_table_query)

print("Database 'feedback.db' and table 'feedback' created successfully.")

# Commit the changes and close the connection
conn.commit()
conn.close()