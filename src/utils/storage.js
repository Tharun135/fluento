// LSWR Daily Data Storage & Helper Utilities

export const ACTIVITY_TYPES = {
  LISTENING: { id: 'listening', name: 'Listening', icon: '🎧', color: '#6366f1', bgLight: '#e0e7ff', textDark: '#3730a3' },
  SPEAKING: { id: 'speaking', name: 'Speaking', icon: '🗣️', color: '#10b981', bgLight: '#d1fae5', textDark: '#065f46' },
  WRITING: { id: 'writing', name: 'Writing', icon: '✍️', color: '#f59e0b', bgLight: '#fef3c7', textDark: '#92400e' },
  READING: { id: 'reading', name: 'Reading', icon: '📖', color: '#f43f5e', bgLight: '#ffe4e6', textDark: '#9f1239' },
};

const STORAGE_KEY = 'lswr_daily_app_data_v1';
const USER_KEY = 'lswr_daily_user_profile';

// Get YYYY-MM-DD format for local date
export const getTodayKey = (dateObj = new Date()) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

// Initial User Profile
export const DEFAULT_USER = {
  name: 'Tharun',
  dailyGoalMins: 60,
  morningReminderTime: '08:30',
  morningReminderEnabled: true,
  eveningReminderTime: '20:00',
  eveningReminderEnabled: true,
  theme: 'dark',
  mobileFrame: false,
};

// Sample initial history data for past 14 days so app feels vibrant immediately
export const generateSampleData = () => {
  const data = {};
  const today = new Date();

  // Create mock records for past 14 days
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateKey = getTodayKey(d);

    // Make today partially done, yesterday 4/4, some past days 3/4 or 4/4
    let isFullDay = i === 1 || i === 2 || i === 3 || i === 5 || i === 6 || i === 7 || i === 9 || i === 10;
    let isPartialDay = i === 0 || i === 4 || i === 8 || i === 11;

    data[dateKey] = {
      listening: (isFullDay || isPartialDay) ? {
        completed: true,
        timeSpent: i % 2 === 0 ? 25 : 20,
        content: i % 2 === 0 ? '6 Minute English Podcast - Technology' : 'TED Talk: The Power of Habits',
        category: i % 2 === 0 ? 'Podcast' : 'YouTube',
        learned: 'Learned new vocabulary related to modern AI & consistency.',
        notes: 'Focused on pronunciation of fast connected speech.'
      } : { completed: false, timeSpent: 0, content: '', category: 'Podcast', learned: '', notes: '' },

      speaking: (isFullDay || (isPartialDay && i !== 0 && i !== 11)) ? {
        completed: true,
        timeSpent: 15,
        topic: 'Describing my daily routine and future career goals',
        content: 'Practiced speaking aloud in front of mirror and recording voice notes.',
        learned: 'Improved pacing and reduced filler words like "um" and "uh".',
        difficulties: 'Pausing when searching for complex adjective vocabulary.',
        notes: 'Felt much more fluent after 5 minutes of warmup.'
      } : { completed: false, timeSpent: 0, topic: '', content: '', learned: '', difficulties: '', notes: '' },

      writing: (isFullDay || (isPartialDay && i === 0)) ? {
        completed: true,
        timeSpent: 20,
        topic: 'My thoughts on learning English consistently',
        content: 'Consistency is the cornerstone of mastering any new skill. Today I spent 20 minutes writing about my long-term aspirations.',
        learned: 'Used transitional phrases like "Furthermore" and "On the other hand".',
        notes: 'Grammar felt smooth today.'
      } : { completed: false, timeSpent: 0, topic: '', content: '', learned: '', notes: '' },

      reading: (isFullDay || (isPartialDay && i === 4)) ? {
        completed: true,
        timeSpent: 30,
        content: 'Atomic Habits Chapter 3 by James Clear',
        category: 'Book',
        learned: 'Small 1% daily improvements compound into massive long-term results.',
        newWords: ['Compounding', 'Inevitability', 'Frictionless', 'Anchor'],
        notes: 'Highlighted 5 key sentences to revisit later.'
      } : { completed: false, timeSpent: 0, content: '', category: 'Book', learned: '', newWords: [], notes: '' },

      reflection: isFullDay ? {
        rating: 'excellent',
        journal: 'Felt very productive! Managed to cover all 4 LSWR skills without stress.'
      } : (isPartialDay ? {
        rating: 'good',
        journal: 'Completed most activities, working on finishing writing tonight.'
      } : null)
    };
  }

  return data;
};

// Storage Helpers
export const getUserProfile = () => {
  try {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.name === 'Alex') parsed.name = 'Tharun';
      return { ...DEFAULT_USER, ...parsed };
    }
    return DEFAULT_USER;
  } catch (e) {
    return DEFAULT_USER;
  }
};

export const saveUserProfile = (profile) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving user profile', e);
  }
};

export const getAppData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      const initial = generateSampleData();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(saved);
  } catch (e) {
    return generateSampleData();
  }
};

export const saveAppData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving app data', e);
  }
};

export const getDayLog = (data, dateKey) => {
  if (data && data[dateKey]) return data[dateKey];
  return {
    listening: { completed: false, timeSpent: 0, content: '', category: 'Podcast', learned: '', notes: '' },
    speaking: { completed: false, timeSpent: 0, topic: '', content: '', learned: '', difficulties: '', notes: '' },
    writing: { completed: false, timeSpent: 0, topic: '', content: '', learned: '', notes: '' },
    reading: { completed: false, timeSpent: 0, content: '', category: 'Article', learned: '', newWords: [], notes: '' },
    reflection: null
  };
};

export const updateActivityLog = (dateKey, activityId, activityData) => {
  const data = getAppData();
  const currentDay = getDayLog(data, dateKey);

  data[dateKey] = {
    ...currentDay,
    [activityId]: {
      ...currentDay[activityId],
      ...activityData,
      completed: true,
    }
  };

  saveAppData(data);
  return data;
};

export const saveDailyReflection = (dateKey, reflectionData) => {
  const data = getAppData();
  const currentDay = getDayLog(data, dateKey);

  data[dateKey] = {
    ...currentDay,
    reflection: reflectionData
  };

  saveAppData(data);
  return data;
};

// Calculate completion counts & stats
export const getDayCompletionStats = (dayLog) => {
  if (!dayLog) return { count: 0, totalMins: 0, items: {} };
  const keys = ['listening', 'speaking', 'writing', 'reading'];
  let count = 0;
  let totalMins = 0;

  keys.forEach(k => {
    if (dayLog[k] && dayLog[k].completed) {
      count++;
      totalMins += (Number(dayLog[k].timeSpent) || 0);
    }
  });

  return { count, totalMins, items: dayLog };
};

// Calculate streak info
export const calculateStreak = (data) => {
  const today = new Date();
  let currentStreak = 0;
  let longestStreak = 0;
  let totalDaysPracticed = 0;
  let totalPracticeTimeMins = 0;

  // Track all dates in object sorted descending
  const dateKeys = Object.keys(data).sort().reverse();

  dateKeys.forEach(key => {
    const day = data[key];
    const stats = getDayCompletionStats(day);
    if (stats.count > 0) {
      totalDaysPracticed++;
      totalPracticeTimeMins += stats.totalMins;
    }
  });

  // Calculate current consecutive days streak (days with at least 1 or all completed)
  let checkDate = new Date(today);
  let todayKey = getTodayKey(checkDate);
  let todayStats = getDayCompletionStats(data[todayKey]);

  // If today hasn't been practiced yet, check starting from yesterday for streak continuity
  if (todayStats.count === 0) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  let tempStreak = 0;
  while (true) {
    const k = getTodayKey(checkDate);
    const dayData = data[k];
    const stats = getDayCompletionStats(dayData);

    if (stats.count > 0) {
      tempStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  currentStreak = tempStreak;

  // Calculate longest streak historically
  let maxS = 0;
  let runS = 0;
  // Sort dates chronologically ascending
  const ascDates = Object.keys(data).sort();
  ascDates.forEach(k => {
    const stats = getDayCompletionStats(data[k]);
    if (stats.count > 0) {
      runS++;
      if (runS > maxS) maxS = runS;
    } else {
      runS = 0;
    }
  });

  longestStreak = Math.max(maxS, currentStreak);

  return {
    currentStreak,
    longestStreak,
    totalDaysPracticed,
    totalPracticeTimeMins,
  };
};
