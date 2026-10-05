import React, { useState } from 'react';
import { Edit3, X, Check, Clock, FileText, Sparkles } from 'lucide-react';
import { updateActivityLog, getTodayKey } from '../../utils/storage';

export const WritingTracker = ({ dayLog, dateKey = getTodayKey(), onClose, onSaveSuccess }) => {
  const existing = dayLog?.writing || {};

  const [topic, setTopic] = useState(existing.topic || '');
  const [content, setContent] = useState(existing.content || '');
  const [timeSpent, setTimeSpent] = useState(existing.timeSpent || 20);
  const [learned, setLearned] = useState(existing.learned || '');
  const [notes, setNotes] = useState(existing.notes || '');

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateActivityLog(dateKey, 'writing', {
      topic: topic.trim() || 'Daily Writing Practice',
      content: content.trim(),
      timeSpent: Number(timeSpent) || 15,
      learned: learned.trim(),
      notes: notes.trim(),
    });
    if (onSaveSuccess) onSaveSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: 'var(--writing-color)' }}>
            <Edit3 size={24} />
            <span>Writing Tracker</span>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, marginBottom: 4 }}>Did you practice writing in English today? ✍️</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Write an essay, journal entry, email, or summary directly in the editor below.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Writing Topic / Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. My Reflections on Today, Summary of Article, Daily Gratitude Journal"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          {/* In-App Writing Editor */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>
                In-App Text Editor
              </label>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                {wordCount} words | {charCount} chars
              </span>
            </div>
            <textarea
              className="form-textarea inapp-text-editor"
              placeholder="Write your English practice text directly here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duration (Minutes)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={18} style={{ color: 'var(--writing-color)' }} />
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

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} style={{ color: 'var(--writing-color)' }} />
              What did you learn?
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Practiced complex sentence structures and new vocabulary words."
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Optional Notes</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Checked grammar using dictionary."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ backgroundColor: 'var(--writing-color)', marginTop: 20 }}
          >
            <Check size={18} />
            Save Writing Practice
          </button>
        </form>
      </div>
    </div>
  );
};
