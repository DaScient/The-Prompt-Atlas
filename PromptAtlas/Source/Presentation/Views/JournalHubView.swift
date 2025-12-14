import SwiftUI

struct JournalHubView: View {
    @EnvironmentObject var journalService: JournalService
    @EnvironmentObject var appState: AppState
    
    @StateObject private var viewModel = JournalViewModel(journalService: JournalService())
    
    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Search and filters
                SearchFilterSection(viewModel: viewModel)
                
                // Quick stats
                JournalStatsSection(viewModel: viewModel)
                
                // Recent entries
                RecentEntriesSection(viewModel: viewModel)
                
                // Monthly overview
                MonthlyOverviewSection(viewModel: viewModel)
            }
            .padding()
        }
    }
}

struct SearchFilterSection: View {
    @ObservedObject var viewModel: JournalViewModel
    
    var body: some View {
        VStack(spacing: 12) {
            // Search bar
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.secondary)
                
                TextField("Search entries...", text: $viewModel.searchText)
                    .textFieldStyle(PlainTextFieldStyle())
                
                if !viewModel.searchText.isEmpty {
                    Button {
                        viewModel.searchText = ""
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .padding(12)
            .background(Color(.systemGray6))
            .cornerRadius(12)
            
            // Filter chips
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    // Mood filters
                    ForEach(Mood.allCases, id: \.self) { mood in
                        FilterChip(
                            title: mood.rawValue,
                            isSelected: viewModel.filterMood == mood,
                            action: {
                                viewModel.filterMood = viewModel.filterMood == mood ? nil : mood
                            }
                        )
                    }
                    
                    // Tag filters
                    ForEach(viewModel.allTags().prefix(5), id: \.self) { tag in
                        FilterChip(
                            title: tag,
                            isSelected: viewModel.filterTags.contains(tag),
                            action: {
                                if viewModel.filterTags.contains(tag) {
                                    viewModel.filterTags.remove(tag)
                                } else {
                                    viewModel.filterTags.insert(tag)
                                }
                            }
                        )
                    }
                }
            }
        }
    }
}

struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.caption)
                .fontWeight(isSelected ? .semibold : .regular)
                .foregroundColor(isSelected ? .white : .primary)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(isSelected ? Color.accentColor : Color(.systemGray6))
                .cornerRadius(16)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct JournalStatsSection: View {
    @ObservedObject var viewModel: JournalViewModel
    
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Your Journey")
                .font(.headline)
            
            HStack(spacing: 16) {
                StatCard(
                    title: "Total Entries",
                    value: "\(viewModel.entries.count)",
                    icon: "pencil.and.list.clipboard",
                    color: .blue
                )
                
                StatCard(
                    title: "This Week",
                    value: "\(entriesThisWeek())",
                    icon: "calendar",
                    color: .green
                )
                
                StatCard(
                    title: "Moods Tracked",
                    value: "\(uniqueMoods())",
                    icon: "face.smiling",
                    color: .purple
                )
            }
        }
    }
    
    private func entriesThisWeek() -> Int {
        let calendar = Calendar.current
        let oneWeekAgo = calendar.date(byAdding: .day, value: -7, to: Date()) ?? Date()
        return viewModel.entries.filter { $0.createdAt > oneWeekAgo }.count
    }
    
    private func uniqueMoods() -> Int {
        Set(viewModel.entries.compactMap { $0.mood }).count
    }
}

struct StatCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)
            
            Text(value)
                .font(.title3)
                .fontWeight(.bold)
            
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct RecentEntriesSection: View {
    @ObservedObject var viewModel: JournalViewModel
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Recent Entries")
                    .font(.headline)
                
                Spacer()
                
                Button("View All") {
                    // Navigate to full journal view
                }
                .font(.caption)
                .foregroundColor(.accentColor)
            }
            
            if viewModel.entries.isEmpty {
                EmptyJournalState()
            } else {
                ForEach(viewModel.entries.prefix(5)) { entry in
                    JournalEntryRow(entry: entry)
                }
            }
        }
    }
}

struct EmptyJournalState: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "pencil.and.list.clipboard")
                .font(.system(size: 48))
                .foregroundColor(.secondary)
            
            Text("No journal entries yet")
                .font(.headline)
            
            Text("Complete exercises to start building your journal")
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding()
        .frame(maxWidth: .infinity)
    }
}

struct JournalEntryRow: View {
    let entry: JournalEntry
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(entry.content.prefix(100))
                .font(.body)
                .lineLimit(3)
            
            HStack(spacing: 8) {
                if let mood = entry.mood {
                    Text(moodIcon(mood))
                        .font(.caption)
                }
                
                ForEach(entry.tags.prefix(3), id: \.self) { tag in
                    Text(tag)
                        .font(.caption2)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.accentColor.opacity(0.1))
                        .cornerRadius(4)
                }
                
                Spacer()
                
                Text(relativeDate(entry.createdAt))
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
    
    private func moodIcon(_ mood: Mood) -> String {
        switch mood {
        case .reflective: return "🤔"
        case .inspired: return "✨"
        case .confused: return "😕"
        case .breakthrough: return "💡"
        case .challenged: return "💪"
        }
    }
    
    private func relativeDate(_ date: Date) -> String {
        let formatter = RelativeDateTimeFormatter()
        return formatter.localizedString(for: date, relativeTo: Date())
    }
}

struct MonthlyOverviewSection: View {
    @ObservedObject var viewModel: JournalViewModel
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Monthly Overview")
                .font(.headline)
            
            let entriesByMonth = viewModel.entriesByMonth()
            
            if entriesByMonth.isEmpty {
                Text("No entries yet")
                    .font(.caption)
                    .foregroundColor(.secondary)
            } else {
                ForEach(entriesByMonth.keys.sorted(by: >), id: \.self) { month in
                    MonthlyEntryGroup(month: month, entries: entriesByMonth[month] ?? [])
                }
            }
        }
    }
}

struct MonthlyEntryGroup: View {
    let month: String
    let entries: [JournalEntry]
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(month)
                .font(.headline)
                .foregroundColor(.primary)
            
            Text("\(entries.count) entries")
                .font(.caption)
                .foregroundColor(.secondary)
            
            // Mini calendar view would go here
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.accentColor.opacity(0.1))
                .frame(height: 40)
                .overlay(
                    Text("Calendar view coming soon")
                        .font(.caption)
                        .foregroundColor(.secondary)
                )
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}