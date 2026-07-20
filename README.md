# AI Resume Screening Assistant

## Setup Steps

### Backend
1. Navigate to the backend folder.
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file and add your Gemini API key:
   ```env
   GEMINI_API_KEY=YOUR_API_KEY
   ```
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend
1. Navigate to the frontend folder.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the React application:
   ```bash
   npm start
   ```

---

## Technologies Used

### Frontend
- React.js
- HTML
- CSS
- JavaScript
- Axios

### Backend
- FastAPI
- Python
- Uvicorn

### Resume Parsing
- PyPDF2
- python-docx

---

## AI Model / API Used

- Google Gemini API
- Gemini Pro Model (used for resume analysis, skill matching, interview question generation, hiring recommendation, role recommendation, and training recommendation)

---

## Assumptions Made

- The resume is uploaded in PDF or DOCX format, or the user can paste resume text.
- The user provides a valid job description.
- A valid Google Gemini API key is configured in the `.env` file.
- An internet connection is required for AI analysis.
