# backend/app/openai_client.py
import os
import openai
import time
from typing import List, Dict

OPENAI_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_KEY:
    raise RuntimeError("OPENAI_API_KEY environment variable not set")
openai.api_key = OPENAI_KEY

# You can change the model name if you prefer
MODEL_NAME = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")  # fallback

def generate_quiz_and_flashcards(chunks: List[Dict], metadata: Dict) -> Dict:
    """
    chunks: list of {'page': int, 'text': str}
    metadata: {'title': str, 'filename': str}
    Returns: {'quizzes': [...], 'flashcards': [...]}
    """
    system = (
        "You are an expert academic study assistant. Given chunks of cleaned academic text parsed"
        " from a PDF (including indicated page numbers) produce a set of high-quality flashcards and"
        " multiple-choice quiz items covering important topics. Follow the schema exactly."
    )

    # Build content prompt carefully to avoid huge token usage: include only short chunks or first n.
    # We'll combine chunk summaries to reduce tokens.
    text_for_prompt = ""
    for c in chunks:
        text_for_prompt += f"[page {c.get('page','?')}]\n{c.get('text','')}\n\n"

    prompt = f"""
Metadata: {metadata}

Text chunks:
{text_for_prompt}

TASKS:
1) Identify up to 8 main topics from the material. For each topic produce 3 flashcards (front/back).
2) For each topic produce 3 multiple-choice questions (4 options each), indicate correct option index (0-3), and a short explanation why the correct answer is right.
3) Keep flashcards concise (front <= 120 chars, back <= 400 chars).
4) Output JSON with two keys: "flashcards" (list) and "quizzes" (list). Each quiz item must be:
{{"question": "...", "options": ["..","..","..",".."], "correct_option": 1, "explanation": "...", "source_page": <int or null>, "topic_tags": ["topic1","topic2"]}}
Make sure every quiz item has exactly 4 options.
If something is not present, you may mark source_page as null.
Return ONLY valid JSON.
    """

    # Call OpenAI with retries and backoff
    for attempt in range(3):
        try:
            resp = openai.ChatCompletion.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.0,
                max_tokens=2500
            )
            out = resp["choices"][0]["message"]["content"]
            # Try to parse JSON from output
            import json, re
            m = re.search(r"(\{.*\})", out, re.S)
            if m:
                obj = json.loads(m.group(1))
                return obj
            else:
                # As fallback, try to parse whole as JSON
                return json.loads(out)
        except Exception as e:
            last_err = e
            time.sleep(1 + attempt*2)
    raise last_err
