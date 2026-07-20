import React, { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import jsPDF from "jspdf";

function App() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Upload Resume
  const uploadResume = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload_resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.resume_text) {
        setResume(data.resume_text);
      } else {
        alert(data.error || "Could not extract text from resume.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to upload resume.");
    }
  };

  // Analyze Resume
  const analyzeResume = async () => {
    if (!resume.trim()) {
      alert("Please upload or paste a resume.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter a Job Description.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resume,
          job_description: jobDescription,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Analysis failed.");
    }

    setLoading(false);
  };
   
const downloadReport = () => {

  if (!result) {
    alert("No analysis available!");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("AI Resume Screening Report", 20, 20);

  doc.setFontSize(12);

  doc.text(`Resume Match Score: ${result.resume_match_score}`, 20, 40);

  let y = 55;

  doc.text("Candidate Strengths:", 20, y);
  y += 10;

  result.candidate_strengths.forEach((item) => {
    doc.text(`• ${item}`, 25, y);
    y += 8;
  });

  y += 5;

  doc.text("Missing Skills:", 20, y);
  y += 10;

  result.missing_skills.forEach((item) => {
    doc.text(`• ${item}`, 25, y);
    y += 8;
  });

  y += 5;

  doc.text("Hiring Recommendation:", 20, y);
  y += 10;
  doc.text(result.hiring_recommendation, 25, y);

  y += 20;

  doc.text("Role Recommendation:", 20, y);
  y += 10;
  doc.text(result.role_recommendation, 25, y);

  y += 20;

  doc.text("Training Recommendation:", 20, y);
  y += 10;
  doc.text(result.training_recommendation, 25, y);

  doc.save("Resume_Analysis_Report.pdf");
   };
 return (
    <>
      <Navbar />

      <div className="App">

        <div className="hero">
          <h1>🤖 AI Resume Screening Assistant</h1>
          <p>
            Upload a resume or paste its contents, enter a Job Description,
            and let AI evaluate the candidate instantly.
          </p>
        </div>

        <div className="card">

          <h2>📄 Upload Resume</h2>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={uploadResume}
          />

          <h3>OR</h3>

          <textarea
            rows="10"
            placeholder="Paste Resume Text Here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />

          <h2>💼 Job Description</h2>

          <textarea
            rows="8"
            placeholder="Paste Job Description Here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <button
            className="analyze-btn"
            onClick={analyzeResume}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

        </div>

        {loading && (
          <div className="loading">
            <h2>⏳ AI is analyzing the resume...</h2>
          </div>
        )}

        {result && (
          <div className="results-container">
                      <div className="result-card">
            <h3>📊 Resume Match Score</h3>
            <p
            className={`score ${
            parseInt(result.resume_match_score) >= 80
            ? "score-high"
            : parseInt(result.resume_match_score) >= 50
            ? "score-medium"
            : "score-low"
        }`}
          >
          {result.resume_match_score}
          </p>
          </div>

          <div className="result-card">
            <h3>✅ Candidate Strengths</h3>

            <ul>
              {result.candidate_strengths?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="result-card">
            <h3>❌ Missing Skills</h3>

            <ul>
              {result.missing_skills?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="result-card">
            <h3>🎤 Interview Questions</h3>

            <ol>
              {result.interview_questions?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          </div>

          <div className="result-card">
            <h3>💼 Hiring Recommendation</h3>
            <p>{result.hiring_recommendation}</p>
          </div>

          <div className="result-card">
            <h3>🎯 Role Recommendation</h3>
            <p>{result.role_recommendation}</p>
          </div>

          <div className="result-card">
            <h3>📚 Training Recommendation</h3>
            <p>{result.training_recommendation}</p>
          </div>

        </div>
      )}
         
         {result && (
         <button className="download-btn" onClick={downloadReport}>
           📄 Download Report (PDF)
          </button>
       )}
     </div>

      <Footer />
    </>
  );
}

export default App;
          