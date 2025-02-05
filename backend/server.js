const express = require("express");
const cors = require("cors");
const path = require("path");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",  
    password: "UmaizaSehrish1#2",  
    database: "quicknote"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database");
});

// Serve static files from the frontend folder
const frontendPath = path.join(__dirname, "..", "frontend"); 
app.use(express.static(frontendPath));

// Fetch all notes
app.get("/notes", (req, res) => {
    db.query("SELECT * FROM notes", (err, results) => {
        if (err) {
            res.status(500).json({ error: "Database query failed" });
            return;
        }
        res.json(results);
    });
});

app.get("/notes/search", (req, res) => {
  const searchQuery = req.query.q;
  const query = "SELECT * FROM notes WHERE text LIKE ?";
  db.query(query, [`%${searchQuery}%`], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
  });
});

// Add a new note
app.post("/notes", (req, res) => {
    const { text, color } = req.body;
    if (!text.trim()) {
        return res.status(400).json({ error: "Note text is required" });
    }

    db.query("INSERT INTO notes (text, color) VALUES (?, ?)", [text, color], (err, result) => {
        if (err) {
            res.status(500).json({ error: "Database insertion failed" });
            return;
        }

        const newNote = { id: result.insertId, text, color };
        res.json(newNote);
    });
});

// Delete a note
app.delete("/notes/:id", (req, res) => {
    const noteId = req.params.id;

    db.query("DELETE FROM notes WHERE id = ?", [noteId], (err, result) => {
        if (err) {
            res.status(500).json({ error: "Database deletion failed" });
            return;
        }
        res.json({ message: "Note deleted" });
    });
});




const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
