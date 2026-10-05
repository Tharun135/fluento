import React from 'react';
import { Headphones, Mic, Edit3, BookOpen, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getTodayKey } from '../utils/storage';

export const PracticeTab = ({ appData, onOpenTracker }) => {
  const todayKey = getTodayKey();
  const dayLog = appData[todayKey] || {};

  const practices = [
    {
      id: 'listening',
      name: 'Listening Practice',
      icon: '🎧',
      color: 'var(--listening-color)',
      bgSubtle: 'var(--listening-bg-subtle)',
      recommended: '20 Mins',
      desc: 'Listen to podcasts, TED talks, YouTube videos, or audiobooks.',
      isDone: dayLog.listening?.completed,
      log: dayLog.listening,
    },
    {
      id: 'speaking',
      name: 'Speaking Practice',
      icon: '🗣️',
      color: 'var(--speaking-color)',
      bgSubtle: 'var(--speaking-bg-subtle)',
      recommended: '15 Mins',
      desc: 'Practice speaking aloud with live timer, monologue or voice notes.',
      isDone: dayLog.speaking?.completed,
      log: dayLog.speaking,
    },
    {
      id: 'writing',
      name: 'Writing Practice',
      icon: '✍️',
      color: 'var(--writing-color)',
      bgSubtle: 'var(--writing-bg-subtle)',
      recommended: '20 Mins',
      desc: 'Use in-app text editor to write journals, essays, or summaries.',
      isDone: dayLog.writing?.completed,
      log: dayLog.writing,
    },
    {
      id: 'reading',
      name: 'Reading Practice',
      icon: '📖',
      color: 'var(--reading-color)',
      bgSubtle: 'var(--reading-bg-subtle)',
      recommended: '25 Mins',
      desc: 'Read articles, books, or documentation and collect new vocabulary.',
      isDone: dayLog.reading?.completed,
      log: dayLog.reading,
    },
  ];

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>LSWR Practice Hub</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Choose an activity below to record or time today's practice.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {practices.map((p) => (
          <div
            key={p.id}
            className="glass-card"
            style={{
              padding: 20,
              marginBottom: 0,
              borderLeft: `5px solid ${p.color}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: p.bgSubtle,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                  }}
                >
                  {p.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700 }}>{p.name}</h3>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                    Target: {p.recommended}
                  </span>
                </div>
              </div>

              {p.isDone ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <CheckCircle2 size={14} /> Completed
                </span>
              ) : (
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: 'rgba(148, 163, 184, 0.12)',
                    color: 'var(--text-muted)',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  Pending
                </span>
              )}
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
              {p.desc}
            </p>

            {p.isDone && p.log && (
              <div
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 14,
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                }}
              >
                <strong>Today's record:</strong> {p.log.timeSpent} mins spent. {p.log.content || p.log.topic || ''}
              </div>
            )}

            <button
              type="button"
              className="btn-primary"
              onClick={() => onOpenTracker(p.id)}
              style={{ backgroundColor: p.color }}
            >
              {p.isDone ? 'Edit / Update Practice' : `Start ${p.name}`}
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
