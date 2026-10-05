import React, { useState, useEffect } from 'react';
import { Mic, X, Check, Play, Pause, RotateCcw, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { updateActivityLog, getTodayKey } from '../../utils/storage';

export const SpeakingTracker = ({ dayLog, dateKey = getTodayKey(), onClose, onSaveSuccess }) => {
  const existing = dayLog?.speaking || {};

  const [topic, setTopic] = useState(existing.topic || '');
  const [content, setContent] = useState(existing.content || '');
  const [timeSpent, setTimeSpent] = useState(existing.timeSpent || 15);
  const [learned, setLearned] = useState(existing.learned || '');
  const [difficulties, setDifficulties] = useState(existing.difficulties || '');
  const [notes, setNotes] = useState(existing.notes || '');

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Sync timer into timeSpent minutes when timer reaches multiples of 60 or user pauses
  useEffect(() => {
    if (timerSeconds > 0) {
      const mins = Math.ceil(timerSeconds / 60);
      setTimeSpent(mins);
    }
  }, [timerSeconds]);

  const formatTimer = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateActivityLog(dateKey, 'speaking', {
      topic: topic.trim() || 'General Speaking Practice',
      content: content.trim(),
      timeSpent: Number(timeSpent) || 10,
      learned: learned.trim(),
      difficulties: difficulties.trim(),
      notes: notes.trim(),
    });
    if (onSaveSuccess) onSaveSuccess();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title" style={{ color: 'var(--speaking-color)' }}>
            <Mic size={24} />
            <span>Speaking Tracker</span>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, marginBottom: 4 }}>Did you practice speaking English today? 🗣️</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Use the live timer or enter your practice session details below.
          </p>
        </div>

        {/* Interactive Live Timer */}
        <div className="speaking-timer-box">
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            Practice Timer
          </div>
          <div className="timer-display">{formatTimer(timerSeconds)}</div>
          <div className="timer-controls">
            <button
              type="button"
              className="timer-btn"
              style={{
                backgroundColor: isTimerRunning ? '#ef4444' : '#10b981',
                color: 'white',
              }}
              onClick={() => setIsTimerRunning(!isTimerRunning)}
            >
              {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
              {isTimerRunning ? 'Pause Timer' : 'Start Speaking Timer'}
            </button>
            {timerSeconds > 0 && (
              <button
                type="button"
                className="timer-btn"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}
                onClick={handleResetTimer}
              >
                <RotateCcw size={16} /> Reset
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Speaking Topic</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. My daily routine, Describing my favorite vacation, Job interview prep"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Duration (Minutes)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Clock size={18} style={{ color: 'var(--speaking-color)' }} />
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
            <label className="form-label">What did you talk about?</label>
            <textarea
              className="form-textarea"
              rows="2"
              placeholder="e.g. Talked aloud to myself for 10 minutes, explaining my weekend plans."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} style={{ color: 'var(--speaking-color)' }} />
              What did you learn?
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Practiced linking words ('as a result', 'in addition')."
              value={learned}
              onChange={(e) => setLearned(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AlertTriangle size={14} style={{ color: '#f59e0b' }} />
              What difficulties did you notice?
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Hesitated when pronouncing 'th' sounds or past tense verbs."
              value={difficulties}
              onChange={(e) => setDifficulties(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Optional Notes</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Recorded voice on phone and listened back."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ backgroundColor: 'var(--speaking-color)', marginTop: 20 }}
          >
            <Check size={18} />
            Save Practice
          </button>
        </form>
      </div>
    </div>
  );
};
