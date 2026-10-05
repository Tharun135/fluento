import React, { useState } from 'react';
import { BookOpen, X, Check, Clock, Plus, Tag, Sparkles } from 'lucide-react';
import { updateActivityLog, getTodayKey } from '../../utils/storage';

export const ReadingTracker = ({ dayLog, dateKey = getTodayKey(), onClose, onSaveSuccess }) => {
  const existing = dayLog?.reading || {};

  const [content, setContent] = useState(existing.content || '');
  const [category, setCategory] = useState(existing.category || 'Book');
  const [timeSpent, setTimeSpent] = useState(existing.timeSpent || 25);
  const [learned, setLearned] = useState(existing.learned || '');
  const [notes, setNotes] = useState(existing.notes || '');

  // Vocabulary Chips Input State
  const [newWords, setNewWords] = useState(existing.newWords || []);
  const [wordInput, setWordInput] = useState('');

  const categories = ['Article', 'Book', 'News', 'Blog', 'Documentation', 'Other'];

  const handleAddWord = (e) => {
    e.preventDefault();
    if (wordInput.trim() && !newWords.includes(wordInput.trim())) {
      setNewWords([...newWords, wordInput.trim()]);
      setWordInput('');
    }
  };

  const handleRemoveWord = (wordToRemove) => {
    setNewWords(newWords.filter((w) => w !== wordToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateActivityLog(dateKey, 'reading', {
      content: content.trim() || 'English Reading Practice',
      category,
      timeSpent: Number(timeSpent) || 20,
      learned: learned.trim(),
      newWords,
      notes: notes.trim(),
    });
    if (onSaveSuccess) onSaveSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: 'var(--reading-color)' }}>
            <BookOpen size={24} />
            <span>Reading Tracker</span>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, marginBottom: 4 }}>Did you read English today? 📖</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Record articles, books, news, or blogs you read today.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">What did you read?</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Atomic Habits Chapter 4, TechCrunch Article, BBC News"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type of Reading Material</label>
            <div className="pills-container">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`pill-option ${category === cat ? 'selected' : ''}`}
                  onClick={() => setCategory(cat)}
                  style={{
                    backgroundColor: category === cat ? 'var(--reading-color)' : undefined,
                    borderColor: category === cat ? 'var(--reading-color)' : undefined,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Duration (Minutes)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={18} style={{ color: 'var(--reading-color)' }} />
              <input
                type="number"
                min="1"
                max="300"
                className="form-input"
                value={timeSpent}
                onChange={(e) => setTimeSpent(e.target.value)}
                required
              />
            </div>
          </div>

          {/* New Words / Vocabulary Input */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Tag size={14} style={{ color: 'var(--reading-color)' }} />
              New Vocabulary / Words Learned Today
            </label>

            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input
                type="text"
                className="form-input"
                placeholder="Type a new word and press Add"
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddWord(e)}
              />
              <button
                type="button"
                onClick={handleAddWord}
                style={{
                  padding: '0 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: 'var(--reading-color)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Plus size={16} /> Add
              </button>
            </div>

            {newWords.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {newWords.map((word) => (
                  <span key={word} className="vocab-chip">
                    {word}
                    <X
                      size={12}
                      style={{ cursor: 'pointer', opacity: 0.8 }}
                      onClick={() => handleRemoveWord(word)}
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} style={{ color: 'var(--reading-color)' }} />
              What did you learn?
            </label>
            <textarea
              className="form-textarea"
              rows="2"
              placeholder="e.g. Learned key insights on habit loops and cue identification."
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Optional Notes</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Read 12 pages with clear comprehension."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ backgroundColor: 'var(--reading-color)', marginTop: 20 }}
          >
            <Check size={18} />
            Mark as Completed
          </button>
        </form>
      </div>
    </div>
  );
};
