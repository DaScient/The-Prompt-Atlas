import Foundation
import UIKit

struct Constants {
    // App Info
    static let appName = "Prompt Atlas"
    static let appVersion = "1.0.0"
    static let appBuild = "1"
    
    // UI Constants
    static let cornerRadius: CGFloat = 12
    static let largeCornerRadius: CGFloat = 20
    static let animationDuration: TimeInterval = 0.3
    static let springAnimationDuration: TimeInterval = 0.5
    
    // Metal Rendering
    static let defaultFrameRate = 60
    static let maxFrameRate = 120
    static let minFrameRate = 30
    
    // Audio
    static let audioSampleRate: Double = 44100
    static let audioBufferSize: UInt32 = 1024
    static let audioLevelUpdateInterval: TimeInterval = 0.05
    
    // Haptics
    static let hapticIntensityThreshold: Float = 0.1
    static let hapticDuration: TimeInterval = 0.1
    
    // Data
    static let maxJournalEntries = 1000
    static let maxPromptHistory = 30
    static let maxTagsPerEntry = 10
    
    // File Names
    static let chaptersFileName = "chapters"
    static let promptsFileName = "all_prompts"
    static let journalFileName = "journal_entries"
    
    // User Defaults Keys
    static let configurationKey = "appConfiguration"
    static let settingsKey = "appSettings"
    static let lastPromptKey = "lastPromptDate"
    static let promptHistoryKey = "promptHistory"
    
    // Notifications
    static let journalUpdatedNotification = Notification.Name("journalUpdated")
    static let chapterCompletedNotification = Notification.Name("chapterCompleted")
    static let promptOfTheDayNotification = Notification.Name("promptOfTheDay")
}