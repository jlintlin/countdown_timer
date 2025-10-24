# ⏱️ Countdown Timer Application

A beautiful, animated countdown timer built with React, Vite, and modern UI libraries. Features a dynamic color gradient that transitions from green to red as time decreases.

![Countdown Timer](https://img.shields.io/badge/Status-Ready-brightgreen) ![Docker](https://img.shields.io/badge/Docker-Ready-blue) ![React](https://img.shields.io/badge/React-18-61dafb)

## ✨ Features

- 🎨 **Dynamic Color Gradient**: Background smoothly transitions from green (full time) to red (time's up)
- ⏱️ **Flexible Timer**: Set any duration from 1 to 1440 minutes (24 hours)
- 🎭 **Beautiful Animations**: Smooth transitions and digit animations using Framer Motion
- 📱 **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- ⏯️ **Full Control**: Start, pause, resume, and reset functionality
- 🐳 **Docker Ready**: Containerized for easy deployment and development

## 🚀 Quick Start

### One-Command Startup (Easiest!)

Simply run the startup script:

```bash
./start.sh
```

This will:
- ✅ Check if Docker is running
- ✅ Clean up any existing containers
- ✅ Build and start the application
- ✅ Open the app at `http://localhost:5173`

**That's it!** The countdown timer will be running and ready to use.

### Using Docker (Manual)

#### Development Mode
```bash
# Start the development server with hot reload
docker-compose -f app/docker-compose.yml up dev

# Or build and run in detached mode
docker-compose -f app/docker-compose.yml up -d --build dev
```

The application will be available at `http://localhost:5173`

#### Production Mode
```bash
# Build and run production version
docker-compose -f app/docker-compose.yml up -d --build prod
```

The application will be available at `http://localhost:8080`

### Local Development (without Docker)

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

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: HeroUI (NextUI) + DaisyUI
- **Animations**: Framer Motion
- **Containerization**: Docker + Docker Compose

## 📁 Project Structure

```
countdown-timer/
├── AGENTS.md               # Spec-driven workflow instructions
├── README.md               # Project overview
├── docs/                   # Additional documentation
│   ├── README.md           # Detailed documentation (this file)
│   └── QUICKSTART.md       # Quick start guide
├── start.sh                # One-command startup script
└── app/                    # Application workspace
    ├── package.json        # Dependencies and scripts
    ├── docker-compose.yml  # Docker Compose configuration
    ├── docker/             # Docker assets (Dockerfile, nginx.conf, cache helper)
    ├── config/             # Build/tooling configuration (Vite, Tailwind, PostCSS, TS)
    ├── public/             # Static assets
    └── src/                # React source code (components, hooks, App.tsx, etc.)
```

## 🎨 How It Works

1. **Enter Duration**: Input the desired countdown time in minutes
2. **Start Timer**: Click "Start Timer" to begin the countdown
3. **Watch the Magic**: 
   - The timer counts down in real-time
   - Background color gradually shifts from green → yellow → orange → red
   - Smooth animations on digit changes
   - Pulse effect when time is running low (< 10%)
4. **Control**: Use pause/resume/reset buttons as needed

## 🎯 Color Gradient Logic

The background color is calculated using HSL color space:
- **100% time remaining**: Green (HSL: 120°)
- **50% time remaining**: Yellow (HSL: 60°)
- **0% time remaining**: Red (HSL: 0°)

The gradient smoothly interpolates between these values, with increased saturation and slightly darker lightness as time decreases for a more dramatic effect.

## 🔧 Configuration

### Vite Configuration
The Vite server is configured to:
- Listen on `0.0.0.0` for Docker compatibility
- Use port `5173`
- Enable polling for file watching in Docker

### Docker Configuration
- **Development**: Hot reload enabled with volume mounts
- **Production**: Optimized build served with Nginx
- **Ports**: 5173 (dev), 8080 (prod)

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🐳 Docker Commands

```bash
# Development
docker-compose -f app/docker-compose.yml up dev                 # Start dev server
docker-compose -f app/docker-compose.yml up -d --build dev      # Build and start in background
docker-compose -f app/docker-compose.yml logs -f dev            # View logs

# Production
docker-compose -f app/docker-compose.yml up -d --build prod     # Build and start production
docker-compose -f app/docker-compose.yml down                   # Stop all containers

# Individual Docker commands
cd app && docker build -t countdown-timer .                     # Build image
docker run -p 5173:5173 countdown-timer                         # Run container
```

## 🌟 Features in Detail

### Animations
- **Entrance animations**: Smooth fade-in and slide effects
- **Digit transitions**: Individual digit animations on time change
- **Pulse effect**: Urgent pulsing when time is running low
- **Progress bar**: Visual representation of time remaining

### Responsive Design
- Mobile-first approach
- Adaptive font sizes
- Touch-friendly controls
- Optimized for all screen sizes

### User Experience
- Clear error messages for invalid input
- Visual feedback on all interactions
- Smooth color transitions (1 second duration)
- Accessible and intuitive interface

## 📄 License

MIT License - feel free to use this project for any purpose!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Built with ❤️ using React, Vite, and modern web technologies
