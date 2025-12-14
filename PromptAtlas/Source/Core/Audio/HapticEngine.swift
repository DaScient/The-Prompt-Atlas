import CoreHaptics
import Combine

class HapticEngine: ObservableObject {
    @Published var isEnabled = true
    @Published var currentIntensity: Float = 0.0
    
    private var hapticEngine: CHHapticEngine?
    private var player: CHHapticPatternPlayer?
    private var supportsHaptics = false
    
    init() {
        setupHaptics()
    }
    
    private func setupHaptics() {
        guard CHHapticEngine.capabilitiesForHardware().supportsHaptics else {
            supportsHaptics = false
            return
        }
        
        supportsHaptics = true
        
        do {
            hapticEngine = try CHHapticEngine()
            try hapticEngine?.start()
            
            // Handle engine reset
            hapticEngine?.resetHandler = { [weak self] in
                do {
                    try self?.hapticEngine?.start()
                } catch {
                    print("❌ Failed to restart haptic engine: \(error)")
                }
            }
        } catch {
            print("❌ Failed to create haptic engine: \(error)")
        }
    }
    
    func playIntensity(_ intensity: Float) {
        guard supportsHaptics, isEnabled, intensity > 0.1 else { return }
        
        currentIntensity = intensity
        
        let sharpness = CHHapticEventParameter(parameterID: .hapticSharpness, value: intensity)
        let event = CHHapticEvent(eventType: .hapticContinuous, parameters: [sharpness], relativeTime: 0, duration: 0.1)
        
        do {
            let pattern = try CHHapticPattern(events: [event], parameters: [])
            player = try hapticEngine?.makePlayer(with: pattern)
            try player?.start(atTime: CHHapticTimeImmediate)
        } catch {
            print("❌ Failed to play haptic: \(error)")
        }
    }
    
    func playPattern(_ pattern: HapticPattern) {
        guard supportsHaptics, isEnabled else { return }
        
        do {
            let events = pattern.events.map { event -> CHHapticEvent in
                let intensity = CHHapticEventParameter(parameterID: .hapticIntensity, value: event.intensity)
                let sharpness = CHHapticEventParameter(parameterID: .hapticSharpness, value: event.sharpness)
                return CHHapticEvent(eventType: event.type, parameters: [intensity, sharpness], relativeTime: event.time, duration: event.duration)
            }
            
            let pattern = try CHHapticPattern(events: events, parameters: [])
            player = try hapticEngine?.makePlayer(with: pattern)
            try player?.start(atTime: CHHapticTimeImmediate)
        } catch {
            print("❌ Failed to play haptic pattern: \(error)")
        }
    }
    
    struct HapticPattern {
        let events: [Event]
        
        struct Event {
            let type: CHHapticEvent.EventType
            let intensity: Float
            let sharpness: Float
            let time: TimeInterval
            let duration: TimeInterval
            
            init(type: CHHapticEvent.EventType = .hapticTransient, intensity: Float, sharpness: Float, time: TimeInterval = 0, duration: TimeInterval = 0.1) {
                self.type = type
                self.intensity = intensity
                self.sharpness = sharpness
                self.time = time
                self.duration = duration
            }
        }
        
        static let discovery = HapticPattern(events: [
            Event(intensity: 0.6, sharpness: 0.8, time: 0.0),
            Event(intensity: 0.4, sharpness: 0.6, time: 0.1)
        ])
        
        static let breakthrough = HapticPattern(events: [
            Event(intensity: 1.0, sharpness: 1.0, time: 0.0, duration: 0.3),
            Event(intensity: 0.3, sharpness: 0.4, time: 0.2)
        ])
        
        static let reflection = HapticPattern(events: [
            Event(type: .hapticContinuous, intensity: 0.2, sharpness: 0.1, time: 0.0, duration: 0.5)
        ])
    }
}