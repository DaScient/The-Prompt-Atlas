import SwiftUI

struct ExperienceHubView: View {
    @EnvironmentObject var chapterRepository: ChapterRepository
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        VStack(spacing: 24) {
            if let selectedChapter = appState.selectedChapter {
                ChapterExperienceCard(chapter: selectedChapter)
            } else {
                SelectChapterPrompt()
            }
            
            RecentExperiencesView()
        }
        .padding()
    }
}

struct ChapterExperienceCard: View {
    let chapter: Chapter
    
    @State private var showingExperience = false
    
    var body: some View {
        VStack(spacing: 16) {
            // Chapter preview
            RoundedRectangle(cornerRadius: 20)
                .fill(themeGradient)
                .frame(height: 200)
                .overlay(
                    VStack(spacing: 8) {
                        Text("Chapter \(chapter.id)")
                            .font(.caption)
                            .foregroundColor(.white.opacity(0.8))
                        
                        Text(chapter.title)
                            .font(.title)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                            .multilineTextAlignment(.center)
                        
                        Text(chapter.subtitle)
                            .font(.subheadline)
                            .foregroundColor(.white.opacity(0.9))
                    }
                    .padding()
                )
            
            // Action buttons
            HStack(spacing: 16) {
                Button {
                    showingExperience = true
                } label: {
                    Label("Start Experience", systemImage: "sparkles")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                
                Button {
                    // Configure experience
                } label: {
                    Label("Customize", systemImage: "slider.horizontal.3")
                }
                .buttonStyle(.bordered)
            }
        }
        .sheet(isPresented: $showingExperience) {
            ExperienceView(chapter: chapter, audioEngine: AudioEngine(), hapticEngine: HapticEngine())
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
}

struct SelectChapterPrompt: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "book.fill")
                .font(.system(size: 48))
                .foregroundColor(.secondary)
            
            Text("Select a Chapter")
                .font(.title2)
                .fontWeight(.bold)
            
            Text("Choose a chapter from the Explore tab to begin your immersive experience")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding()
        .frame(maxWidth: .infinity)
        .background(Color(.systemGray6))
        .cornerRadius(16)
    }
}

struct RecentExperiencesView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Recent Experiences")
                .font(.headline)
            
            // Placeholder for recent experiences
            ForEach(0..<3) { index in
                RecentExperienceRow(index: index)
            }
        }
    }
}

struct RecentExperienceRow: View {
    let index: Int
    
    var body: some View {
        HStack(spacing: 16) {
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.blue)
                .frame(width: 60, height: 60)
                .overlay(
                    Image(systemName: "sparkles")
                        .font(.title)
                        .foregroundColor(.white)
                )
            
            VStack(alignment: .leading, spacing: 4) {
                Text("Chapter \(index + 1): Sample Chapter")
                    .font(.headline)
                
                Text("Last experienced 2 days ago")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Button("Replay") {
                // Replay experience
            }
            .buttonStyle(.bordered)
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}