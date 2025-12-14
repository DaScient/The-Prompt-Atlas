import Foundation
import Combine
import Security

class JournalService: ObservableObject {
    @Published var entries: [JournalEntry] = []
    @Published var isSaving = false
    
    private let fileName = "journal_entries"
    private let fileManager = FileManager.default
    private let queue = DispatchQueue(label: "com.promptatlas.journalservice", qos: .userInitiated)
    
    init() {
        loadEntries()
    }
    
    func loadEntries() {
        queue.async { [weak self] in
            guard let self = self else { return }
            
            do {
                let entries = try self.loadEntriesFromDisk()
                DispatchQueue.main.async {
                    self.entries = entries
                }
            } catch {
                print("❌ Failed to load journal entries: \(error)")
            }
        }
    }
    
    private func loadEntriesFromDisk() throws -> [JournalEntry] {
        let url = getDocumentsDirectory().appendingPathComponent(fileName)
        
        guard fileManager.fileExists(atPath: url.path) else {
            return []
        }
        
        let data = try Data(contentsOf: url)
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        
        return try decoder.decode([JournalEntry].self, from: data)
    }
    
    func saveEntries() {
        isSaving = true
        
        queue.async { [weak self] in
            guard let self = self else { return }
            
            do {
                try self.saveEntriesToDisk(self.entries)
                DispatchQueue.main.async {
                    self.isSaving = false
                }
            } catch {
                DispatchQueue.main.async {
                    self.isSaving = false
                    print("❌ Failed to save journal entries: \(error)")
                }
            }
        }
    }
    
    private func saveEntriesToDisk(_ entries: [JournalEntry]) throws {
        let url = getDocumentsDirectory().appendingPathComponent(fileName)
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        
        let data = try encoder.encode(entries)
        try data.write(to: url, options: .atomic)
    }
    
    func addEntry(_ entry: JournalEntry) {
        entries.insert(entry, at: 0)
        saveEntries()
    }
    
    func updateEntry(_ entry: JournalEntry) {
        guard let index = entries.firstIndex(where: { $0.id == entry.id }) else { return }
        entries[index] = entry
        saveEntries()
    }
    
    func deleteEntry(_ entry: JournalEntry) {
        entries.removeAll { $0.id == entry.id }
        saveEntries()
    }
    
    func entries(for chapterId: Int) -> [JournalEntry] {
        entries.filter { $0.chapterId == chapterId }
    }
    
    func exportEntries() -> URL? {
        guard let jsonData = try? JSONEncoder().encode(entries) else { return nil }
        
        let tempURL = FileManager.default.temporaryDirectory
            .appendingPathComponent("journal-export-\(Date().timeIntervalSince1970).json")
        
        try? jsonData.write(to: tempURL)
        return tempURL
    }
    
    private func getDocumentsDirectory() -> URL {
        fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }
}