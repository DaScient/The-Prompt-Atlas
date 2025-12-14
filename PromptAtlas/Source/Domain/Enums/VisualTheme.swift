import Foundation

enum VisualTheme: String, Codable, CaseIterable, Identifiable {
    case profits, ecology, aesthetics, quantum, mirror, carnival, wonder, cosmic
    
    var id: String { rawValue }
    
    var displayName: String {
        rawValue.capitalized
    }
    
    var colors: (primary: SIMD4<Float>, secondary: SIMD4<Float>, accent: SIMD4<Float>) {
        switch self {
        case .profits:
            return (SIMD4(1.0, 0.84, 0.0, 1.0), SIMD4(1.0, 0.6, 0.2, 1.0), SIMD4(1.0, 0.9, 0.3, 1.0))
        case .ecology:
            return (SIMD4(0.2, 0.8, 0.2, 1.0), SIMD4(0.1, 0.6, 0.1, 1.0), SIMD4(0.3, 0.9, 0.3, 1.0))
        case .aesthetics:
            return (SIMD4(0.9, 0.2, 0.5, 1.0), SIMD4(0.7, 0.1, 0.7, 1.0), SIMD4(1.0, 0.3, 0.6, 1.0))
        case .quantum:
            return (SIMD4(0.2, 0.3, 0.9, 1.0), SIMD4(0.1, 0.1, 0.7, 1.0), SIMD4(0.4, 0.5, 1.0, 1.0))
        case .mirror:
            return (SIMD4(0.5, 0.5, 0.9, 1.0), SIMD4(0.3, 0.3, 0.8, 1.0), SIMD4(0.7, 0.7, 1.0, 1.0))
        case .carnival:
            return (SIMD4(1.0, 0.3, 0.7, 1.0), SIMD4(0.9, 0.2, 0.5, 1.0), SIMD4(1.0, 0.5, 0.8, 1.0))
        case .wonder:
            return (SIMD4(0.3, 0.8, 1.0, 1.0), SIMD4(0.1, 0.6, 0.9, 1.0), SIMD4(0.5, 0.9, 1.0, 1.0))
        case .cosmic:
            return (SIMD4(0.1, 0.1, 0.3, 1.0), SIMD4(0.05, 0.05, 0.2, 1.0), SIMD4(0.2, 0.2, 0.5, 1.0))
        }
    }
}