import Foundation
import Combine

class SettingsService: ObservableObject {
    @Published var settings: AppSettings
    
    private let userDefaults = UserDefaults.standard
    private let settingsKey = "appSettings"
    
    init() {
        self.settings = loadSettings()
    }
    
    private func loadSettings() -> AppSettings {
        guard let data = userDefaults.data(forKey: settingsKey),
              let settings = try? JSONDecoder().decode(AppSettings.self, from: data) else {
            return AppSettings.default
        }
        return settings
    }
    
    func saveSettings() {
        if let data = try? JSONEncoder().encode(settings) {
            userDefaults.set(data, forKey: settingsKey)
        }
    }
    
    struct AppSettings: Codable {
        var prefersDarkMode: Bool
        var frameRate: Int
        var audioReactive: Bool
        var hapticFeedback: Bool
        var graphicsQuality: GraphicsQuality
        var analyticsEnabled: Bool
        
        static var `default`: AppSettings {
            AppSettings(
                prefersDarkMode: true,
                frameRate: 60,
                audioReactive: true,
                hapticFeedback: true,
                graphicsQuality: .high,
                analyticsEnabled: true
            )
        }
    }
    
    enum GraphicsQuality: String, Codable {
        case low, medium, high, ultra
    }
}