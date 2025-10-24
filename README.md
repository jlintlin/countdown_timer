# ⏱️ Countdown Timer Application

A beautiful, animated countdown timer built with React, Vite, and modern UI libraries. Features a dynamic color gradient that transitions from green to red as time decreases.

![Countdown Timer](https://img.shields.io/badge/Status-Ready-brightgreen) ![Docker](https://img.shields.io/badge/Docker-Ready-blue) ![React](https://img.shields.io/badge/React-18-61dafb)

## 🚀 Quick Start

Simply run the startup script:

```bash
./start.sh
```

This will:
- ✅ Check if Docker is running
- ✅ Clean up any existing containers
- ✅ Build and start the application
- ✅ Automatically detect an available port
- ✅ Open your browser to the application

**That's it!** The countdown timer will be running and ready to use.

## ✨ Features

- 🎨 **Dynamic Color Gradient**: Background changes from green → yellow → orange → red as time decreases
- ⏱️ **Large Timer Display**: Easy to read from across the room with smooth animations
- 🎭 **Beautiful Animations**: Smooth digit transitions powered by Framer Motion
- 📱 **Responsive Design**: Works perfectly on phone, tablet, and desktop
- ⚡ **Fast Development**: Built with Vite for instant hot reload
- 🐳 **Docker Ready**: Consistent environment, easy deployment
- 🔌 **Dynamic Port Selection**: Automatically finds available ports to avoid conflicts
- 🚀 **Smart Image Caching**: Intelligent Docker image versioning skips unnecessary rebuilds
- 🛑 **Clean Shutdown**: Proper signal handling ensures containers stop completely before returning terminal control

## 📖 Documentation

For detailed documentation, see:
- **[Quick Start Guide](docs/QUICKSTART.md)** - Get started in seconds
- **[Full Documentation](docs/README.md)** - Complete feature list and usage guide

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: HeroUI (NextUI) + DaisyUI
- **Animations**: Framer Motion
- **Containerization**: Docker + Docker Compose

## 📁 Project Structure

```
countdown-timer/
├── AGENTS.md               # Spec-driven workflow instructions
├── README.md               # Project overview (this file)
├── docs/                   # Documentation bundle
│   ├── README.md           # Detailed documentation
│   └── QUICKSTART.md       # Quick start guide
├── start.sh                # One-command startup script (with smart caching)
└── app/                    # Application workspace (everything else lives here)
    ├── package.json        # Dependencies and scripts
    ├── docker-compose.yml  # Docker Compose setup
    ├── docker/             # Docker configuration (Dockerfile, nginx.conf, cache file)
    ├── config/             # Build/tooling configuration (Vite, Tailwind, PostCSS, TS)
    ├── public/             # Static assets
    └── src/                # Source code (components, hooks, App.tsx, main.tsx, etc.)
```

## 🎯 Usage

1. **Start the application**: `./start.sh`
2. **Enter minutes**: Type a duration (e.g., 15, 80, 200)
3. **Start timer**: Click the "🚀 Start Timer" button
4. **Watch the magic**: Enjoy the countdown with beautiful color transitions
5. **Control**: Use Pause, Resume, or Reset buttons as needed

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

```bash
# Move into the application workspace
cd app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

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
