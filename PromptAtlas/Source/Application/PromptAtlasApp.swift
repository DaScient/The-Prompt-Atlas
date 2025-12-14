import SwiftUI

@main
struct PromptAtlasApp: App {
    @StateObject private var appConfiguration = AppConfiguration()
    @StateObject private var appState = AppState()
    @StateObject private var chapterRepository = ChapterRepository()
    @StateObject private var journalService = JournalService()
    @StateObject private var audioEngine = AudioEngine()
    @StateObject private var hapticEngine = HapticEngine()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appConfiguration)
                .environmentObject(appState)
                .environmentObject(chapterRepository)
                .environmentObject(journalService)
                .environmentObject(audioEngine)
                .environmentObject(hapticEngine)
                .onAppear {
                    initializeServices()
                }
                .onReceive(NotificationCenter.default.publisher(for: UIApplication.willResignActiveNotification)) { _ in
                    saveApplicationState()
                }
        }
    }
    
    private func initializeServices() {
        Task {
            await chapterRepository.loadChapters()
            await journalService.loadEntries()
            audioEngine.requestPermissions()
        }
    }
    
    private func saveApplicationState() {
        journalService.saveEntries()
    }
}

// MARK: - App State
class AppState: ObservableObject {
    @Published var selectedChapter: Chapter?
    @Published var currentExperienceMode: ExperienceMode = .none
    @Published var isAudioActive = false
    @Published var needsRefresh = false
}