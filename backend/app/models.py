from typing import List, Dict, Optional
from pydantic import BaseModel, Field
from uuid import uuid4
from datetime import datetime

def gen_id():
    return str(uuid4())

class QuizItem(BaseModel):
    id: str = Field(default_factory=gen_id)
    question: str
    options: List[str]
    correct_option: int
    explanation: str
    source_page: Optional[int] = None
    topic_tags: List[str] = []

class Flashcard(BaseModel):
    id: str = Field(default_factory=gen_id)
    front: str
    back: str
    source_page: Optional[int] = None
    topic_tags: List[str] = []

class UploadRecord(BaseModel):
    id: str = Field(default_factory=gen_id)
    filename: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    status: str = "uploaded"
    error: Optional[str] = None
    quizzes: List[QuizItem] = []
    flashcards: List[Flashcard] = []
    analytics: Dict[str, int] = Field(default_factory=lambda: {"views": 0, "quiz_attempts": 0})
