import SwiftUI
import MetalKit
import Combine

struct ExperienceView: View {
    @StateObject private var viewModel: ExperienceViewModel
    @Environment(\.dismiss) private var dismiss
    @EnvironmentObject var appConfiguration: AppConfiguration
    @EnvironmentObject var hapticEngine: HapticEngine
    
    @State private var showingControls = false
    @State private var intensity: Float = 0.5
    
    init(chapter: Chapter, audioEngine: AudioEngine, hapticEngine: HapticEngine) {
        self._viewModel = StateObject(wrappedValue: ExperienceViewModel(chapter: chapter, audioEngine: audioEngine, hapticEngine: hapticEngine))
    }
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Fullscreen Metal renderer
                if let mtkView = viewModel.setupRenderer() {
                    MetalView(renderer: mtkView)
                        .ignoresSafeArea()
                        .onAppear {
                            viewModel.resumeRendering()
                        }
                        .onDisappear {
                            viewModel.cleanup()
                        }
                        .gesture(
                            DragGesture(minimumDistance: 0)
                                .onChanged { value in
                                    handleDrag(value, in: geometry.size)
                                }
                        )
                }
                
                // Overlay UI
                overlayContent
                
                // Controls
                if showingControls {
                    controlPanel
                }
            }
        }
        .statusBar(hidden: true)
    }
    
    private var overlayContent: some View {
        VStack {
            // Top bar
            HStack {
                Button {
                    dismiss()
                } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.largeTitle)
                        .foregroundColor(.white)
                        .shadow(radius: 4)
                }
                
                Spacer()
                
                Button {
                    showingControls.toggle()
                } label: {
                    Image(systemName: showingControls ? "slider.horizontal.3" : "circle")
                        .font(.title2)
                        .foregroundColor(.white.opacity(showingControls ? 1.0 : 0.6))
                        .shadow(radius: 4)
                }
            }
            .padding()
            
            Spacer()
            
            // Chapter info
            VStack(spacing: 12) {
                Text(viewModel.chapter.title)
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(.white)
                    .shadow(radius: 8)
                
                Text("Immersive Experience Mode")
                    .font(.headline)
                    .foregroundColor(.white.opacity(0.8))
                    .shadow(radius: 4)
                
                // Audio visualization
                if appConfiguration.audioReactiveEnabled {
                    AudioLevelIndicator(level: viewModel.audioLevel)
                        .frame(width: 200, height: 40)
                }
            }
            .padding(.bottom, 40)
        }
    }
    
    private var controlPanel: some View {
        VStack(spacing: 20) {
            Spacer()
            
            VStack(spacing: 16) {
                Text("Intensity Control")
                    .font(.headline)
                    .foregroundColor(.white)
                
                Slider(value: $intensity, in: 0.1...1.0) {
                    Text("Intensity")
                } minimumValueLabel: {
                    Text("Low")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.6))
                } maximumValueLabel: {
                    Text("High")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.6))
                }
                .accentColor(.white)
                .onChange(of: intensity) { newValue in
                    viewModel.updateIntensity(newValue)
                }
                
                HStack(spacing: 16) {
                    Button {
                        viewModel.pauseRendering()
                    } label: {
                        Label("Pause", systemImage: "pause.fill")
                            .foregroundColor(.white)
                    }
                    
                    Button {
                        viewModel.resumeRendering()
                    } label: {
                        Label("Resume", systemImage: "play.fill")
                            .foregroundColor(.white)
                    }
                    
                    Button {
                        // Reset renderer
                    } label: {
                        Label("Reset", systemImage: "arrow.clockwise")
                            .foregroundColor(.white)
                    }
                }
                .font(.caption)
            }
            .padding()
            .background(.ultraThinMaterial)
            .cornerRadius(20)
        }
        .padding()
    }
    
    private func handleDrag(_ value: DragGesture.Value, in size: CGSize) {
        let location = value.location
        let normalizedX = Float(location.x / size.width)
        let normalizedY = Float(location.y / size.height)
        
        viewModel.updateParameters([
            "touchX": normalizedX,
            "touchY": normalizedY,
            "touchPhase": "moved"
        ])
    }
}

// MARK: - Metal View Wrapper
struct MetalView: UIViewRepresentable {
    let renderer: MTKViewDelegate
    
    func makeUIView(context: Context) -> MTKView {
        let mtkView = MTKView()
        mtkView.delegate = renderer
        mtkView.preferredFramesPerSecond = 60
        mtkView.enableSetNeedsDisplay = true
        return mtkView
    }
    
    func updateUIView(_ uiView: MTKView, context: Context) {
        // Update if needed
    }
}

// MARK: - Audio Level Indicator
struct AudioLevelIndicator: View {
    let level: Float
    
    var body: some View {
        HStack(spacing: 2) {
            ForEach(0..<20) { index in
                let barLevel = Float(index) / 20.0
                let opacity = level > barLevel ? 1.0 : 0.3
                
                RoundedRectangle(cornerRadius: 2)
                    .fill(Color.white.opacity(Double(opacity)))
                    .frame(width: 4, height: 20)
                    .animation(.spring(response: 0.1), value: opacity)
            }
        }
    }
}