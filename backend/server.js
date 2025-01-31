const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.static("public")); // Serve static files like index.html
app.use(express.json());
app.use(cors());

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
  notes = notes.filter(note => note.id !== parseInt(req.params.id));
  res.json({ message: "Note deleted" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
