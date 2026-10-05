import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2, XCircle, X } from 'lucide-react';
import { getDayCompletionStats, getTodayKey, formatDateDisplay } from '../utils/storage';

export const HistoryCalendar = ({ appData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build calendar matrix
  const daysGrid = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dObj = new Date(year, month, d);
    const dateKey = getTodayKey(dObj);
    daysGrid.push({ dayNumber: d, dateKey });
  }

  const selectedDayLog = selectedDateKey ? appData[selectedDateKey] : null;
  const selectedDayStats = selectedDayLog ? getDayCompletionStats(selectedDayLog) : { count: 0, totalMins: 0 };
  const todayKey = getTodayKey();

  return (
    <div style={{ paddingBottom: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Practice History & Calendar</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          Review your daily LSWR activity, completion status, and notes over time.
        </p>
      </div>

      {/* Calendar Control Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button className="icon-btn" onClick={handlePrevMonth}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ fontSize: 18, fontWeight: 800 }}>
            {monthNames[month]} {year}
          </div>
          <button className="icon-btn" onClick={handleNextMonth}>
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Status Legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 14, fontSize: 11, color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span className="status-dot full" />
            <span>🟢 Completed All 4</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span className="status-dot partial" />
            <span>🟡 Partially Completed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span className="status-dot empty" />
            <span>⚪ No Activity</span>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="calendar-grid">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="calendar-day-header">
              {d}
            </div>
          ))}

          {/* Calendar Cells */}
          {daysGrid.map((item, idx) => {
            if (!item) {
              return <div key={`empty-${idx}`} style={{ aspectRatio: 1 }} />;
            }

            const dayLog = appData[item.dateKey];
            const stats = getDayCompletionStats(dayLog);
            const isToday = item.dateKey === todayKey;

            let dotClass = 'empty';
            if (stats.count === 4) dotClass = 'full';
            else if (stats.count > 0) dotClass = 'partial';

            return (
              <div
                key={item.dateKey}
                className={`calendar-day-cell ${isToday ? 'is-today' : ''}`}
                onClick={() => setSelectedDateKey(item.dateKey)}
              >
                <span>{item.dayNumber}</span>
                <span className={`status-dot ${dotClass}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details Modal */}
      {selectedDateKey && (
        <div className="modal-overlay" onClick={() => setSelectedDateKey(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>
                  {formatDateDisplay(selectedDateKey)}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Total Practice: {selectedDayStats.totalMins} mins | {selectedDayStats.count}/4 completed
                </div>
              </div>
              <button className="icon-btn" onClick={() => setSelectedDateKey(null)}>
                <X size={20} />
              </button>
            </div>

            {selectedDayLog ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Listening */}
                <div
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: 4 }}>
                    <span style={{ color: 'var(--listening-color)' }}>🎧 Listening</span>
                    <span style={{ fontSize: 12 }}>
                      {selectedDayLog.listening?.completed ? `✅ ${selectedDayLog.listening.timeSpent} mins` : '⚪ Not done'}
                    </span>
                  </div>
                  {selectedDayLog.listening?.completed && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div><strong>Listened to:</strong> {selectedDayLog.listening.content} ({selectedDayLog.listening.category})</div>
                      {selectedDayLog.listening.learned && <div><strong>Learned:</strong> {selectedDayLog.listening.learned}</div>}
                    </div>
                  )}
                </div>

                {/* Speaking */}
                <div
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: 4 }}>
                    <span style={{ color: 'var(--speaking-color)' }}>🗣️ Speaking</span>
                    <span style={{ fontSize: 12 }}>
                      {selectedDayLog.speaking?.completed ? `✅ ${selectedDayLog.speaking.timeSpent} mins` : '⚪ Not done'}
                    </span>
                  </div>
                  {selectedDayLog.speaking?.completed && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div><strong>Topic:</strong> {selectedDayLog.speaking.topic}</div>
                      {selectedDayLog.speaking.learned && <div><strong>Learned:</strong> {selectedDayLog.speaking.learned}</div>}
                    </div>
                  )}
                </div>

                {/* Writing */}
                <div
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    background: 'rgba(245, 158, 11, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: 4 }}>
                    <span style={{ color: 'var(--writing-color)' }}>✍️ Writing</span>
                    <span style={{ fontSize: 12 }}>
                      {selectedDayLog.writing?.completed ? `✅ ${selectedDayLog.writing.timeSpent} mins` : '⚪ Not done'}
                    </span>
                  </div>
                  {selectedDayLog.writing?.completed && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div><strong>Topic:</strong> {selectedDayLog.writing.topic}</div>
                      {selectedDayLog.writing.content && (
                        <div style={{ fontStyle: 'italic', marginTop: 4, background: 'rgba(0,0,0,0.15)', padding: 6, borderRadius: 6 }}>
                          "{selectedDayLog.writing.content.substring(0, 120)}..."
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Reading */}
                <div
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    background: 'rgba(244, 63, 94, 0.08)',
                    border: '1px solid rgba(244, 63, 94, 0.2)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, marginBottom: 4 }}>
                    <span style={{ color: 'var(--reading-color)' }}>📖 Reading</span>
                    <span style={{ fontSize: 12 }}>
                      {selectedDayLog.reading?.completed ? `✅ ${selectedDayLog.reading.timeSpent} mins` : '⚪ Not done'}
                    </span>
                  </div>
                  {selectedDayLog.reading?.completed && (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                      <div><strong>Read:</strong> {selectedDayLog.reading.content} ({selectedDayLog.reading.category})</div>
                      {selectedDayLog.reading.newWords?.length > 0 && (
                        <div style={{ marginTop: 4 }}>
                          <strong>Vocabulary:</strong> {selectedDayLog.reading.newWords.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Reflection */}
                {selectedDayLog.reflection && (
                  <div style={{ padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                      End of Day Mood: {selectedDayLog.reflection.rating}
                    </div>
                    {selectedDayLog.reflection.journal && (
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        "{selectedDayLog.reflection.journal}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                No LSWR practice logged for this date.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
