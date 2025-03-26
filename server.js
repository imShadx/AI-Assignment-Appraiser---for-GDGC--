const express = require("express"); //to handle the backend and API requests
const multer = require("multer"); //receives docs and processes them in RAM
const mammoth = require("mammoth"); //helps parse through the doc
const cors = require("cors"); //cross origin something something - basically combines front and back
const { GoogleGenAI } = require("@google/genai");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
const ai = new GoogleGenAI({
  apiKey: "AIzaSyDA5aZb8GewrPtAhDvuaQn6eusvF5TC4Ug",
});

// Multer setup to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST endpoint to upload and process the file
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extract text from .docx
    const result = await mammoth.extractRawText({ buffer: req.file.buffer });
    const text = result.value.trim();

    if (!text) {
      return res.status(400).json({ error: "Empty document" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `give a concise feedback/review of the following text like a teacher grading an assignment with any area for improvement with strengths and weaknesses - make sure to keep it concise and use bullet points${text}`,
    });

    // Send AI's response to frontend
    const aiResponse =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";
    res.json({aiResponse});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error processing file" });
  }
});

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
