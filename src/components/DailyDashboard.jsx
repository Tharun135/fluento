import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle, Circle, Play, Clock, Sparkles, Award, ArrowRight, Smile, Meh, Frown, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ACTIVITY_TYPES, getDayCompletionStats, calculateStreak, saveDailyReflection, getTodayKey } from '../utils/storage';

export const DailyDashboard = ({ user, appData, onOpenTracker, onDataChange }) => {
  const todayKey = getTodayKey();
  const dayLog = appData[todayKey] || {};
  const stats = getDayCompletionStats(dayLog);
  const streakInfo = calculateStreak(appData);

  // Reflection state
  const [reflectionMood, setReflectionMood] = useState(dayLog.reflection?.rating || '');
  const [reflectionJournal, setReflectionJournal] = useState(dayLog.reflection?.journal || '');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  // Confetti effect when 4/4 is completed
  useEffect(() => {
    if (stats.count === 4) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // canvas-confetti fallback
      }
    }
  }, [stats.count]);

  const handleSaveReflection = (rating) => {
    setReflectionMood(rating);
    saveDailyReflection(todayKey, { rating, journal: reflectionJournal });
    setReflectionSaved(true);
    if (onDataChange) onDataChange();
    setTimeout(() => setReflectionSaved(false), 2500);
  };

  const handleJournalBlur = () => {
    if (reflectionMood || reflectionJournal) {
      saveDailyReflection(todayKey, { rating: reflectionMood || 'good', journal: reflectionJournal });
      if (onDataChange) onDataChange();
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Helper for activity status
  const getActivityStatus = (typeId) => {
    const act = dayLog[typeId];
    if (act && act.completed) return 'completed';
    if (act && (act.content || act.topic || act.timeSpent > 0)) return 'in_progress';
    return 'not_started';
  };

  const completedCount = stats.count;
  const remainingCount = 4 - completedCount;

  return (
    <div className="dashboard-container">
      {/* Top Greeting & Tagline Header */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 2 }}>
          {getGreeting()}, {user.name || 'Friend'}! 👋
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 500 }}>
          Today's English Practice & Accountability Dashboard
        </p>
      </div>

      {/* Streak & Accountability Top Banner */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(244, 63, 94, 0.15))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          padding: 18,
          borderRadius: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>🔥</span>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--accent-streak)' }}>
                {streakInfo.currentStreak} Day Streak
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                Longest: {streakInfo.longestStreak} days | Total: {streakInfo.totalPracticeTimeMins} mins
              </div>
            </div>
          </div>
          <div
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid var(--border-color)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 10, textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
              Today
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--listening-color)' }}>
              {stats.totalMins} min
            </div>
          </div>
        </div>

        {/* Daily Accountability Partner Check-in Box */}
        <div
          style={{
            background: 'rgba(0,0,0,0.25)',
            borderRadius: 14,
            padding: 12,
            marginTop: 10,
            border: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Sparkles size={16} style={{ color: '#10b981' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              Accountability Check-In
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10, fontStyle: 'italic' }}>
            “Did you practice English today?”
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, marginBottom: 10 }}>
            {Object.keys(ACTIVITY_TYPES).map((key) => {
              const act = ACTIVITY_TYPES[key];
              const log = dayLog[act.id];
              const isDone = log && log.completed;
              return (
                <div key={act.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isDone ? (
                    <CheckCircle size={14} style={{ color: '#10b981' }} />
                  ) : (
                    <Circle size={14} style={{ color: 'var(--text-muted)' }} />
                  )}
                  <span style={{ fontWeight: 600, color: isDone ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {act.name} {isDone ? `(${log.timeSpent}m)` : ''}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: completedCount === 4 ? '#10b981' : 'var(--listening-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>
              {completedCount === 4
                ? '🎉 Amazing job! You completed all 4 activities today!'
                : `You're ${remainingCount} ${remainingCount === 1 ? 'activity' : 'activities'} away from completing today's practice.`}
            </span>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>Today's Progress</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--listening-color)' }}>
            {completedCount} / 4 completed ({Math.round((completedCount / 4) * 100)}%)
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: 12,
            borderRadius: 6,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
            marginBottom: 8,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(completedCount / 4) * 100}%`,
              background: 'linear-gradient(90deg, #6366f1, #10b981, #f59e0b, #f43f5e)',
              borderRadius: 6,
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Four LSWR Activity Cards */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)' }}>
          Today's LSWR Activities
        </h3>

        {/* 1. Listening Card */}
        <div className="activity-card listening" onClick={() => onOpenTracker('listening')}>
          <div className="activity-header">
            <div className="activity-title-group">
              <div
                className="activity-icon-box"
                style={{ background: 'var(--listening-bg-subtle)', color: 'var(--listening-color)' }}
              >
                🎧
              </div>
              <div>
                <div className="activity-title">Listening</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {dayLog.listening?.completed ? `${dayLog.listening.timeSpent} mins completed` : 'Not started'}
                </div>
              </div>
            </div>
            <span className={`status-badge ${getActivityStatus('listening')}`}>
              {getActivityStatus('listening').replace('_', ' ')}
            </span>
          </div>

          <div className="activity-body">
            {dayLog.listening?.completed ? (
              <>
                <div className="activity-detail-item">
                  <span className="activity-detail-label">Listened to:</span>
                  <span style={{ fontWeight: 600 }}>{dayLog.listening.content}</span>
                </div>
                {dayLog.listening.learned && (
                  <div className="activity-detail-item">
                    <span className="activity-detail-label">Learned:</span>
                    <span>{dayLog.listening.learned}</span>
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                Podcasts, YouTube videos, audiobooks, or movies. Tap to log practice.
              </p>
            )}
          </div>
        </div>

        {/* 2. Speaking Card */}
        <div className="activity-card speaking" onClick={() => onOpenTracker('speaking')}>
          <div className="activity-header">
            <div className="activity-title-group">
              <div
                className="activity-icon-box"
                style={{ background: 'var(--speaking-bg-subtle)', color: 'var(--speaking-color)' }}
              >
                🗣️
              </div>
              <div>
                <div className="activity-title">Speaking</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {dayLog.speaking?.completed ? `${dayLog.speaking.timeSpent} mins completed` : 'Not started'}
                </div>
              </div>
            </div>
            <span className={`status-badge ${getActivityStatus('speaking')}`}>
              {getActivityStatus('speaking').replace('_', ' ')}
            </span>
          </div>

          <div className="activity-body">
            {dayLog.speaking?.completed ? (
              <>
                <div className="activity-detail-item">
                  <span className="activity-detail-label">Topic:</span>
                  <span style={{ fontWeight: 600 }}>{dayLog.speaking.topic}</span>
                </div>
                {dayLog.speaking.learned && (
                  <div className="activity-detail-item">
                    <span className="activity-detail-label">Learned:</span>
                    <span>{dayLog.speaking.learned}</span>
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                Live speaking timer & topic recording. Tap to start speaking session.
              </p>
            )}
          </div>
        </div>

        {/* 3. Writing Card */}
        <div className="activity-card writing" onClick={() => onOpenTracker('writing')}>
          <div className="activity-header">
            <div className="activity-title-group">
              <div
                className="activity-icon-box"
                style={{ background: 'var(--writing-bg-subtle)', color: 'var(--writing-color)' }}
              >
                ✍️
              </div>
              <div>
                <div className="activity-title">Writing</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {dayLog.writing?.completed ? `${dayLog.writing.timeSpent} mins completed` : 'Not started'}
                </div>
              </div>
            </div>
            <span className={`status-badge ${getActivityStatus('writing')}`}>
              {getActivityStatus('writing').replace('_', ' ')}
            </span>
          </div>

          <div className="activity-body">
            {dayLog.writing?.completed ? (
              <>
                <div className="activity-detail-item">
                  <span className="activity-detail-label">Topic:</span>
                  <span style={{ fontWeight: 600 }}>{dayLog.writing.topic}</span>
                </div>
                {dayLog.writing.learned && (
                  <div className="activity-detail-item">
                    <span className="activity-detail-label">Learned:</span>
                    <span>{dayLog.writing.learned}</span>
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                In-app text editor with word counter. Tap to write practice text.
              </p>
            )}
          </div>
        </div>

        {/* 4. Reading Card */}
        <div className="activity-card reading" onClick={() => onOpenTracker('reading')}>
          <div className="activity-header">
            <div className="activity-title-group">
              <div
                className="activity-icon-box"
                style={{ background: 'var(--reading-bg-subtle)', color: 'var(--reading-color)' }}
              >
                📖
              </div>
              <div>
                <div className="activity-title">Reading</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {dayLog.reading?.completed ? `${dayLog.reading.timeSpent} mins completed` : 'Not started'}
                </div>
              </div>
            </div>
            <span className={`status-badge ${getActivityStatus('reading')}`}>
              {getActivityStatus('reading').replace('_', ' ')}
            </span>
          </div>

          <div className="activity-body">
            {dayLog.reading?.completed ? (
              <>
                <div className="activity-detail-item">
                  <span className="activity-detail-label">Read:</span>
                  <span style={{ fontWeight: 600 }}>{dayLog.reading.content}</span>
                </div>
                {dayLog.reading.newWords?.length > 0 && (
                  <div className="activity-detail-item">
                    <span className="activity-detail-label">New Words:</span>
                    <span>{dayLog.reading.newWords.join(', ')}</span>
                  </div>
                )}
              </>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                Books, articles, & vocabulary tracker. Tap to log reading.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Daily Reflection Section */}
      <div className="glass-card" style={{ padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Sparkles size={18} style={{ color: 'var(--writing-color)' }} />
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>End-of-Day Reflection</h3>
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
          How was your English practice today?
        </p>

        {/* Mood Selector Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { id: 'excellent', label: '😊 Excellent', color: '#10b981' },
            { id: 'good', label: '🙂 Good', color: '#6366f1' },
            { id: 'okay', label: '😐 Okay', color: '#f59e0b' },
            { id: 'difficult', label: '😔 Difficult', color: '#f43f5e' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => handleSaveReflection(m.id)}
              style={{
                padding: '8px 4px',
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 700,
                border: reflectionMood === m.id ? `2px solid ${m.color}` : '1px solid var(--border-color)',
                backgroundColor: reflectionMood === m.id ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="form-group" style={{ marginBottom: 10 }}>
          <label className="form-label" style={{ fontSize: 12 }}>
            What did you improve today? (Daily Journal)
          </label>
          <textarea
            className="form-textarea"
            rows="2"
            placeholder="Write a brief reflection on your English learning win today..."
            value={reflectionJournal}
            onChange={(e) => setReflectionJournal(e.target.value)}
            onBlur={handleJournalBlur}
          />
        </div>

        {reflectionSaved && (
          <div style={{ fontSize: 12, color: '#10b981', fontWeight: 700, textAlign: 'center' }}>
            ✓ Reflection saved to today's log!
          </div>
        )}
      </div>
    </div>
  );
};
