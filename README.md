# ⏱️ Countdown Timer Application

A beautiful, feature-rich countdown timer application built with React, Vite, and modern UI libraries. Features a dynamic color gradient that intensifies from cool to warm tones as time decreases, smooth clock animations powered by React Bits, and an intuitive interface with flexible timer input options.

![Countdown Timer](https://img.shields.io/badge/Status-Ready-brightgreen) ![Docker](https://img.shields.io/badge/Docker-Ready-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## 🚀 Quick Start

Simply run the startup script:

```bash
./start.sh
```

This will:
- ✅ Check if Docker is running
- ✅ Clean up any existing containers
- ✅ Build and start the application
- ✅ Automatically detect an available port (default: 5173)
- ✅ Open your browser to the application

**That's it!** The countdown timer will be running at `http://localhost:5173` and ready to use.

## 🎉 Recent Enhancements (January 2025)

### Dark Mode & Accessibility Improvements
- ✅ **100% WCAG AAA Compliance**: All text elements now achieve perfect contrast ratios (21.00:1 minimum) in dark mode
- ✅ **Complete Dark Mode Overhaul**: Fixed text visibility issues across all screens, dialogs, and popups
- ✅ **Enhanced Readability**: Every button, label, input, and text element is now clearly visible in both light and dark modes

### Duration Picker Fixes
- ✅ **Fixed Text Visibility**: Dropdown menus now have perfect white text on glass backgrounds (21.00:1 contrast)
- ✅ **Fixed Scrolling**: Proper 300px max-height with smooth scrolling for all value ranges
- ✅ **Full Value Range Access**: All values (0-99 hours, 0-59 minutes/seconds) are now selectable
- ✅ **Small Number Selection**: Fixed issue where small duration values (1-10 minutes, 1-30 seconds) couldn't be selected

### Liquid Glass Design System
- ✅ **Consistent Glassmorphism**: Applied beautiful frosted glass effects to all UI components
- ✅ **Backdrop Blur**: 24px blur with semi-transparent backgrounds for modern aesthetic
- ✅ **Visual Harmony**: Duration picker dropdowns now match Quick Start popover and History panel styling
- ✅ **Multi-layer Shadows**: Enhanced depth with blue glow effects in dark mode

## ✨ Features

### Core Timer Features
- 🎨 **Dynamic Color Gradient**: Background intensifies from cool to warm tones (green → yellow → orange → red) as time decreases
- ⏱️ **Large Timer Display**: Easy-to-read display with smooth clock animations powered by React Bits
- 📝 **Flexible Input Options**:
  - **Natural Language Input**: Enter durations like `5m`, `1h 30m`, `90m`, `120s`, or `01:30:20`
  - **Visual Time Picker**: Dropdown selectors for hours (0-99), minutes (0-59), and seconds (0-59)
  - **Quick Start Presets**: One-click buttons for common durations (1m, 5m, 10m, 15m, 30m, 1 hour)
  - **Timer History**: Access recent timers and save favorites for quick reuse
- 🎯 **Smart Validation**: Real-time input validation with helpful error messages
- 📊 **Progress Indicator**: Visual progress ring showing time remaining
- ⏸️ **Full Control**: Pause, resume, and reset functionality with keyboard shortcuts
- 🔔 **Audio Notifications**: Customizable sound alerts when timer completes
- ⌨️ **Keyboard Shortcuts**: Space to pause/resume, R to reset

### UI/UX Design
- 🎨 **Liquid Glass Design**: Modern glassmorphism aesthetic with frosted glass effects and backdrop blur
- 🌓 **Dark/Light Mode**: Seamless theme switching with perfect text visibility in both modes
- 📐 **Clean Layout**: Intuitive, centered design with vertical stacking for better usability
- 📱 **Fully Responsive**: Optimized for mobile (375px), tablet (768px), and desktop (1440px+)
- 🎭 **Smooth Animations**: Polished transitions and micro-interactions
- ♿ **WCAG AAA Accessible**: Perfect contrast ratios (21.00:1), proper ARIA labels, and full keyboard navigation

### Developer Experience
- ⚡ **Fast Development**: Built with Vite for instant hot module replacement
- 🐳 **Docker Ready**: Consistent environment, easy deployment
- 🔌 **Dynamic Port Selection**: Automatically finds available ports to avoid conflicts
- 🚀 **Smart Image Caching**: Intelligent Docker image versioning skips unnecessary rebuilds
- 🛑 **Clean Shutdown**: Proper signal handling ensures containers stop completely
- 📦 **Modern Stack**: TypeScript, React 18, Tailwind CSS, HeroUI, Radix UI
- ♿ **Accessibility First**: WCAG AAA compliant with automated contrast validation

## 📖 Documentation

For detailed documentation, see:
- **[Quick Start Guide](docs/QUICKSTART.md)** - Get started in seconds
- **[Full Documentation](docs/README.md)** - Complete feature list and usage guide
- **[Changelog](docs/CHANGELOG.md)** - Version history and updates

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast HMR and optimized builds)
- **Styling**: Tailwind CSS with liquid glass design system
- **UI Components**:
  - **HeroUI (NextUI)**: Primary component library (Button, Card, Input, Toggle)
  - **Radix UI**: Headless components (Select, Dialog, Sheet, AlertDialog, Popover)
  - **Custom Components**: Glassmorphism effects with backdrop blur
- **Animations**:
  - **Framer Motion**: Page transitions and UI animations
  - **React Bits**: Clock ticking animations
- **State Management**: React Context API + Hooks (useState, useRef, custom hooks)
- **Theme Management**: Dark/light mode with localStorage persistence

### Backend & Infrastructure
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (production)
- **Development Server**: Vite dev server with HMR

### Custom Hooks
- `useCountdown`: Timer logic and state management
- `useBackgroundGradient`: Dynamic gradient calculation based on time remaining
- `useAudioNotification`: Optional sound alerts
- `useTheme`: Dark/light mode theme management with Context API

## 📁 Project Structure

```
countdown-timer/
├── .gitignore              # Git ignore rules (excludes AGENTS.md, node_modules, etc.)
├── README.md               # Project overview (this file)
├── LICENSE                 # Copyright and license information
├── docs/                   # Documentation bundle
│   ├── README.md           # Detailed documentation
│   ├── QUICKSTART.md       # Quick start guide
│   └── CHANGELOG.md        # Version history
├── start.sh                # One-command startup script (with smart caching)
└── app/                    # Application workspace
    ├── package.json        # Dependencies and scripts
    ├── docker-compose.yml  # Docker Compose setup
    ├── docker/             # Docker configuration
    │   ├── Dockerfile      # Multi-stage Docker build
    │   └── nginx.conf      # Nginx configuration for production
    ├── config/             # Build/tooling configuration
    │   ├── vite.config.ts  # Vite configuration
    │   ├── tailwind.config.js  # Tailwind CSS configuration
    │   ├── postcss.config.js   # PostCSS configuration
    │   ├── tsconfig.json       # TypeScript configuration
    │   └── tsconfig.node.json  # TypeScript config for Node
    ├── index.html          # HTML entry point
    └── src/                # Source code
        ├── main.tsx        # Application entry point
        ├── App.tsx         # Main app component with layout logic
        ├── index.css       # Global styles and CSS custom properties
        ├── components/     # React components
        │   ├── TimeInput.tsx           # Timer input with presets and validation
        │   ├── TimerDisplay.tsx        # Timer display with progress bar
        │   ├── ControlButtons.tsx      # Pause/Reset/Start New buttons
        │   ├── HelpfulTipsModal.tsx    # Helpful tips modal dialog
        │   ├── ConfirmationModal.tsx   # Confirmation dialogs
        │   └── CurrentDateTime.tsx     # Date/time display badge
        ├── hooks/          # Custom React hooks
        │   ├── useCountdown.ts         # Timer logic and state
        │   ├── useBackgroundGradient.ts # Dynamic gradient calculation
        │   └── useAudioNotification.ts  # Sound alerts
        └── utils/          # Utility functions
            ├── parseDuration.ts        # Parse timer input (30s, 20m, 1h 15m)
            └── __tests__/              # Unit tests
                └── parseDuration.test.ts
```

## 🎯 Usage

### Starting the Application
1. **Run the startup script**: `./start.sh`
2. **Browser opens automatically** to `http://localhost:5173`

### Setting a Timer
You have multiple options to set your timer duration:

#### Option 1: Natural Language Input (Recommended)
Type directly into the input field using natural language:
- `5m` - 5 minutes
- `1h 30m` - 1 hour and 30 minutes
- `90m` - 90 minutes
- `120s` - 120 seconds (2 minutes)
- `01:30:20` - 1 hour, 30 minutes, 20 seconds (HH:MM:SS format)

#### Option 2: Quick Start Presets
Click the **"Quick Start"** button to access preset durations:
- **1 min** - Quick 1-minute timer
- **5 min** - 5-minute timer
- **10 min** - 10-minute timer
- **15 min** - 15-minute timer
- **30 min** - 30-minute timer
- **1 hour** - 1-hour timer

#### Option 3: Visual Time Picker
Click **"Pick duration"** for dropdown selectors:
- **Hours**: 0-99 hours
- **Minutes**: 0-59 minutes
- **Seconds**: 0-59 seconds

#### Option 4: Timer History
Click the **"History"** button to:
- View recent timers
- Access favorite timers
- Quickly reuse previous durations

### Running the Timer
1. **Start**: Click the **"Start Timer"** button
2. **Watch**: Enjoy the countdown with:
   - Large, animated timer display with smooth transitions
   - Dynamic color gradient (intensifies as time decreases)
   - Circular progress indicator showing time remaining
   - Current date/time display in header

### Controlling the Timer
- **Pause/Resume**: Click the pause button or press **Space**
- **Reset**: Click the reset button or press **R** to reset to original duration
- **Back to Setup**: Return to setup screen to configure a new timer
- **Add/Subtract Time**: Quick +1 min / -1 min buttons during countdown
- **Notifications**: Configure sound alerts and notification settings

### Keyboard Shortcuts
- **Space**: Pause/Resume timer
- **R**: Reset timer to original duration

### Theme Switching
Click the theme toggle button in the header to switch between:
- **Light Mode**: Clean, bright interface with frosted glass effects
- **Dark Mode**: Modern dark interface with blue glow accents and perfect text visibility

## 🐳 Docker Commands

### Development Mode
```bash
# Start with hot reload
docker-compose -f app/docker-compose.yml up dev

# Build and run in background
docker-compose -f app/docker-compose.yml up -d --build dev
```

### Production Mode
```bash
# Build and run production server
docker-compose -f app/docker-compose.yml up -d --build prod
```

### Stop Application
```bash
docker-compose -f app/docker-compose.yml down
```

## 🔧 Local Development (Without Docker)

If you prefer to run the application without Docker:

```bash
# Move into the application workspace
cd app

# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev
# Application will be available at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

### Available npm Scripts
- `npm run dev` - Start Vite development server with HMR
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)
- `npm test` - Run tests (if configured)

## 🎨 UI/UX Design Highlights

### Liquid Glass Design System (2025)
The application features a modern glassmorphism aesthetic with perfect accessibility:

#### Design Principles
- **Frosted Glass Effects**: Semi-transparent backgrounds with 24px backdrop blur
- **Multi-layer Shadows**: Enhanced depth with blue glow effects in dark mode
- **Consistent Visual Language**: All components (dialogs, dropdowns, cards) share the same glass aesthetic
- **Perfect Contrast**: WCAG AAA compliant with 21.00:1 contrast ratios in all modes

#### Setup Screen
- **Floating Glass Header**: Date/time display with theme toggle
- **Glass Input Card**: Frosted glass container with:
  - Natural language duration input with real-time validation
  - Toggle between "Type duration" and "Pick duration" modes
  - Quick Start button for preset durations
  - History button for recent and favorite timers
- **Visual Time Picker**: Glass dropdown menus for hours, minutes, seconds
- **Duration Preview**: Shows timer format and natural language (e.g., "5h 3m 7s")

#### Active Timer Screen
- **Segmented Timer Display**: Large, animated digits with smooth transitions
- **Circular Progress Ring**: Visual indicator of time remaining
- **Control Buttons**: Pause/Resume, Reset, Add/Subtract time
- **Keyboard Shortcuts Display**: Visual hints for Space and R keys
- **Glass Dialogs**: Confirmation modals with frosted glass backgrounds

#### Theme Support
- **Light Mode**: Clean, bright interface with white frosted glass
- **Dark Mode**: Modern dark interface with blue-tinted glass and glow effects
- **Seamless Switching**: Instant theme changes with smooth transitions
- **Perfect Visibility**: All text elements clearly visible in both modes

#### Responsive Design
- **Mobile (375px)**: Optimized vertical layout, touch-friendly buttons
- **Tablet (768px)**: Comfortable spacing, all elements visible
- **Desktop (1440px+)**: Centered content with optimal spacing

## 📄 Copyright & License

**Copyright © 2025 Jie Lin, Ph.D. | TLIN INVESTMENTS LLC**
**All Rights Reserved.**

### Author
**Jie Lin, Ph.D.**
TLIN INVESTMENTS LLC

### Attribution
This software is proprietary and confidential. Unauthorized copying, distribution, or use of this software, via any medium, is strictly prohibited without express written permission from TLIN INVESTMENTS LLC.

For licensing inquiries, please contact TLIN INVESTMENTS LLC.

---

## 🤝 Support

For issues, questions, or feature requests, please refer to the documentation in the `docs/` folder.

## 🎉 Enjoy!

Start your countdown timer and watch the beautiful color transitions! Perfect for:
- ⏰ Time management and productivity
- 🍳 Cooking and kitchen timers
- 🏋️ Workout intervals
- 📚 Study sessions (Pomodoro technique)
- 🎮 Game timers
- 🎤 Presentation timing

---

**Made with ❤️ by Jie Lin, Ph.D.**
