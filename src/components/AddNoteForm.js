import React, { useState } from "react";

const COLORS = ["#34b4ec", "#f4ecac", "#1c536c", "#5c90ac", "#b4b4ac", "#131c22"];
const TAGS = ["Work", "Personal", "Urgent", "Shopping", "Ideas", "Other"];
const EMOJIS = ["📝", "⭐", "🎯", "📌", "💡", "🔥", "⚡", "🎨"];

function AddNoteForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [tag, setTag] = useState("");
  const [emoji, setEmoji] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!title.trim()) {
      setError("Please enter a title");
      return false;
    }
    if (dueDate && new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
      setError("Due date cannot be in the past");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validateForm()) return;

    onAdd({
      title: title.trim(),
      description: description.trim(),
      color,
      tag,
      emoji,
      dueDate
    });

    // Reset form
    setTitle("");
    setDescription("");
    setTag("");
    setEmoji("");
    setDueDate("");
    setColor(COLORS[0]);
    setError("");
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form className="add-note-form" onSubmit={handleSubmit} aria-label="Add new note">
      {error && <div className="form-error" role="alert">{error}</div>}
      
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        maxLength={50}
        aria-label="Task title"
        required
      />
      
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
        maxLength={200}
        aria-label="Task description"
      />
      
      <div className="color-picker" role="group" aria-label="Select note color">
        {COLORS.map(c => (
          <button
            key={c}
            type="button"
            className={`color-swatch${color === c ? " selected" : ""}`}
            style={{ background: c }}
            onClick={() => setColor(c)}
            aria-label={`Select color ${c}`}
            aria-pressed={color === c}
          />
        ))}
      </div>

      <select
        value={tag}
        onChange={e => setTag(e.target.value)}
        aria-label="Select tag"
      >
        <option value="">Select a tag</option>
        {TAGS.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <div className="emoji-picker" role="group" aria-label="Select emoji">
        {EMOJIS.map(e => (
          <button
            key={e}
            type="button"
            className={`emoji-button${emoji === e ? " selected" : ""}`}
            onClick={() => setEmoji(e)}
            aria-label={`Select emoji ${e}`}
            aria-pressed={emoji === e}
          >
            {e}
          </button>
        ))}
      </div>

      <input
        type="date"
        value={dueDate}
        onChange={e => setDueDate(e.target.value)}
        min={today}
        aria-label="Due date"
      />

      <button 
        type="submit" 
        className="submit-button"
        aria-label="Add note"
      >
        Add Note
      </button>
    </form>
  );
}

export default AddNoteForm;