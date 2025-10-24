# Changelog

## Version 1.1.0 - 2025-10-01

### 🎉 Major Improvements

#### 1. Copyright & Attribution
- ✅ Added copyright footer to application UI
- ✅ Added copyright headers to all source files
- ✅ Updated README with full copyright section
- ✅ Copyright: © 2025 Jie Lin, Ph.D. | TLIN INVESTMENTS LLC

#### 2. UI Consistency - Rounded Corners
- ✅ Standardized border-radius to `rounded-2xl` and `rounded-3xl` across all components
- ✅ Updated Start Timer button with consistent rounded corners
- ✅ Updated text input box with matching rounded corners
- ✅ Updated all cards and containers with consistent rounded corners
- ✅ Updated control buttons (Pause, Resume, Reset) with matching style
- ✅ Updated progress bar with rounded corners
- ✅ Updated timer display card with rounded corners

#### 3. Dynamic Port Selection
- ✅ Modified Vite configuration to automatically find available ports
- ✅ Set `strictPort: false` to allow port fallback
- ✅ Updated docker-compose.yml to support port range (5173-5183)
- ✅ Enhanced start.sh script to:
  - Detect the actual port being used by the application
  - Display the correct URL with the dynamically assigned port
  - Open the browser with the correct dynamic port
- ✅ Application now starts successfully even if port 5173 is occupied

#### 4. Project Structure Reorganization
- ✅ Created `docs/` folder for documentation
  - Moved README.md to docs/README.md
  - Moved QUICKSTART.md to docs/QUICKSTART.md
  - Created new root README.md with quick start info
- ✅ Created `config/` folder for configuration files
  - Moved vite.config.ts to config/
  - Moved tailwind.config.js to config/
  - Moved postcss.config.js to config/
  - Moved tsconfig.json to config/
  - Moved tsconfig.node.json to config/
- ✅ Updated all file references and imports
- ✅ Updated package.json scripts to reference new config locations
- ✅ Updated Dockerfile to copy config folder
- ✅ Updated docker-compose.yml to mount config folder

### 📁 New Project Structure

```
countdown-timer/
├── start.sh                 # One-command startup script (parent directory)
├── package.json            # Dependencies
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
├── README.md               # Quick start guide (root)
├── docs/                   # Documentation folder
│   ├── README.md          # Detailed documentation
│   ├── QUICKSTART.md      # Quick start guide
│   └── CHANGELOG.md       # This file
├── config/                 # Configuration folder
│   ├── vite.config.ts     # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   ├── postcss.config.js  # PostCSS configuration
│   ├── tsconfig.json      # TypeScript configuration
│   └── tsconfig.node.json # TypeScript Node configuration
└── src/                    # Source code
    ├── components/        # React components
    ├── hooks/            # Custom React hooks
    ├── App.tsx           # Main application
    └── main.tsx          # Entry point
```

### 🔧 Technical Changes

#### Configuration Updates
- **vite.config.ts**: Added `strictPort: false` for dynamic port selection
- **tailwind.config.js**: Updated content paths to reference parent directory
- **package.json**: Updated scripts to reference config folder
- **docker-compose.yml**: Updated volume mounts to include config folder
- **Dockerfile**: Updated to copy config folder and expose port range

#### Source Code Updates
- **App.tsx**: Added copyright footer component
- **TimeInput.tsx**: Added `rounded-2xl` to input wrapper and button
- **TimerDisplay.tsx**: Added `rounded-2xl` to progress bar
- **ControlButtons.tsx**: Added `rounded-2xl` to all buttons
- **All source files**: Added copyright header comments

#### Script Updates
- **start.sh**: Enhanced with:
  - Copyright notice in output
  - Dynamic port detection from Docker logs
  - Automatic browser opening with detected port
  - Better error handling and status messages

### 🎨 UI Improvements

- **Consistent Rounded Corners**: All interactive elements now use `rounded-2xl` (16px) or `rounded-3xl` (24px)
- **Copyright Footer**: Elegant footer with glass-morphism effect displaying copyright information
- **Better Visual Hierarchy**: Consistent styling creates a more professional appearance

### 🚀 User Experience Improvements

- **No More Port Conflicts**: Application automatically finds an available port
- **Clearer Startup**: Script shows copyright and better status messages
- **Better Organization**: Cleaner project structure with logical file organization
- **Professional Attribution**: Clear copyright and authorship throughout

### 📝 Documentation Updates

- **README.md**: New root README with quick start instructions
- **docs/README.md**: Comprehensive documentation with all features
- **docs/QUICKSTART.md**: Quick reference guide
- **docs/CHANGELOG.md**: This changelog documenting all changes

### 🔒 Legal & Attribution

All files now include proper copyright notices:
```
/**
 * Countdown Timer Application
 * Author: Jie Lin, Ph.D.
 * Copyright © 2025 TLIN INVESTMENTS LLC
 * All Rights Reserved.
 */
```

### 🎯 Next Steps

The application is now production-ready with:
- ✅ Professional copyright and attribution
- ✅ Consistent, beautiful UI design
- ✅ Robust port handling
- ✅ Clean, organized project structure
- ✅ Comprehensive documentation

---

**Author**: Jie Lin, Ph.D.  
**Copyright**: © 2025 TLIN INVESTMENTS LLC  
**All Rights Reserved**

