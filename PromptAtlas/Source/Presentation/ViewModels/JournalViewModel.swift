import Foundation
import Combine

class JournalViewModel: ObservableObject {
    @Published var entries: [JournalEntry] = []
    @Published var currentEntry: JournalEntry?
    @Published var isEditing = false
    @Published var searchText = ""
    @Published var filterTags: Set<String> = []
    @Published var filterMood: Mood?
    @Published var filterChapterId: Int?
    
    private let journalService: JournalService
    private var cancellables = Set<AnyCancellable>()
    
    init(journalService: JournalService) {
        self.journalService = journalService
        
        loadEntries()
        setupSearchBinding()
    }
    
    private func loadEntries() {
        entries = journalService.entries
    }
    
    private func setupSearchBinding() {
        $searchText
            .combineLatest($filterTags, $filterMood, $filterChapterId)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] searchText, filterTags, filterMood, filterChapterId in
                self?.applyFilters(searchText: searchText, filterTags: filterTags, filterMood: filterMood, filterChapterId: filterChapterId)
            }
            .store(in: &cancellables)
    }
    
    private func applyFilters(searchText: String, filterTags: Set<String>, filterMood: Mood?, filterChapterId: Int?) {
        var filteredEntries = journalService.entries
        
        // Text search
        if !searchText.isEmpty {
            filteredEntries = filteredEntries.filter {
                $0.content.localizedCaseInsensitiveContains(searchText) ||
                $0.tags.contains { $0.localizedCaseInsensitiveContains(searchText) }
            }
        }
        
        // Tag filter
        if !filterTags.isEmpty {
            filteredEntries = filteredEntries.filter { entry in
                !Set(entry.tags).intersection(filterTags).isEmpty
            }
        }
        
        // Mood filter
        if let mood = filterMood {
            filteredEntries = filteredEntries.filter { $0.mood == mood }
        }
        
        // Chapter filter
        if let chapterId = filterChapterId {
            filteredEntries = filteredEntries.filter { $0.chapterId == chapterId }
        }
        
        self.entries = filteredEntries
    }
    
    func createNewEntry(for chapter: Chapter, exercise: Exercise) {
        let entry = JournalEntry(
            chapterId: chapter.id,
            exerciseId: exercise.id,
            content: "",
            createdAt: Date(),
            updatedAt: Date()
        )
        
        currentEntry = entry
        isEditing = true
    }
    
    func saveCurrentEntry() {
        guard let entry = currentEntry else { return }
        
        journalService.addEntry(entry)
        loadEntries()
        isEditing = false
        currentEntry = nil
    }
    
    func updateCurrentEntry(_ content: String, mood: Mood?, tags: [String]) {
        guard let entry = currentEntry else { return }
        
        var updatedEntry = entry
        updatedEntry.content = content
        updatedEntry.mood = mood
        updatedEntry.tags = tags
        updatedEntry.updatedAt = Date()
        
        currentEntry = updatedEntry
    }
    
    func deleteEntry(_ entry: JournalEntry) {
        journalService.deleteEntry(entry)
        loadEntries()
    }
    
    func allTags() -> [String] {
        Set(entries.flatMap { $0.tags }).sorted()
    }
    
    func entriesByMonth() -> [String: [JournalEntry]] {
        let formatter = DateFormatter()
        formatter.dateFormat = "MMMM yyyy"
        
        return Dictionary(grouping: entries) { entry in
            formatter.string(from: entry.createdAt)
        }
    }
}