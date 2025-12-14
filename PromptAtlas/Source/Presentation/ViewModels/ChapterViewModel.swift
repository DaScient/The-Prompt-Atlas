import Foundation
import Combine

class ChapterViewModel: ObservableObject {
    @Published var chapter: Chapter
    @Published var isLoading = false
    @Published var error: Error?
    @Published var progress: Double = 0.0
    @Published var completedExercises: Set<String> = []
    @Published var journalEntries: [JournalEntry] = []
    
    private var cancellables = Set<AnyCancellable>()
    private let journalService: JournalService
    private let chapterRepository: ChapterRepository
    
    init(chapter: Chapter, journalService: JournalService, chapterRepository: ChapterRepository) {
        self.chapter = chapter
        self.journalService = journalService
        self.chapterRepository = chapterRepository
        
        loadProgress()
        loadJournalEntries()
    }
    
    func loadProgress() {
        let entries = journalService.entries(for: chapter.id)
        let completed = Set(entries.map { $0.exerciseId })
        self.completedExercises = completed
        self.progress = Double(completed.count) / Double(chapter.exercises.count)
    }
    
    private func loadJournalEntries() {
        journalEntries = journalService.entries(for: chapter.id)
            .sorted { $0.createdAt > $1.createdAt }
    }
    
    func markExerciseAsCompleted(_ exercise: Exercise) {
        completedExercises.insert(exercise.id)
        progress = Double(completedExercises.count) / Double(chapter.exercises.count)
    }
    
    func isExerciseCompleted(_ exercise: Exercise) -> Bool {
        completedExercises.contains(exercise.id)
    }
    
    func saveJournalEntry(_ entry: JournalEntry) {
        journalService.addEntry(entry)
        loadJournalEntries()
        loadProgress()
    }
    
    func relatedChapters() -> [Chapter] {
        chapterRepository.relatedChapters(for: chapter)
    }
}