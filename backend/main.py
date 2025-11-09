from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import json
from datetime import datetime
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

from database import init_db, get_db, Quiz
from models import QuizGenerateRequest, QuizHistoryItem, QuizResponse, QuizOutput
from scraper import scrape_wikipedia
from llm_quiz_generator import generate_quiz

# Initialize FastAPI app
app = FastAPI(
    title="AI Wiki Quiz Generator",
    description="Generate quizzes from Wikipedia articles using AI",
    version="1.0.0"
)

# CORS middleware to allow React frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],  # Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()


@app.get("/")
def read_root():
    return {"message": "AI Wiki Quiz Generator API", "version": "1.0.0"}


@app.post("/generate_quiz", response_model=QuizOutput)
def generate_quiz_endpoint(request: QuizGenerateRequest, db: Session = Depends(get_db)):
    """
    Generate a quiz from a Wikipedia URL.
    """
    try:
        # Scrape Wikipedia article
        scraped_content, title = scrape_wikipedia(request.url)
        
        # Generate quiz using LLM
        quiz_output = generate_quiz(scraped_content)
        
        # Serialize quiz data to JSON string
        quiz_json = quiz_output.model_dump_json()
        
        # Save to database
        db_quiz = Quiz(
            url=request.url,
            title=title,
            scraped_content=scraped_content,
            full_quiz_data=quiz_json,
            date_generated=datetime.utcnow()
        )
        db.add(db_quiz)
        db.commit()
        db.refresh(db_quiz)
        
        return quiz_output
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/history", response_model=List[QuizHistoryItem])
def get_quiz_history(db: Session = Depends(get_db)):
    """
    Get list of all generated quizzes.
    """
    try:
        quizzes = db.query(Quiz).order_by(Quiz.date_generated.desc()).all()
        return [QuizHistoryItem(
            id=quiz.id,
            url=quiz.url,
            title=quiz.title,
            date_generated=quiz.date_generated
        ) for quiz in quizzes]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")


@app.get("/quiz/{quiz_id}", response_model=QuizOutput)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    """
    Get a specific quiz by ID.
    """
    try:
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        # Deserialize the JSON string back to QuizOutput
        quiz_data = json.loads(quiz.full_quiz_data)
        return QuizOutput(**quiz_data)
        
    except HTTPException:
        raise
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Error parsing quiz data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching quiz: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

