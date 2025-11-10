# backend/app/schemas.py
from pydantic import BaseModel
from typing import Optional

class UploadResponse(BaseModel):
    id: str
    filename: str
    status: str

class SimpleMsg(BaseModel):
    message: str

class ExportRequest(BaseModel):
    record_id: str
