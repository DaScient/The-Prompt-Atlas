import SwiftUI

struct ChapterListView: View {
    @EnvironmentObject var chapterRepository: ChapterRepository
    @EnvironmentObject var appState: AppState
    
    @State private var selectedChapter: Chapter?
    @State private var showingDetail = false
    @State private var searchText = ""
    @State private var selectedTheme: VisualTheme?
    
    var filteredChapters: [Chapter] {
        var chapters = chapterRepository.chapters
        
        // Text search
        if !searchText.isEmpty {
            chapters = chapters.filter { chapter in
                chapter.title.localizedCaseInsensitiveContains(searchText) ||
                chapter.summary.localizedCaseInsensitiveContains(searchText) ||
                chapter.themes.contains { $0.localizedCaseInsensitiveContains(searchText) }
            }
        }
        
        // Theme filter
        if let theme = selectedTheme {
            chapters = chapters.filter { $0.visualTheme == theme }
        }
        
        return chapters
    }
    
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Search and filter
                SearchFilterView(searchText: $searchText, selectedTheme: $selectedTheme)
                
                // Chapter grid
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 300), spacing: 16)], spacing: 16) {
                    ForEach(filteredChapters) { chapter in
                        ChapterCard(chapter: chapter) {
                            selectedChapter = chapter
                            showingDetail = true
                        }
                    }
                }
                
                if filteredChapters.isEmpty {
                    EmptyStateView()
                }
            }
            .padding()
        }
        .sheet(item: $selectedChapter) { chapter in
            NavigationView {
                ChapterDetailView(chapter: chapter)
            }
        }
    }
}

// MARK: - Search Filter View
struct SearchFilterView: View {
    @Binding var searchText: String
    @Binding var selectedTheme: VisualTheme?
    
    var body: some View {
        VStack(spacing: 12) {
            // Search bar
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(.secondary)
                
                TextField("Search chapters, themes, prompts...", text: $searchText)
                    .textFieldStyle(PlainTextFieldStyle())
                
                if !searchText.isEmpty {
                    Button {
                        searchText = ""
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .padding(12)
            .background(Color(.systemGray6))
            .cornerRadius(12)
            
            // Theme filter
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    FilterButton(title: "All", isSelected: selectedTheme == nil) {
                        selectedTheme = nil
                    }
                    
                    ForEach(VisualTheme.allCases) { theme in
                        FilterButton(title: theme.displayName, isSelected: selectedTheme == theme) {
                            selectedTheme = selectedTheme == theme ? nil : theme
                        }
                    }
                }
            }
        }
    }
}

// MARK: - Filter Button
struct FilterButton: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.caption)
                .fontWeight(isSelected ? .semibold : .regular)
                .foregroundColor(isSelected ? .white : .primary)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(isSelected ? Color.accentColor : Color(.systemGray6))
                .cornerRadius(20)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

// MARK: - Chapter Card
struct ChapterCard: View {
    let chapter: Chapter
    let action: () -> Void
    
    @State private var isPressed = false
    @EnvironmentObject var appConfiguration: AppConfiguration
    
    var completionPercentage: Double {
        let totalExercises = chapter.exercises.count
        guard totalExercises > 0 else { return 0 }
        
        // This would normally come from JournalService
        return Double.random(in: 0...1)
    }
    
    var body: some View {
        ZStack(alignment: .topTrailing) {
            RoundedRectangle(cornerRadius: 20)
                .fill(themeGradient)
                .shadow(color: .black.opacity(0.2), radius: 8, x: 0, y: 4)
                .overlay(
                    VStack(alignment: .leading, spacing: 12) {
                        // Header
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Chapter \(chapter.id)")
                                    .font(.caption)
                                    .fontWeight(.semibold)
                                    .foregroundColor(.white.opacity(0.8))
                                
                                Text(chapter.title)
                                    .font(.title3)
                                    .fontWeight(.bold)
                                    .foregroundColor(.white)
                                    .lineLimit(2)
                            }
                            
                            Spacer()
                            
                            Image(systemName: themeIcon)
                                .font(.title2)
                                .foregroundColor(.white)
                        }
                        
                        // Summary
                        Text(chapter.summary)
                            .font(.caption)
                            .foregroundColor(.white.opacity(0.9))
                            .lineLimit(3)
                        
                        // Progress bar
                        ProgressView(value: completionPercentage, total: 1.0) {
                            Text("\(Int(completionPercentage * 100))% Complete")
                                .font(.caption2)
                                .foregroundColor(.white.opacity(0.8))
                        }
                        .progressViewStyle(LinearProgressViewStyle(tint: .white))
                        
                        // Tags
                        HStack(spacing: 6) {
                            ForEach(chapter.themes.prefix(3), id: \.self) { theme in
                                Text(theme)
                                    .font(.caption2)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(.white.opacity(0.2))
                                    .cornerRadius(8)
                            }
                            
                            Spacer()
                            
                            Text("\(chapter.exercises.count) exercises")
                                .font(.caption2)
                                .foregroundColor(.white.opacity(0.8))
                        }
                    }
                    .padding(20)
                )
                .scaleEffect(isPressed ? 0.98 : 1.0)
                .animation(.spring(response: 0.2, dampingFraction: 0.8), value: isPressed)
            
            // Quick actions
            Menu {
                Button {
                    // Quick journal
                } label: {
                    Label("Quick Journal", systemImage: "pencil")
                }
                
                Button {
                    // Share chapter
                } label: {
                    Label("Share", systemImage: "square.and.arrow.up")
                }
            } label: {
                Image(systemName: "ellipsis.circle.fill")
                    .font(.title3)
                    .foregroundColor(.white.opacity(0.8))
                    .padding(8)
            }
        }
        .onTapGesture {
            isPressed = true
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.1) {
                isPressed = false
                action()
            }
        }
    }
    
    private var themeGradient: LinearGradient {
        let colors = chapter.visualTheme.colors
        return LinearGradient(
            colors: [
                Color(simd: colors.primary),
                Color(simd: colors.secondary)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
    
    private var themeIcon: String {
        switch chapter.visualTheme {
        case .profits: return "dollarsign.circle.fill"
        case .ecology: return "leaf.circle.fill"
        case .mirror: return "eyes"
        case .wonder: return "sparkles"
        default: return "book.circle.fill"
        }
    }
}

// MARK: - Empty State
struct EmptyStateView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "book.fill")
                .font(.system(size: 60))
                .foregroundColor(.secondary)
            
            Text("No chapters found")
                .font(.headline)
            
            Text("Try adjusting your search or filters")
                .font(.caption)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, minHeight: 200)
    }
}

// MARK: - SIMD to Color Extension
extension Color {
    init(simd: SIMD4<Float>) {
        self.init(
            red: Double(simd.x),
            green: Double(simd.y),
            blue: Double(simd.z),
            opacity: Double(simd.w)
        )
    }
}