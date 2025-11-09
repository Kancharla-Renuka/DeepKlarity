# Backend Setup Guide

## Quick Start

1. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

2. **Activate the virtual environment:**
   ```bash
   # Windows
   venv\Scripts\activate

   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file:**
   Create a file named `.env` in the `backend` directory with the following content:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   
   Get your API key from: https://makersuite.google.com/app/apikey

5. **Run the server:**
   ```bash
   python main.py
   ```
   
   Or using uvicorn:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

The API will be available at `http://localhost:8000`

## Database Setup

By default, the application uses SQLite. The database file `quiz_history.db` will be created automatically in the `backend` directory when you first run the application.

### Using PostgreSQL (Optional)

1. Install PostgreSQL and create a database
2. Install psycopg2:
   ```bash
   pip install psycopg2-binary
   ```
3. Update the `DATABASE_URL` in your `.env` file:
   ```
   DATABASE_URL=postgresql://user:password@localhost/dbname
   ```

## Testing the API

You can test the API endpoints using:

1. **Browser**: Visit `http://localhost:8000/docs` for interactive API documentation
2. **curl**:
   ```bash
   curl -X POST "http://localhost:8000/generate_quiz" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://en.wikipedia.org/wiki/Artificial_intelligence"}'
   ```

## Troubleshooting

- **Import errors**: Make sure you've activated the virtual environment
- **API key errors**: Verify your `GEMINI_API_KEY` is set correctly in the `.env` file
- **Database errors**: Ensure you have write permissions in the backend directory (for SQLite)



