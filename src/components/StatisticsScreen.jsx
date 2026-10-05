import React, { useState } from 'react';
import { BarChart2, PieChart, TrendingUp, Calendar, Award, Clock, Flame } from 'lucide-react';
import { getDayCompletionStats, calculateStreak } from '../utils/storage';

export const StatisticsScreen = ({ appData }) => {
  const [timeframe, setTimeframe] = useState('week'); // 'week' | 'month'

  const streakInfo = calculateStreak(appData);

  // Compute breakdown for past 7 days (Week) or 30 days (Month)
  const daysCount = timeframe === 'week' ? 7 : 30;
  const today = new Date();

  let totals = {
    listening: 0,
    speaking: 0,
    writing: 0,
    reading: 0,
  };

  let completedDaysCount = 0;
  let partialDaysCount = 0;

  // Daily time history array for chart
  const dailyHistory = [];

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayLog = appData[dateKey];
    const stats = getDayCompletionStats(dayLog);

    if (stats.count === 4) completedDaysCount++;
    else if (stats.count > 0) partialDaysCount++;

    if (dayLog) {
      totals.listening += Number(dayLog.listening?.timeSpent) || 0;
      totals.speaking += Number(dayLog.speaking?.timeSpent) || 0;
      totals.writing += Number(dayLog.writing?.timeSpent) || 0;
      totals.reading += Number(dayLog.reading?.timeSpent) || 0;
    }

    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    dailyHistory.push({
      dayName,
      dateKey,
      mins: stats.totalMins,
      count: stats.count,
    });
  }

  const grandTotalMins = totals.listening + totals.speaking + totals.writing + totals.reading;
  const maxDayMins = Math.max(...dailyHistory.map((h) => h.mins), 60);

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Header & Timeframe Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 2 }}>Progress & Analytics</h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Track consistency & total practice time</p>
        </div>

        {/* Timeframe Toggle Buttons */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: 3, borderRadius: 12, border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => setTimeframe('week')}
            style={{
              padding: '6px 12px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              background: timeframe === 'week' ? 'var(--listening-color)' : 'transparent',
              color: timeframe === 'week' ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            This Week
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('month')}
            style={{
              padding: '6px 12px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              border: 'none',
              background: timeframe === 'month' ? 'var(--listening-color)' : 'transparent',
              color: timeframe === 'month' ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            This Month
          </button>
        </div>
      </div>

      {/* Grand Total Hero Card */}
      <div
        className="glass-card"
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(16, 185, 129, 0.2))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
          {timeframe === 'week' ? 'This Week’s Total Practice' : 'This Month’s Total Practice'}
        </div>
        <div style={{ fontSize: 44, fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 8px' }}>
          {grandTotalMins} <span style={{ fontSize: 20, color: 'var(--text-secondary)' }}>mins</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
          <span>🎯 {completedDaysCount} Days Fully Completed</span>
          <span>⚡ Avg {(grandTotalMins / daysCount).toFixed(0)} mins/day</span>
        </div>
      </div>

      {/* LSWR Activity Minutes Breakdown */}
      <div className="glass-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Practice Time by Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Listening */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              <span>🎧 Listening</span>
              <span style={{ color: 'var(--listening-color)' }}>{totals.listening} mins</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${grandTotalMins ? (totals.listening / grandTotalMins) * 100 : 0}%`,
                  background: 'var(--listening-color)',
                  borderRadius: 4,
                }}
              />
            </div>
          </div>

          {/* Speaking */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              <span>🗣️ Speaking</span>
              <span style={{ color: 'var(--speaking-color)' }}>{totals.speaking} mins</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${grandTotalMins ? (totals.speaking / grandTotalMins) * 100 : 0}%`,
                  background: 'var(--speaking-color)',
                  borderRadius: 4,
                }}
              />
            </div>
          </div>

          {/* Writing */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              <span>✍️ Writing</span>
              <span style={{ color: 'var(--writing-color)' }}>{totals.writing} mins</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${grandTotalMins ? (totals.writing / grandTotalMins) * 100 : 0}%`,
                  background: 'var(--writing-color)',
                  borderRadius: 4,
                }}
              />
            </div>
          </div>

          {/* Reading */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
              <span>📖 Reading</span>
              <span style={{ color: 'var(--reading-color)' }}>{totals.reading} mins</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${grandTotalMins ? (totals.reading / grandTotalMins) * 100 : 0}%`,
                  background: 'var(--reading-color)',
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Bar Chart for Daily Consistency */}
      <div className="glass-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Daily Consistency & Duration</h3>
        <div
          style={{
            height: 150,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 6,
            paddingTop: 10,
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: 8,
          }}
        >
          {dailyHistory.map((item) => {
            const heightPct = Math.min(100, Math.max(10, (item.mins / maxDayMins) * 100));
            const barBg =
              item.count === 4
                ? '#10b981'
                : item.count > 0
                ? '#f59e0b'
                : 'rgba(255,255,255,0.1)';

            return (
              <div
                key={item.dateKey}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.mins}m</div>
                <div
                  style={{
                    width: '100%',
                    height: `${heightPct}%`,
                    background: barBg,
                    borderRadius: 6,
                    transition: 'height 0.3s ease',
                  }}
                  title={`${item.dateKey}: ${item.mins} mins (${item.count}/4 completed)`}
                />
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {item.dayName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Streak & Consistency Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="glass-card" style={{ marginBottom: 0, textAlign: 'center', padding: 16 }}>
          <Flame size={28} style={{ color: 'var(--accent-streak)', margin: '0 auto 6px' }} />
          <div style={{ fontSize: 22, fontWeight: 800 }}>{streakInfo.currentStreak} Days</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Current Streak</div>
        </div>

        <div className="glass-card" style={{ marginBottom: 0, textAlign: 'center', padding: 16 }}>
          <Award size={28} style={{ color: '#10b981', margin: '0 auto 6px' }} />
          <div style={{ fontSize: 22, fontWeight: 800 }}>{streakInfo.longestStreak} Days</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Longest Streak</div>
        </div>
      </div>
    </div>
  );
};
