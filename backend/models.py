from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# Question model
class Question(BaseModel):
    question: str = Field(..., description="The question text")
    options: List[str] = Field(..., min_items=4, max_items=4, description="Four answer options")
    correct_answer: str = Field(..., description="The correct answer from the options")
    explanation: str = Field(..., description="Explanation of why this answer is correct")


# Quiz output model (what the LLM should return)
class QuizOutput(BaseModel):
    title: str = Field(..., description="Title of the quiz based on the article")
    summary: str = Field(..., description="Brief summary of the article")
    questions: List[Question] = Field(..., min_items=5, max_items=10, description="List of quiz questions")
    key_entities: List[str] = Field(..., description="Key entities, people, places, or concepts from the article")
    related_topics: List[str] = Field(..., description="Related topics or concepts")


# Request model for generating quiz
class QuizGenerateRequest(BaseModel):
    url: str = Field(..., description="Wikipedia URL to generate quiz from")


# Response model for quiz history
class QuizHistoryItem(BaseModel):
    id: int
    url: str
    title: str
    date_generated: datetime

    class Config:
        from_attributes = True


# Response model for full quiz
class QuizResponse(BaseModel):
    id: int
    url: str
    title: str
    date_generated: datetime
    quiz_data: QuizOutput

    class Config:
        from_attributes = True



