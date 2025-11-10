# backend/app/main.py
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from .models import UploadRecord, QuizItem, Flashcard
from .storage import save_record, get_record, list_records, update_record
from .pdf_processor import extract_text_and_images, chunks_from_pages
from .openai_client import generate_quiz_and_flashcards
from typing import List
import io, csv, json

app = FastAPI(title="StudyAid MVP Backend")

# Allow CORS from Vercel frontend
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "*")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN] if FRONTEND_ORIGIN != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload", status_code=201)
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")
    content = await file.read()
    record = UploadRecord(filename=file.filename)
    record = save_record(record)
    # spawn processing (we'll run synchronously here for simplicity)
    try:
        update_record(record.id, status="processing")
        pages = extract_text_and_images(content, max_pages=40)  # allow up to 40 pages for academic document
        chunks = chunks_from_pages(pages, max_chars=1800)
        meta = {"filename": file.filename, "title": file.filename}
        ai_out = generate_quiz_and_flashcards(chunks, meta)
        quizzes = []
        flashcards = []
        # build models & store
        for q in ai_out.get("quizzes", []):
            try:
                qi = QuizItem(
                    question=q["question"],
                    options=q["options"],
                    correct_option=int(q["correct_option"]),
                    explanation=q.get("explanation",""),
                    source_page=q.get("source_page", None),
                    topic_tags=q.get("topic_tags", [])
                )
                quizzes.append(qi)
            except Exception:
                continue
        for f in ai_out.get("flashcards", []):
            try:
                fc = Flashcard(
                    front=f["front"],
                    back=f["back"],
                    source_page=f.get("source_page", None),
                    topic_tags=f.get("topic_tags", [])
                )
                flashcards.append(fc)
            except Exception:
                continue
        update_record(record.id, status="done", quizzes=quizzes, flashcards=flashcards)
        return {"id": record.id, "filename": record.filename, "status": "done"}
    except Exception as e:
        update_record(record.id, status="error", error=str(e))
        raise HTTPException(status_code=500, detail="Processing failed: " + str(e))

@app.get("/records")
def get_records():
    recs = list_records()
    return {"records": [r.dict() for r in recs]}

@app.get("/record/{record_id}")
def get_record_endpoint(record_id: str):
    r = get_record(record_id)
    if not r:
        raise HTTPException(status_code=404, detail="Record not found")
    # increment view analytics
    r.analytics["views"] = r.analytics.get("views",0) + 1
    return r

@app.post("/record/{record_id}/export_csv")
def export_quiz_csv(record_id: str):
    r = get_record(record_id)
    if not r:
        raise HTTPException(status_code=404, detail="Record not found")
    # Stream CSV of quizzes
    def iter_csv():
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(["id","question","option_0","option_1","option_2","option_3","correct_option","explanation","source_page","topic_tags"])
        yield buffer.getvalue()
        buffer.seek(0)
        buffer.truncate(0)
        for q in r.quizzes:
            writer.writerow([q.id, q.question, *q.options, q.correct_option, q.explanation, q.source_page or "", ",".join(q.topic_tags)])
            yield buffer.getvalue()
            buffer.seek(0)
            buffer.truncate(0)
    headers = {
        "Content-Disposition": f"attachment; filename=quizzes_{record_id}.csv"
    }
    return StreamingResponse(iter_csv(), media_type="text/csv", headers=headers)

@app.post("/record/{record_id}/quiz/{quiz_id}/edit")
def edit_quiz(record_id: str, quiz_id: str, payload: dict):
    r = get_record(record_id)
    if not r:
        raise HTTPException(status_code=404, detail="Record not found")
    found = False
    for i,q in enumerate(r.quizzes):
        if q.id == quiz_id:
            found = True
            # allow editing question, options, correct_option, explanation, topic_tags
            for k in ["question","options","correct_option","explanation","topic_tags","source_page"]:
                if k in payload:
                    setattr(q, k, payload[k])
            r.quizzes[i] = q
            break
    if not found:
        raise HTTPException(status_code=404, detail="Quiz item not found")
    return {"message":"updated","quiz": q.dict()}

@app.post("/record/{record_id}/analytics")
def update_analytics(record_id: str, payload: dict):
    r = get_record(record_id)
    if not r:
        raise HTTPException(status_code=404, detail="Record not found")
    # Accept increments: {"quiz_attempts": 1}
    for k,v in payload.items():
        r.analytics[k] = r.analytics.get(k,0) + int(v)
    return {"analytics": r.analytics}
