import Foundation

enum ExerciseType: String, Codable, CaseIterable, Identifiable {
    case journaling, meditation, archetypeQuiz, festivalDesign, mirrorReflection, visualization, movement
    
    var id: String { rawValue }
    
    var displayName: String {
        rawValue.capitalized
    }
    
    var icon: String {
        switch self {
        case .journaling: return "pencil"
        case .meditation: return "brain.head.profile"
        case .archetypeQuiz: return "questionmark.circle"
        case .festivalDesign: return "party.popper"
        case .mirrorReflection: return "eyes"
        case .visualization: return "eye"
        case .movement: return "figure.walk"
        }
    }
}