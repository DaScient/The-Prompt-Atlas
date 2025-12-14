import SwiftUI

struct ExerciseView: View {
    @ObservedObject var viewModel: ChapterViewModel
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var journalService: JournalService
    @EnvironmentObject var hapticEngine: HapticEngine
    
    let exercise: Exercise
    let chapter: Chapter
    
    @State private var response: String = ""
    @State private var selectedMood: Mood?
    @State private var tags: [String] = []
    @State private var newTag: String = ""
    @State private var showSaveConfirmation = false
    @State private var showHints = false
    
    init(exercise: Exercise, chapter: Chapter) {
        self.exercise = exercise
        self.chapter = chapter
        self._viewModel = ObservedObject(initialValue: ChapterViewModel(chapter: chapter, journalService: JournalService(), chapterRepository: ChapterRepository()))
    }
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                // Header
                headerSection
                
                // Instructions
                instructionsSection
                
                // Exercise-specific content
                exerciseContent
                
                // Response area
                responseSection
                
                // Mood & tags
                metadataSection
                
                // Action buttons
                actionButtons
            }
            .padding()
        }
        .navigationBarHidden(true)
        .background(Color(.systemGroupedBackground).ignoresSafeArea())
        .overlay(closeButton, alignment: .topTrailing)
        .alert("Save Entry?", isPresented: $showSaveConfirmation) {
            Button("Save") {
                saveEntry()
            }
            Button("Discard", role: .destructive) {
                dismiss()
            }
        } message: {
            Text("You have unsaved changes. Would you like to save this entry?")
        }
    }
    
    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                ExerciseIcon(type: exercise.type, difficulty: exercise.difficulty)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(exercise.title)
                        .font(.title2)
                        .fontWeight(.bold)
                    
                    HStack(spacing: 8) {
                        Label("\(exercise.durationMinutes) min", systemImage: "clock")
                        Label(exercise.difficulty.rawValue, systemImage: "chart.bar")
                    }
                    .font(.caption)
                    .foregroundColor(.secondary)
                }
            }
            
            if let template = exercise.template {
                Text(template.placeholder)
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.top, 4)
            }
        }
    }
    
    private var instructionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Instructions")
                    .font(.headline)
                
                Spacer()
                
                Button {
                    showHints.toggle()
                    hapticEngine.playIntensity(0.3)
                } label: {
                    Image(systemName: "lightbulb.fill")
                        .foregroundColor(.yellow)
                }
            }
            
            Text(exercise.instructions)
                .font(.body)
                .lineSpacing(4)
            
            if showHints, let template = exercise.template {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Suggestions:")
                        .font(.caption)
                        .fontWeight(.semibold)
                    
                    ForEach(template.suggestions, id: \.self) { suggestion in
                        Text("• \(suggestion)")
                            .font(.caption)
                            .foregroundColor(.secondary)
                    }
                }
                .padding(.top, 8)
                .padding(.leading, 12)
                .border(Color.accentColor.opacity(0.3), width: 1)
            }
        }
    }
    
    private var exerciseContent: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Exercise-specific UI elements
            switch exercise.type {
            case .journaling:
                journalingPrompts
                
            case .meditation:
                meditationTimer
                
            case .archetypeQuiz:
                archetypeQuiz
                
            case .festivalDesign:
                festivalDesignCanvas
                
            case .mirrorReflection:
                mirrorReflectionGuide
                
            case .visualization:
                visualizationGuide
                
            case .movement:
                movementInstructions
            }
        }
    }
    
    private var journalingPrompts: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Reflection Prompts:")
                .font(.caption)
                .fontWeight(.semibold)
            
            ForEach(chapter.prompts.prefix(3), id: \.id) { prompt in
                Text("• \(prompt.text)")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
    }
    
    private var meditationTimer: some View {
        VStack(spacing: 16) {
            Text("Meditation Timer")
                .font(.headline)
            
            // Would integrate with a timer view
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.accentColor.opacity(0.1))
                .frame(height: 60)
                .overlay(
                    Text("\(exercise.durationMinutes):00")
                        .font(.largeTitle)
                )
        }
    }
    
    private var archetypeQuiz: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Which archetype resonates with you today?")
                .font(.headline)
            
            // Would integrate with a quiz component
            ForEach(["Hero", "Sage", "Explorer", "Creator"], id: \.self) { archetype in
                Button(archetype) {
                    response += "\(archetype) energy feels present today. "
                    hapticEngine.playIntensity(0.2)
                }
                .buttonStyle(.bordered)
            }
        }
    }
    
    private var festivalDesignCanvas: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Design a ritual for this theme:")
                .font(.headline)
            
            TextEditor(text: $response)
                .frame(minHeight: 100)
                .cornerRadius(8)
        }
    }
    
    private var mirrorReflectionGuide: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("What do you see in your reflection?")
                .font(.headline)
            
            Text("Consider physical, emotional, and spiritual aspects.")
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
    
    private var visualizationGuide: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Visualize your ideal future self:")
                .font(.headline)
            
            List(1...5, id: \.self) { step in
                Text("Step \(step): Imagine...")
                    .font(.body)
            }
        }
    }
    
    private var movementInstructions: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Express this concept through movement:")
                .font(.headline)
            
            Text("Stand up, move around, let your body think.")
                .font(.body)
                .foregroundColor(.secondary)
        }
    }
    
    private var responseSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Your Response")
                .font(.headline)
            
            TextEditor(text: $response)
                .frame(minHeight: 200)
                .cornerRadius(8)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.accentColor.opacity(0.2), lineWidth: 1)
                )
                .onChange(of: response) { _ in
                    viewModel.updateCurrentEntry(response, mood: selectedMood, tags: tags)
                }
            
            if let wordLimit = exercise.template?.wordLimit {
                Text("\(response.wordCount)/\(wordLimit) words")
                    .font(.caption)
                    .foregroundColor(response.wordCount > wordLimit ? .red : .secondary)
                    .frame(maxWidth: .infinity, alignment: .trailing)
            }
        }
    }
    
    private var metadataSection: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Mood selector
            VStack(alignment: .leading, spacing: 8) {
                Text("How do you feel?")
                    .font(.headline)
                
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 12) {
                        ForEach(Mood.allCases, id: \.self) { mood in
                            MoodButton(mood: mood, isSelected: selectedMood == mood) {
                                selectedMood = mood
                                hapticEngine.playIntensity(0.1)
                            }
                        }
                    }
                }
            }
            
            // Tags
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text("Tags")
                        .font(.headline)
                    
                    Spacer()
                    
                    Button {
                        addTag()
                    } label: {
                        Image(systemName: "plus.circle.fill")
                    }
                }
                
                // Existing tags
                FlowLayout(spacing: 8) {
                    ForEach(tags, id: \.self) { tag in
                        TagView(text: tag, canRemove: true) {
                            tags.removeAll { $0 == tag }
                        }
                    }
                }
                
                // New tag input
                HStack {
                    TextField("Add tag...", text: $newTag)
                        .onSubmit {
                            addTag()
                        }
                    
                    if !newTag.isEmpty {
                        Button {
                            addTag()
                        } label: {
                            Image(systemName: "arrow.right.circle.fill")
                        }
                    }
                }
            }
        }
    }
    
    private var actionButtons: some View {
        HStack(spacing: 16) {
            Button {
                dismiss()
            } label: {
                Text("Cancel")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.bordered)
            
            Button {
                saveEntry()
            } label: {
                Text("Save Entry")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .disabled(response.isEmpty)
        }
    }
    
    private var closeButton: some View {
        Button {
            if !response.isEmpty {
                showSaveConfirmation = true
            } else {
                dismiss()
            }
        } label: {
            Image(systemName: "xmark.circle.fill")
                .font(.title2)
                .foregroundColor(.secondary)
                .padding()
        }
    }
    
    private func addTag() {
        let cleanTag = newTag.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !cleanTag.isEmpty, !tags.contains(cleanTag) else { return }
        
        tags.append(cleanTag)
        newTag = ""
        hapticEngine.playIntensity(0.1)
    }
    
    private func saveEntry() {
        let entry = JournalEntry(
            chapterId: chapter.id,
            exerciseId: exercise.id,
            promptId: nil,
            content: response,
            mood: selectedMood,
            tags: tags
        )
        
        journalService.addEntry(entry)
        viewModel.saveJournalEntry(entry)
        
        hapticEngine.playPattern(.breakthrough)
        dismiss()
    }
}

// MARK: - Supporting Views
struct ExerciseIcon: View {
    let type: ExerciseType
    let difficulty: DifficultyLevel
    
    var body: some View {
        ZStack {
            Circle()
                .fill(iconColor)
                .frame(width: 44, height: 44)
            
            Image(systemName: type.icon)
                .font(.title2)
                .foregroundColor(.white)
        }
        .overlay(
            Circle()
                .stroke(difficultyColor, lineWidth: 2)
                .frame(width: 48, height: 48)
        )
    }
    
    private var iconColor: Color {
        switch type {
        case .journaling: return .blue
        case .meditation: return .purple
        case .archetypeQuiz: return .green
        case .festivalDesign: return .orange
        case .mirrorReflection: return .indigo
        case .visualization: return .cyan
        case .movement: return .red
        }
    }
    
    private var difficultyColor: Color {
        switch difficulty {
        case .beginner: return .green
        case .intermediate: return .yellow
        case .advanced: return .orange
        case .expert: return .red
        }
    }
}

struct MoodButton: View {
    let mood: Mood
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Text(moodIcon)
                    .font(.system(size: 24))
                
                Text(mood.rawValue)
                    .font(.caption)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(isSelected ? Color.accentColor : Color(.systemGray6))
            .foregroundColor(isSelected ? .white : .primary)
            .cornerRadius(12)
        }
        .buttonStyle(PlainButtonStyle())
    }
    
    private var moodIcon: String {
        switch mood {
        case .reflective: return "🤔"
        case .inspired: return "✨"
        case .confused: return "😕"
        case .breakthrough: return "💡"
        case .challenged: return "💪"
        }
    }
}

struct TagView: View {
    let text: String
    let canRemove: Bool
    let removeAction: () -> Void
    
    init(text: String, canRemove: Bool = false, removeAction: @escaping () -> Void = {}) {
        self.text = text
        self.canRemove = canRemove
        self.removeAction = removeAction
    }
    
    var body: some View {
        HStack(spacing: 4) {
            Text(text)
                .font(.caption)
            
            if canRemove {
                Button(action: removeAction) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.caption2)
                }
            }
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 4)
        .background(Color(.systemGray6))
        .cornerRadius(8)
    }
}

// MARK: - String Extension
extension String {
    var wordCount: Int {
        components(separatedBy: .whitespacesAndNewlines)
            .filter { !$0.isEmpty }
            .count
    }
}