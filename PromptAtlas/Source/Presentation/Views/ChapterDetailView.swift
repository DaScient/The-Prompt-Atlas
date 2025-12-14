import SwiftUI

struct ChapterDetailView: View {
    @ObservedObject var viewModel: ChapterViewModel
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var appConfiguration: AppConfiguration
    
    @State private var showingExperience = false
    @State private var showingExercise = false
    @State private var selectedExercise: Exercise?
    
    init(chapter: Chapter) {
        self.viewModel = ChapterViewModel(chapter: chapter, journalService: JournalService(), chapterRepository: ChapterRepository())
    }
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 32) {
                // Hero Section
                heroSection
                
                // Progress Overview
                progressSection
                
                // Key Concepts
                conceptsSection
                
                // Case Studies
                caseStudiesSection
                
                // Prompts
                promptsSection
                
                // Exercises
                exercisesSection
                
                // Related Chapters
                relatedChaptersSection
            }
            .padding()
        }
        .navigationBarHidden(true)
        .background(Color(.systemGroupedBackground).ignoresSafeArea())
        .overlay(closeButton, alignment: .topTrailing)
        .sheet(item: $selectedExercise) { exercise in
            ExerciseView(exercise: exercise, chapter: viewModel.chapter)
        }
        .sheet(isPresented: $showingExperience) {
            ExperienceView(chapter: viewModel.chapter, audioEngine: AudioEngine(), hapticEngine: HapticEngine())
        }
    }
    
    private var heroSection: some View {
        ZStack(alignment: .bottomLeading) {
            RoundedRectangle(cornerRadius: 24)
                .fill(themeGradient)
                .frame(height: 250)
                .overlay(
                    VStack(alignment: .leading, spacing: 12) {
                        Spacer()
                        
                        Text("Chapter \(viewModel.chapter.id)")
                            .font(.caption)
                            .fontWeight(.semibold)
                            .foregroundColor(.white.opacity(0.8))
                        
                        Text(viewModel.chapter.title)
                            .font(.largeTitle)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                            .lineLimit(2)
                        
                        Text(viewModel.chapter.subtitle)
                            .font(.title3)
                            .foregroundColor(.white.opacity(0.9))
                        
                        HStack(spacing: 16) {
                            InfoPill(icon: "clock", text: "\(viewModel.chapter.estimatedDuration) min")
                            InfoPill(icon: "chart.bar", text: viewModel.chapter.difficulty.rawValue)
                            InfoPill(icon: "checkmark.circle", text: "\(Int(viewModel.progress * 100))%")
                        }
                    }
                    .padding()
                )
            
            // Action buttons
            HStack(spacing: 12) {
                ActionButton(title: "Experience", icon: "sparkles", style: .primary) {
                    showingExperience = true
                }
                
                ActionButton(title: "Exercise", icon: "checkmark.circle", style: .secondary) {
                    showingExercise = true
                }
            }
            .padding(.horizontal)
            .padding(.bottom, -20)
        }
        .frame(height: 280)
    }
    
    private var progressSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Your Progress")
                .font(.headline)
            
            ProgressView(value: viewModel.progress, total: 1.0) {
                Text("\(Int(viewModel.progress * 100))% Complete")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .progressViewStyle(LinearProgressViewStyle(tint: themeColor))
            
            if viewModel.progress > 0 {
                Text("\(viewModel.completedExercises.count) of \(viewModel.chapter.exercises.count) exercises completed")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
    }
    
    private var conceptsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Key Concepts")
                .font(.headline)
            
            Text(viewModel.chapter.summary)
                .font(.body)
                .lineSpacing(6)
            
            TagCloud(tags: viewModel.chapter.themes)
        }
    }
    
    private var caseStudiesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Case Studies")
                .font(.headline)
            
            ForEach(viewModel.chapter.caseStudies) { caseStudy in
                CaseStudyCard(caseStudy: caseStudy)
            }
        }
    }
    
    private var promptsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Core Prompts")
                .font(.headline)
            
            ForEach(viewModel.chapter.prompts.prefix(5)) { prompt in
                PromptCard(prompt: prompt)
            }
            
            if viewModel.chapter.prompts.count > 5 {
                Text("+\(viewModel.chapter.prompts.count - 5) more prompts")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.top, 8)
            }
        }
    }
    
    private var exercisesSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Exercises")
                .font(.headline)
            
            ForEach(viewModel.chapter.exercises) { exercise in
                ExerciseRow(
                    exercise: exercise,
                    isCompleted: viewModel.isExerciseCompleted(exercise),
                    difficulty: viewModel.chapter.difficulty
                ) {
                    selectedExercise = exercise
                }
            }
        }
    }
    
    private var relatedChaptersSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Related Chapters")
                .font(.headline)
            
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(viewModel.relatedChapters()) { relatedChapter in
                        NavigationLink(destination: ChapterDetailView(chapter: relatedChapter)) {
                            RelatedChapterCard(chapter: relatedChapter)
                        }
                    }
                }
            }
        }
    }
    
    private var closeButton: some View {
        Button {
            dismiss()
        } label: {
            Image(systemName: "xmark.circle.fill")
                .font(.title2)
                .foregroundColor(.white)
                .padding()
                .background(.ultraThinMaterial)
                .cornerRadius(20)
        }
        .padding()
    }
    
    private var themeGradient: LinearGradient {
        let colors = viewModel.chapter.visualTheme.colors
        return LinearGradient(
            colors: [
                Color(simd: colors.primary),
                Color(simd: colors.secondary)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
    
    private var themeColor: Color {
        Color(simd: viewModel.chapter.visualTheme.colors.primary)
    }
}

// MARK: - Supporting Views
struct InfoPill: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.caption)
            Text(text)
                .font(.caption)
        }
        .foregroundColor(.white.opacity(0.9))
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .background(.white.opacity(0.2))
        .cornerRadius(8)
    }
}

struct ActionButton: View {
    let title: String
    let icon: String
    let style: Style
    let action: () -> Void
    
    enum Style {
        case primary, secondary
        
        var backgroundColor: Color {
            switch self {
            case .primary: return .white
            case .secondary: return .white.opacity(0.2)
            }
        }
        
        var foregroundColor: Color {
            switch self {
            case .primary: return .black
            case .secondary: return .white
            }
        }
    }
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                Image(systemName: icon)
                Text(title)
                    .fontWeight(.semibold)
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 12)
            .background(style.backgroundColor)
            .foregroundColor(style.foregroundColor)
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct TagCloud: View {
    let tags: [String]
    
    var body: some View {
        FlowLayout(spacing: 8) {
            ForEach(tags, id: \.self) { tag in
                TagView(text: tag)
            }
        }
    }
}

struct FlowLayout: Layout {
    var spacing: CGFloat = 8
    
    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let sizes = subviews.map { $0.sizeThatFits(.unspecified) }
        return layout(sizes: sizes, spacing: spacing, proposal: proposal).size
    }
    
    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let sizes = subviews.map { $0.sizeThatFits(.unspecified) }
        let layoutResult = layout(sizes: sizes, spacing: spacing, proposal: proposal)
        
        for (index, subview) in subviews.enumerated() {
            subview.place(at: layoutResult.positions[index], anchor: .topLeading, proposal: .unspecified)
        }
    }
    
    private func layout(sizes: [CGSize], spacing: CGFloat, proposal: ProposedViewSize) -> (size: CGSize, positions: [CGPoint]) {
        var positions: [CGPoint] = []
        var currentPosition = CGPoint.zero
        var maxHeight: CGFloat = 0
        var totalWidth: CGFloat = 0
        var rowWidth: CGFloat = 0
        
        for size in sizes {
            if currentPosition.x + size.width > (proposal.width ?? .infinity) {
                // New row
                currentPosition.x = 0
                currentPosition.y += maxHeight + spacing
                maxHeight = 0
            }
            
            positions.append(currentPosition)
            currentPosition.x += size.width + spacing
            rowWidth = max(rowWidth, currentPosition.x)
            maxHeight = max(maxHeight, size.height)
            totalWidth = max(totalWidth, rowWidth)
        }
        
        let totalHeight = currentPosition.y + maxHeight
        return (CGSize(width: totalWidth, height: totalHeight), positions)
    }
}

struct TagView: View {
    let text: String
    
    var body: some View {
        Text(text)
            .font(.caption)
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
            .background(Color(.systemGray6))
            .cornerRadius(8)
    }
}

struct CaseStudyCard: View {
    let caseStudy: CaseStudy
    
    @State private var isExpanded = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(caseStudy.title)
                .font(.headline)
            
            Text(caseStudy.narrative)
                .font(.body)
                .lineLimit(isExpanded ? nil : 3)
                .foregroundColor(.secondary)
            
            if !isExpanded && caseStudy.narrative.count > 200 {
                Button {
                    isExpanded = true
                } label: {
                    Text("Read more")
                        .font(.caption)
                        .fontWeight(.semibold)
                }
            }
            
            // Prompts from case study
            if !caseStudy.prompts.isEmpty {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Reflection Questions:")
                        .font(.caption)
                        .fontWeight(.semibold)
                    
                    ForEach(caseStudy.prompts, id: \.self) { prompt in
                        Text("• \(prompt)")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                .padding(.top, 8)
                .padding(.leading, 12)
                .border(Color.accentColor.opacity(0.3), width: 1)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct RelatedChapterCard: View {
    let chapter: Chapter
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Chapter \(chapter.id)")
                .font(.caption)
                .foregroundColor(.secondary)
            
            Text(chapter.title)
                .font(.footnote)
                .fontWeight(.semibold)
                .lineLimit(2)
        }
        .padding(12)
        .frame(width: 120, height: 80)
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct PromptCard: View {
    let prompt: Prompt
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(prompt.text)
                .font(.body)
                .fontWeight(.medium)
            
            HStack {
                Text(prompt.category)
                    .font(.caption)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.accentColor.opacity(0.1))
                    .cornerRadius(8)
                
                Spacer()
                
                Text("\(prompt.estimatedTime) min")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
    }
}

struct ExerciseRow: View {
    let exercise: Exercise
    let isCompleted: Bool
    let difficulty: DifficultyLevel
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                ExerciseIcon(type: exercise.type, difficulty: exercise.difficulty)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(exercise.title)
                        .font(.headline)
                    
                    Text(exercise.instructions)
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                    
                    HStack(spacing: 8) {
                        Label("\(exercise.durationMinutes) min", systemImage: "clock")
                        Label(exercise.difficulty.rawValue, systemImage: "chart.bar")
                    }
                    .font(.caption2)
                    .foregroundColor(.secondary)
                }
                
                Spacer()
                
                if isCompleted {
                    Image(systemName: "checkmark.circle.fill")
                        .font(.title2)
                        .foregroundColor(.green)
                }
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
}