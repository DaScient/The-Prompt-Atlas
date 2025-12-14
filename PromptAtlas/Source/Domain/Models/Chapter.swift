import Foundation

struct Chapter: Identifiable, Codable, Equatable, Hashable {
    let id: Int
    let title: String
    let subtitle: String
    let themes: [String]
    let summary: String
    let prompts: [Prompt]
    let caseStudies: [CaseStudy]
    let visualTheme: VisualTheme
    let exercises: [Exercise]
    let estimatedDuration: Int
    let difficulty: DifficultyLevel
    let relatedChapters: [Int]
    let metadata: ChapterMetadata
    
    static func == (lhs: Chapter, rhs: Chapter) -> Bool {
        lhs.id == rhs.id
    }
    
    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
}

struct Prompt: Identifiable, Codable, Equatable, Hashable {
    let id: String
    let text: String
    let category: String
    let relatedChapters: [Int]
    let difficulty: DifficultyLevel
    let estimatedTime: Int
    let tags: [String]
    
    static func == (lhs: Prompt, rhs: Prompt) -> Bool {
        lhs.id == rhs.id
    }
}

struct CaseStudy: Identifiable, Codable, Equatable, Hashable {
    let id: String
    let title: String
    let narrative: String
    let prompts: [String]
    let visualAssets: [String]?
    let estimatedDuration: Int
    
    static func == (lhs: CaseStudy, rhs: CaseStudy) -> Bool {
        lhs.id == rhs.id
    }
}

struct Exercise: Identifiable, Codable, Equatable, Hashable {
    let id: String
    let type: ExerciseType
    let title: String
    let instructions: String
    let durationMinutes: Int
    let requiredTools: [String]
    let difficulty: DifficultyLevel
    let template: ExerciseTemplate?
    
    static func == (lhs: Exercise, rhs: Exercise) -> Bool {
        lhs.id == rhs.id
    }
}

struct JournalEntry: Identifiable, Codable, Equatable, Hashable {
    let id: UUID
    let chapterId: Int
    let exerciseId: String
    let promptId: String?
    let content: String
    let createdAt: Date
    let updatedAt: Date
    let mood: Mood?
    let tags: [String]
    
    init(id: UUID = UUID(), chapterId: Int, exerciseId: String, promptId: String? = nil, content: String, createdAt: Date = Date(), updatedAt: Date = Date(), mood: Mood? = nil, tags: [String] = []) {
        self.id = id
        self.chapterId = chapterId
        self.exerciseId = exerciseId
        self.promptId = promptId
        self.content = content
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.mood = mood
        self.tags = tags
    }
    
    static func == (lhs: JournalEntry, rhs: JournalEntry) -> Bool {
        lhs.id == rhs.id
    }
}

struct ChapterMetadata: Codable, Equatable {
    let author: String
    let lastUpdated: Date
    let version: String
    let prerequisites: [Int]
    let relatedTopics: [String]
}

// MARK: - Supporting Types
enum DifficultyLevel: String, Codable, CaseIterable {
    case beginner, intermediate, advanced, expert
}

enum Mood: String, Codable, CaseIterable {
    case reflective, inspired, confused, breakthrough, challenged
}

struct ExerciseTemplate: Codable, Equatable {
    let placeholder: String
    let suggestions: [String]
    let wordLimit: Int?
}