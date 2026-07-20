import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} AI Resume Screening Assistant | Built with
        React + FastAPI + Gemini AI
      </p>
    </footer>
  );
}

export default Footer;