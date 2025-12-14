import Foundation
import Combine

class DailyPromptService: ObservableObject {
    @Published var todaysPrompt: Prompt?
    @Published var promptHistory: [Prompt] = []
    
    private let calendar = Calendar.current
    private let userDefaults = UserDefaults.standard
    private let lastPromptKey = "lastPromptDate"
    private let historyKey = "promptHistory"
    
    init() {
        loadTodaysPrompt()
    }
    
    func loadTodaysPrompt() {
        let today = calendar.startOfDay(for: Date())
        
        if let lastDate = userDefaults.object(forKey: lastPromptKey) as? Date,
           calendar.isDate(today, inSameDayAs: lastDate) {
            // Already loaded today's prompt
            return
        }
        
        // Generate or fetch new prompt for today
        generateNewDailyPrompt()
    }
    
    private func generateNewDailyPrompt() {
        // In a real app, this would fetch from API or rotate through database
        let allPrompts = loadAllPrompts()
        let randomPrompt = allPrompts.randomElement()
        
        todaysPrompt = randomPrompt
        promptHistory.insert(randomPrompt, at: 0)
        
        // Keep only last 30 days
        promptHistory = Array(promptHistory.prefix(30))
        
        saveHistory()
        userDefaults.set(Date(), forKey: lastPromptKey)
    }
    
    private func loadAllPrompts() -> [Prompt] {
        // Load from bundled prompts or API
        guard let url = Bundle.main.url(forResource: "all_prompts", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let prompts = try? JSONDecoder().decode([Prompt].self, from: data) else {
            return []
        }
        return prompts
    }
    
    private func saveHistory() {
        if let data = try? JSONEncoder().encode(promptHistory) {
            userDefaults.set(data, forKey: historyKey)
        }
    }
    
    func refreshPrompt() {
        generateNewDailyPrompt()
    }
    
    func savePromptToJournal(_ prompt: Prompt, chapterId: Int) -> JournalEntry {
        let entry = JournalEntry(
            chapterId: chapterId,
            exerciseId: "daily_prompt",
            promptId: prompt.id,
            content: "Today's prompt: \(prompt.text)",
            mood: .inspired
        )
        
        return entry
    }
}