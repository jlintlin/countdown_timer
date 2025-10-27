# Feature Roadmap

This document outlines potential future enhancements for the Countdown Timer application.

## ✅ Completed Features

- [x] Dark mode toggle
- [x] Preset durations (quick start)
- [x] Real-time duration preview
- [x] Reset confirmation dialog
- [x] Live date/time display on timer screen
- [x] Improved visual focus and layout
- [x] **Sound selection for completion alert** (5 patterns + volume control)
- [x] **Timer history/favorites** (Recent, Favorites, Popular views)
- [x] **Notification API integration** (Browser notifications)
- [x] **"Go Back" confirmation dialog** (Prevents accidental navigation)

## 🚧 Potential Future Features

### High Priority

- [ ] **Multiple Simultaneous Timers**
  - Run several countdowns at once
  - Tabs or list view to switch between timers
  - Individual controls for each timer
  - Visual indicators showing which timers are active

### Medium Priority

### Lower Priority

- [ ] **PWA Support**
  - Offline functionality
  - Install prompt for add to home screen
  - Service worker for caching
  - App manifest file
  - Splash screen

- [ ] **Keep Screen Awake Option**
  - Prevent device sleep during countdown
  - Toggle on/off in settings
  - Uses Wake Lock API
  - Graceful degradation for unsupported browsers

### Nice to Have

- [ ] **Timer Templates**
  - Pomodoro timer (25 min work, 5 min break)
  - Interval training presets
  - Custom repeating timers
  - Automatic timer chains

- [ ] **Visual Customization**
  - Color theme options beyond light/dark
  - Custom gradient colors
  - Sound/vibration patterns
  - Full screen mode

- [ ] **Statistics & Analytics**
  - Track total time counted down
  - Most used durations
  - Completion rate
  - Time of day patterns

## Implementation Notes

### Multiple Simultaneous Timers
**Complexity:** High
**Estimated effort:** 2-3 days
**Dependencies:** None
**Key changes:**
- Refactor App.tsx to manage array of timers
- Create TimerManager component
- Update state management to handle multiple timer states
- Add UI for switching between timers

### Timer History/Favorites
**Complexity:** Medium
**Estimated effort:** 1-2 days
**Dependencies:** None
**Key changes:**
- Add localStorage for persisting timer history
- Create HistoryPanel component
- Add favorite/star functionality
- Implement search/filter for history

### Sound Selection
**Complexity:** Low
**Estimated effort:** 1 day
**Dependencies:** None
**Key changes:**
- Add sound assets or use Web Audio API
- Create SoundPicker component
- Update ActiveTimerScreen to use selected sound
- Add volume control slider

### Notification API
**Complexity:** Medium
**Estimated effort:** 1 day
**Dependencies:** Browser Notification API support
**Key changes:**
- Request notification permissions
- Send notification on timer complete
- Handle permission denial gracefully
- Add settings toggle

### PWA Support
**Complexity:** Medium
**Estimated effort:** 2 days
**Dependencies:** Service worker, manifest file
**Key changes:**
- Create manifest.json
- Implement service worker
- Add offline fallback
- Create install prompt

### Keep Screen Awake
**Complexity:** Low
**Estimated effort:** 0.5 days
**Dependencies:** Wake Lock API support
**Key changes:**
- Implement Wake Lock API
- Add toggle in settings
- Handle browser compatibility
- Release wake lock on timer complete

## Priority Ranking

Based on user value and implementation effort:

1. **Multiple Simultaneous Timers** - High value, moderate effort
2. **Timer History/Favorites** - High value, low effort
3. **Sound Selection** - Medium value, low effort
4. **Notification API** - Medium value, low effort
5. **PWA Support** - Medium value, moderate effort
6. **Keep Screen Awake** - Low value, low effort
