# Prompt Atlas

A comprehensive iOS application featuring real-time Metal rendering, audio-reactive visualizations, haptic integration, and a complete prompt exploration system.

## Features

### 🎨 Visual Experience
- **Real-time Metal Rendering**: Custom shaders for each chapter theme
- **Audio-Reactive Visualizations**: Dynamic graphics that respond to microphone input
- **Thematic Visual Design**: 8 distinct visual themes (Profits, Ecology, Mirror, Carnival, Wonder, etc.)
- **Smooth Animations**: 60-120 FPS performance with Metal acceleration

### 🔊 Audio & Haptics
- **Audio Engine**: Real-time audio capture and analysis
- **Haptic Feedback**: Custom haptic patterns for different interactions
- **Audio Visualization**: Visual feedback based on audio levels
- **Immersive Experience**: Full sensory engagement during exercises

### 📚 Content System
- **Chapter-Based Learning**: 5 comprehensive chapters with unique themes
- **Daily Prompts**: Rotating daily reflection prompts
- **Interactive Exercises**: 7 different exercise types (journaling, meditation, visualization, etc.)
- **Progress Tracking**: Complete progress monitoring and journal system

### 🏗️ Architecture
- **SwiftUI + Combine**: Modern declarative UI with reactive programming
- **MVVM Pattern**: Clean separation of concerns
- **Metal Integration**: Custom rendering pipeline
- **Local Data Storage**: Secure journal entries and settings

## Project Structure

```
PromptAtlas/
├── Configuration/           # App configuration files
│   ├── Info.plist
│   └── PromptAtlas.entitlements
├── Source/                 # Main source code
│   ├── Application/       # App entry point and configuration
│   ├── Core/              # Core functionality
│   │   ├── Metal/        # Metal rendering engine
│   │   └── Audio/        # Audio and haptic systems
│   ├── Domain/           # Business logic and models
│   ├── Services/         # Data services and repositories
│   ├── Presentation/     # UI and view models
│   └── Utilities/        # Helper classes and extensions
├── Resources/            # Assets and data files
│   ├── chapters.json     # Chapter content
│   └── all_prompts.json  # Daily prompts database
└── Build/               # Build configurations
```

## Key Technologies

- **Swift 5.0**: Modern Swift language features
- **SwiftUI**: Declarative user interface framework
- **Metal**: High-performance graphics rendering
- **Combine**: Reactive programming framework
- **Core Haptics**: Advanced haptic feedback
- **AVFoundation**: Audio processing and capture
- **Accelerate**: High-performance mathematical computations

## Getting Started

### Prerequisites
- Xcode 14.0 or later
- iOS 15.0 or later
- Swift 5.0 or later
- Metal-capable device

### Installation
1. Clone the repository
2. Open `PromptAtlas.xcodeproj` in Xcode
3. Select your development team in the project settings
4. Build and run on a physical device (Metal features require hardware)

### Configuration
1. Update `DEVELOPMENT_TEAM` in build configurations
2. Configure app capabilities (Microphone, Haptics, etc.)
3. Customize app settings in `AppConfiguration.swift`

## Chapter Overview

### Chapter 1: Profits & Purpose
- Theme: Business and meaningful impact
- Visual: Gold and wealth-inspired shaders
- Focus: Aligning financial success with purpose

### Chapter 2: Ecology of Ideas
- Theme: Innovation and creative ecosystems
- Visual: Organic, nature-inspired patterns
- Focus: How ideas spread and evolve

### Chapter 7: Mirror of Self
- Theme: Self-reflection and transformation
- Visual: Mirror-like distortions and reflections
- Focus: Identity and personal growth

### Chapter 13: Carnival of Ideas
- Theme: Creativity and chaos
- Visual: Festive, dynamic patterns
- Focus: Embracing creative chaos

### Chapter 14: Wonder & Awe
- Theme: Curiosity and transcendent thinking
- Visual: Ethereal, cosmic patterns
- Focus: Cultivating wonder and curiosity

## Exercise Types

1. **Journaling**: Written reflection exercises
2. **Meditation**: Mindfulness and visualization practices
3. **Archetype Quiz**: Personality and role exploration
4. **Festival Design**: Creative event planning
5. **Mirror Reflection**: Self-observation practices
6. **Visualization**: Mental imagery exercises
7. **Movement**: Physical expression activities

## Development Guidelines

### Code Style
- Follow Swift API Design Guidelines
- Use descriptive variable and function names
- Document complex algorithms and business logic
- Maintain consistent indentation and formatting

### Performance
- Profile Metal shaders for GPU performance
- Optimize audio processing for low latency
- Use lazy loading for large datasets
- Implement efficient memory management

### Testing
- Write unit tests for business logic
- Test Metal rendering on multiple devices
- Validate audio/haptic feedback across devices
- Ensure accessibility compliance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add appropriate tests
5. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For questions, issues, or contributions, please open an issue in the repository or contact the development team.

---

**Prompt Atlas** - Navigate Questions • Reflect Yourself