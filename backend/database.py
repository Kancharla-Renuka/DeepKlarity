from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Database URL - using SQLite for simplicity, but can be easily switched to PostgreSQL
# For PostgreSQL, change to: DATABASE_URL = "postgresql://user:password@localhost/dbname"
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./quiz_history.db")

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# Create declarative base
Base = declarative_base()

# Session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Quiz Model
class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    date_generated = Column(DateTime, default=datetime.utcnow, nullable=False)
    scraped_content = Column(Text, nullable=True)
    full_quiz_data = Column(Text, nullable=False)  # JSON string


# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)


# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



