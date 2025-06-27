import React, { useState, useEffect } from "react";
import AddNoteForm from "./components/AddNoteForm";
import "./App.css";
import "./components/AddNoteForm.css";

const TAG_COLORS = {
  Work: "#b3e5fc",
  Personal: "#ffe0b2",
  Urgent: "#ffcdd2",
  Shopping: "#dcedc8",
  Ideas: "#d1c4e9",
  Other: "#cfd8dc"
};
const TAGS = Object.keys(TAG_COLORS);
const QUOTES = [
  "Believe you can and you're halfway there.",
  "Success is not final, failure is not fatal.",
  "The only way to do great work is to love what you do.",
  "Stay positive, work hard, make it happen.",
  "Dream big and dare to fail."
];

function getRandomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}

function getInitialNotes() {
  const saved = localStorage.getItem("stickyNotes");
  if (saved) return JSON.parse(saved);
  return [];
}

function App() {
  const [notes, setNotes] = useState(getInitialNotes());
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("created");
  const [quote, setQuote] = useState(getRandomQuote());

  useEffect(() => {
    localStorage.setItem("stickyNotes", JSON.stringify(notes));
  }, [notes]);

  // Refresh quote every hour
  useEffect(() => {
    const interval = setInterval(() => {
      setQuote(getRandomQuote());
    }, 3600000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = note => {
    const newNote = {
      id: Date.now(),
      title: note.title,
      description: note.description,
      color: note.color,
      tag: note.tag,
      emoji: note.emoji,
      dueDate: note.dueDate,
      completed: false,
      created: Date.now()
    };
    setNotes(prev => [...prev, newNote]);
  };

  const handleComplete = id => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, completed: true } : n
      )
    );
  };

  const handleDelete = id => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Filtering
  let filteredNotes = notes;
  if (filter === "completed") filteredNotes = notes.filter(n => n.completed);
  else if (filter === "pending") filteredNotes = notes.filter(n => !n.completed);

  // Sorting
  if (sort === "created") filteredNotes = [...filteredNotes].sort((a, b) => a.created - b.created);
  else if (sort === "due") filteredNotes = [...filteredNotes].sort((a, b) => (a.dueDate || "") > (b.dueDate || "") ? 1 : -1);
  else if (sort === "color") filteredNotes = [...filteredNotes].sort((a, b) => a.color.localeCompare(b.color));

  return (
    <div className="App">
      <div className="main-content-flex">
        <div className="form-section">
          <h2 className="add-note-heading">Add Note</h2>
          <AddNoteForm onAdd={handleAdd} />
        </div>
        <div className="cards-section">
          <div className="cards-controls">
            <select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter notes">
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort notes">
              <option value="created">Sort by Created</option>
              <option value="due">Sort by Due Date</option>
              <option value="color">Sort by Color</option>
            </select>
          </div>
          <div className="cards-grid-wrapper">
            {filteredNotes.length === 0 ? (
              <div className="no-tasks-message">No tasks found.</div>
            ) : (
              <div className="cards-grid">
                {filteredNotes.map(note => (
                  <div
                    key={note.id}
                    className={`task-card${note.completed ? " completed" : ""}`}
                    style={{ background: TAG_COLORS[note.tag] || "#fff", border: note.completed ? "2px solid #4caf50" : "1px solid #ccc" }}
                  >
                    <div className="task-card-header">
                      <span className="task-card-title">{note.title}</span>
                      <button onClick={() => handleDelete(note.id)} className="task-card-delete" title="Delete">🗑️</button>
                    </div>
                    <div className="task-card-body">
                      {note.description && <div className="task-card-desc">{note.description}</div>}
                      <div className="task-card-details">
                        {note.emoji && <span className="task-card-emoji">{note.emoji}</span>}
                        {note.tag && <span className="task-card-tag">{note.tag}</span>}
                        {note.dueDate && <span className="task-card-due">📅 {new Date(note.dueDate).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <div className="task-card-footer">
                      <span className="task-card-status">{note.completed ? "Completed" : "Pending"}</span>
                      {!note.completed && (
                        <button onClick={() => handleComplete(note.id)} className="task-card-complete">Complete</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
