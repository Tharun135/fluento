import React, { useState } from 'react';
import { Headphones, X, Check, Clock, Sparkles, HelpCircle } from 'lucide-react';
import { updateActivityLog, getTodayKey } from '../../utils/storage';

export const ListeningTracker = ({ dayLog, dateKey = getTodayKey(), onClose, onSaveSuccess }) => {
  const existing = dayLog?.listening || {};

  const [content, setContent] = useState(existing.content || '');
  const [category, setCategory] = useState(existing.category || 'Podcast');
  const [timeSpent, setTimeSpent] = useState(existing.timeSpent || 20);
  const [learned, setLearned] = useState(existing.learned || '');
  const [notes, setNotes] = useState(existing.notes || '');

  const categories = ['YouTube', 'Podcast', 'Movie/TV', 'Audiobook', 'News', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    updateActivityLog(dateKey, 'listening', {
      content: content.trim() || 'English Listening Practice',
      category,
      timeSpent: Number(timeSpent) || 15,
      learned: learned.trim(),
      notes: notes.trim(),
    });
    if (onSaveSuccess) onSaveSuccess();
    onClose();
  };

  const handleQuickAdd = (mins) => {
    setTimeSpent((prev) => Math.max(5, (Number(prev) || 0) + mins));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: 'var(--listening-color)' }}>
            <Headphones size={24} />
            <span>Listening Tracker</span>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, marginBottom: 4 }}>Did you listen to English today? 🎧</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Track podcasts, videos, audiobooks, or conversations you listened to.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">What did you listen to?</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. BBC 6 Minute English, TED Talk, Friends S01E05"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type of Content</label>
            <div className="pills-container">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`pill-option ${category === cat ? 'selected' : ''}`}
                  onClick={() => setCategory(cat)}
                  style={{
                    backgroundColor: category === cat ? 'var(--listening-color)' : undefined,
                    borderColor: category === cat ? 'var(--listening-color)' : undefined,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Duration (Minutes)</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {[+5, +10, +15, +30].map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => handleQuickAdd(m)}
                    style={{
                      padding: '2px 8px',
                      fontSize: 11,
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    +{m}m
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={18} style={{ color: 'var(--listening-color)' }} />
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
              <Sparkles size={14} style={{ color: 'var(--listening-color)' }} />
              What did you learn?
            </label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="e.g. Learned new idioms like 'break the ice', practiced active listening."
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Optional Notes</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Listened at 1.25x speed, understood 85% of conversation."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ backgroundColor: 'var(--listening-color)', marginTop: 24 }}
          >
            <Check size={18} />
            Mark as Completed
          </button>
        </form>
      </div>
    </div>
  );
};
