import Foundation

enum ExperienceMode: String, Codable, CaseIterable {
    case none, explore, experience, exercise, journal, settings
    
    var displayName: String {
        rawValue.capitalized
    }
}