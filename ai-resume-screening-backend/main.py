import os
import json
import io
import google.generativeai as genai
import PyPDF2

from docx import Document
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Gemini Model
model = genai.GenerativeModel("gemini-3.5-flash")

# FastAPI App
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Model
class ResumeRequest(BaseModel):
    resume: str
    job_description: str


@app.get("/")
def home():
    return {"message": "AI Resume Screening Backend Running"}


@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):

    text = ""

    if file.filename.endswith(".pdf"):
        pdf = PyPDF2.PdfReader(io.BytesIO(await file.read()))

        for page in pdf.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted + "\n"

    elif file.filename.endswith(".docx"):
        document = Document(io.BytesIO(await file.read()))

        for paragraph in document.paragraphs:
            text += paragraph.text + "\n"

    else:
        return {
            "error": "Only PDF and DOCX files are supported."
        }

    return {
        "resume_text": text
    }


@app.post("/analyze")
def analyze_resume(data: ResumeRequest):

    prompt = f"""
You are an AI Resume Screening Assistant.

Compare the following resume with the job description.

Resume:
{data.resume}

Job Description:
{data.job_description}

Return ONLY valid JSON in this format:

{{
    "resume_match_score":"90%",
    "candidate_strengths":[
        "Python",
        "React",
        "SQL"
    ],
    "missing_skills":[
        "Docker",
        "AWS"
    ],
    "interview_questions":[
        "Explain Python decorators.",
        "What is FastAPI?",
        "Explain React Hooks.",
        "What are SQL Joins?",
        "Tell me about one challenging project."
    ],
    "hiring_recommendation":"Recommended",
    "role_recommendation":"Python Full Stack Developer",
    "training_recommendation":"Learn Docker and AWS."
}}
"""

    try:
        response = model.generate_content(prompt)

        text = response.text.strip()
        print("Gemini Response:")
        print(text)

        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "").strip()

        result = json.loads(text)

        return result

    except Exception as e:
        return {
            "error": str(e)
        }