import Foundation
import Combine

class AppConfiguration: ObservableObject {
    @Published var preferredFrameRate: Int = 60
    @Published var audioReactiveEnabled: Bool = true
    @Published var hapticFeedbackEnabled: Bool = true
    @Published var graphicsQuality: GraphicsQuality = .high
    @Published var colorPalette: ColorPalette = .dark
    
    enum GraphicsQuality: String, Codable, CaseIterable {
        case low, medium, high, ultra
    }
    
    enum ColorPalette: String, Codable, CaseIterable {
        case dark, light, cosmic, earth
    }
    
    private let userDefaults = UserDefaults.standard
    private let configurationKey = "appConfiguration"
    
    init() {
        loadConfiguration()
    }
    
    func loadConfiguration() {
        guard let data = userDefaults.data(forKey: configurationKey),
              let config = try? JSONDecoder().decode(ConfigurationData.self, from: data) else {
            return
        }
        
        preferredFrameRate = config.preferredFrameRate
        audioReactiveEnabled = config.audioReactiveEnabled
        hapticFeedbackEnabled = config.hapticFeedbackEnabled
        graphicsQuality = config.graphicsQuality
        colorPalette = config.colorPalette
    }
    
    func saveConfiguration() {
        let config = ConfigurationData(
            preferredFrameRate: preferredFrameRate,
            audioReactiveEnabled: audioReactiveEnabled,
            hapticFeedbackEnabled: hapticFeedbackEnabled,
            graphicsQuality: graphicsQuality,
            colorPalette: colorPalette
        )
        
        if let data = try? JSONEncoder().encode(config) {
            userDefaults.set(data, forKey: configurationKey)
        }
    }
    
    struct ConfigurationData: Codable {
        let preferredFrameRate: Int
        let audioReactiveEnabled: Bool
        let hapticFeedbackEnabled: Bool
        let graphicsQuality: GraphicsQuality
        let colorPalette: ColorPalette
    }
}