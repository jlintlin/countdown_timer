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

## ✨ Features

### Core Timer Features
- 🎨 **Dynamic Color Gradient**: Background intensifies from cool to warm tones (green → yellow → orange → red) as time decreases
- ⏱️ **Large Timer Display**: Easy-to-read display with smooth clock animations powered by React Bits
- 📝 **Flexible Input Options**:
  - **Shorthand Support**: Enter durations like `30s`, `20m`, `1h 15m`, or `2h 30m 45s`
  - **Plain Numbers**: Simple numbers default to minutes (e.g., `45` = 45 minutes)
  - **Quick Presets**: One-click buttons for common durations (30s, 20m, 1h 20m, 45m)
  - **Time Picker**: Visual picker for hours, minutes, and seconds
- 🎯 **Smart Validation**: Real-time input validation with helpful error messages
- 💡 **Helpful Tips Modal**: Contextual help accessible via "?" icon in top-right corner
- 📊 **Progress Bar**: Fixed cyan progress bar with high contrast against all background colors
- ⏸️ **Full Control**: Pause, resume, and reset functionality with confirmation modals
- 🔔 **Audio Notification**: Optional sound alert when timer completes

### UI/UX Design
- 🎨 **Centered Layout**: Clean, centered design on both initial and timer running pages
- 📐 **Vertical Stack Layout**: All input elements vertically stacked for better usability
- 🎨 **Color-Coded Controls**: Distinct button colors for easy identification:
  - **Blue**: Pause/Resume
  - **Orange**: Reset
  - **Green**: Start New Timer
- 📱 **Fully Responsive**: Optimized for mobile (375px), tablet (768px), and desktop (1440px+)
- 🎭 **Smooth Animations**: Powered by Framer Motion for polished transitions
- ♿ **Accessible**: WCAG AA compliant with proper ARIA labels and keyboard navigation

### Developer Experience
- ⚡ **Fast Development**: Built with Vite for instant hot module replacement
- 🐳 **Docker Ready**: Consistent environment, easy deployment
- 🔌 **Dynamic Port Selection**: Automatically finds available ports to avoid conflicts
- 🚀 **Smart Image Caching**: Intelligent Docker image versioning skips unnecessary rebuilds
- 🛑 **Clean Shutdown**: Proper signal handling ensures containers stop completely
- 📦 **Modern Stack**: TypeScript, React 18, Tailwind CSS, HeroUI

## 📖 Documentation

For detailed documentation, see:
- **[Quick Start Guide](docs/QUICKSTART.md)** - Get started in seconds
- **[Full Documentation](docs/README.md)** - Complete feature list and usage guide
- **[Changelog](docs/CHANGELOG.md)** - Version history and updates

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast HMR and optimized builds)
- **Styling**: Tailwind CSS with custom design system
- **UI Components**:
  - **HeroUI (NextUI)**: Primary component library (Modal, Button, Card, Input)
  - **DaisyUI**: Fallback components
- **Animations**:
  - **Framer Motion**: Page transitions and UI animations
  - **React Bits**: Clock ticking animations
- **State Management**: React Hooks (useState, useRef, custom hooks)
- **Focus Management**: react-focus-lock

### Backend & Infrastructure
- **Containerization**: Docker + Docker Compose
- **Web Server**: Nginx (production)
- **Development Server**: Vite dev server with HMR

### Custom Hooks
- `useCountdown`: Timer logic and state management
- `useBackgroundGradient`: Dynamic gradient calculation based on time remaining
- `useAudioNotification`: Optional sound alerts

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

#### Option 1: Shorthand Input (Recommended)
Type directly into the input field using shorthand notation:
- `30s` - 30 seconds
- `20m` - 20 minutes
- `1h 15m` - 1 hour and 15 minutes
- `2h 30m 45s` - 2 hours, 30 minutes, and 45 seconds
- `45` - Plain numbers default to minutes (45 minutes)

#### Option 2: Quick Presets
Click one of the preset buttons:
- **30s** - Quick 30-second timer
- **20m** - 20-minute timer
- **1h 20m** - 1 hour 20 minutes
- **45** - 45 minutes

#### Option 3: Time Picker
Click **"Open time picker"** for a visual interface to select hours, minutes, and seconds.

### Running the Timer
1. **Start**: Click the **"Start Timer"** button (blue gradient)
2. **Watch**: Enjoy the countdown with:
   - Large, animated timer display
   - Dynamic color gradient (intensifies as time decreases)
   - Cyan progress bar showing time remaining
   - Current date/time display

### Controlling the Timer
- **Pause** (Blue button): Pause the countdown
- **Resume** (Blue button): Resume from paused state
- **Reset** (Orange button): Reset timer to original duration
- **Start New Timer** (Green button): Stop current timer and set a new one

### Getting Help
Click the **"?"** icon in the top-right corner of the input card for helpful tips about timer input formats.

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

### Recent Redesign (2025)
The application features a modern, centered layout with improved usability:

#### Initial Page (Timer Setup)
- **Centered Layout**: All content horizontally centered for visual balance
- **Vertical Stack**: Input elements arranged vertically for better flow:
  1. "Enter timer duration" label (centered)
  2. Input text box (full width)
  3. Quick Presets section (full width)
  4. "Open time picker" button (centered)
  5. "Start Timer" button (centered)
- **Helpful Tips**: "?" icon in top-right corner opens modal with usage tips
- **Real-time Validation**: Instant feedback with color-coded input states

#### Timer Running Page
- **Centered Timer Display**: Large, easy-to-read countdown with smooth animations
- **Horizontal Control Buttons**: Three buttons in a row below timer:
  - **Pause/Resume** (Blue) - Easy to identify
  - **Reset** (Orange) - Distinct warning color
  - **Start New Timer** (Green) - Clear action color
- **Fixed Cyan Progress Bar**: High contrast against all background gradients
- **Always-Visible Date/Time**: Current date and time displayed in header

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
