const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, "..", "frontend")));

app.use(express.json());

let notes = [];

app.get("/notes", (req, res) => {
  res.json(notes);
});

app.post("/notes", (req, res) => {
  const { text, color } = req.body;
  const newNote = { id: Date.now(), text, color };
  notes.push(newNote);
  res.json(newNote);
});

app.delete("/notes/:id", (req, res) => {
  notes = notes.filter((note) => note.id !== parseInt(req.params.id));
  res.json({ message: "Note deleted" });
});

// Serve index.html on root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
