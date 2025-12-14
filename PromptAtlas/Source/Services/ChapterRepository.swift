import Foundation
import Combine

class ChapterRepository: ObservableObject {
    @Published var chapters: [Chapter] = []
    @Published var isLoading = false
    @Published var lastError: Error?
    
    private let fileName = "chapters"
    private let queue = DispatchQueue(label: "com.promptatlas.chapterrepository", qos: .userInitiated)
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        loadChapters()
    }
    
    func loadChapters() {
        isLoading = true
        
        queue.async { [weak self] in
            guard let self = self else { return }
            
            do {
                let chapters = try self.loadChaptersFromBundle()
                DispatchQueue.main.async {
                    self.chapters = chapters
                    self.isLoading = false
                }
            } catch {
                DispatchQueue.main.async {
                    self.lastError = error
                    self.isLoading = false
                    print("❌ Failed to load chapters: \(error)")
                }
            }
        }
    }
    
    private func loadChaptersFromBundle() throws -> [Chapter] {
        guard let url = Bundle.main.url(forResource: fileName, withExtension: "json") else {
            throw ChapterError.fileNotFound(fileName)
        }
        
        let data = try Data(contentsOf: url)
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        
        return try decoder.decode([Chapter].self, from: data)
    }
    
    func chapter(by id: Int) -> Chapter? {
        chapters.first { $0.id == id }
    }
    
    func relatedChapters(for chapter: Chapter) -> [Chapter] {
        chapter.relatedChapters.compactMap { chapter(by: $0) }
    }
    
    enum ChapterError: Error, LocalizedError {
        case fileNotFound(String)
        
        var errorDescription: String? {
            switch self {
            case .fileNotFound(let name):
                return "Could not find \(name).json in app bundle"
            }
        }
    }
}