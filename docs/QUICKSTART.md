# ⚡ Quick Start Guide

## Start the Application (One Command!)

```bash
./start.sh
```

That's it! The script will:
1. ✅ Check Docker is running
2. ✅ Clean up old containers
3. ✅ Build and start the app
4. ✅ Open your browser automatically
5. ✅ Show you the countdown timer at `http://localhost:5173`

## Stop the Application

Press `Ctrl+C` in the terminal where the script is running.

Or manually:
```bash
docker-compose -f app/docker-compose.yml down
```

## What You'll See

1. **Beautiful Input Form**: Enter minutes (e.g., 15, 80, 200)
2. **Start Timer**: Click the blue "🚀 Start Timer" button
3. **Watch the Magic**:
   - Large, animated countdown display
   - Background color gradually changes from green → yellow → orange → red
   - Progress bar shows time remaining
   - Smooth animations on every second
4. **Controls**: Pause, Resume, or Reset anytime

## Features

- 🎨 **Dynamic Color Gradient**: Background changes based on time remaining
- ⏱️ **Large Timer Display**: Easy to read from across the room
- 🎭 **Beautiful Animations**: Smooth digit transitions and effects
- 📱 **Responsive**: Works on phone, tablet, and desktop
- ⚡ **Fast**: Built with Vite for instant hot reload
- 🐳 **Docker**: Consistent environment, easy deployment

## Troubleshooting

**Docker not running?**
```
❌ Error: Docker is not running. Please start Docker first.
```
→ Start Docker Desktop and try again

**Port already in use?**
```
Error: port 5173 is already allocated
```
→ Stop other services on port 5173 or change the port in `docker-compose.yml`

**Browser didn't open?**
→ Manually open `http://localhost:5173` in your browser

## Need Help?

Check the full README.md for detailed documentation.
