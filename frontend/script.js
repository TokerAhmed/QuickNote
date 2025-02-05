document.addEventListener("DOMContentLoaded", loadNotes);

// Add event listener to the button using its ID
document.getElementById("addNoteButton").addEventListener("click", addNote);
document.getElementById("searchButton").addEventListener("click", searchNotes);

//Loading notes 
async function loadNotes() {
    try {
        const response = await fetch("http://localhost:5000/notes");
        const notes = await response.json();
        displayNotes(notes);
    } catch (error) {
        console.error("Error loading notes:", error);
    }
}

//adding notes
async function addNote() {
    const noteText = document.getElementById("noteText").value;
    if (!noteText.trim()) return;

    const note = { text: noteText, color: "skyblue" }; // Fixed note color to skyblue
    
    try {
        const response = await fetch("http://localhost:5000/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note)
        });

        const newNote = await response.json();
        displayNote(newNote);
        document.getElementById("noteText").value = "";
    } catch (error) {
        console.error("Error adding note:", error);
    }
}

async function deleteNote(id) {
    try {
        await fetch(`http://localhost:5000/notes/${id}`, { method: "DELETE" });
        document.getElementById(id)?.remove();
    } catch (error) {
        console.error("Error deleting note:", error);
    }
}

// Searching notes
async function searchNotes() {
    const searchQuery = document.getElementById("searchQuery").value;
    if (!searchQuery) return;

    try {
        const response = await fetch(`http://localhost:5000/notes/search?q=${searchQuery}`);
        const notes = await response.json();
        displayNotes(notes);
    } catch (error) {
        console.error("Error searching notes:", error);
    }
}

function displayNotes(notes) {
    const container = document.getElementById("notesContainer");
    container.innerHTML = "";
    notes.forEach(displayNote);
}

function displayNote(note) {
    if (document.getElementById(note.id)) return; // Prevent duplicates

    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note");
    noteDiv.id = note.id;
    noteDiv.style.backgroundColor = note.color;
    
    const noteText = document.createElement("p");
    noteText.textContent = note.text;
    
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => deleteNote(note.id);
    
    noteDiv.appendChild(noteText);
    noteDiv.appendChild(deleteBtn);
    document.getElementById("notesContainer").appendChild(noteDiv);
}