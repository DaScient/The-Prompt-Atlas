import Foundation
import Combine
import MetalKit

class ExperienceViewModel: ObservableObject {
    @Published var chapter: Chapter
    @Published var isRendering = false
    @Published var currentIntensity: Float = 0.5
    @Published var audioLevel: Float = 0.0
    @Published var hapticIntensity: Float = 0.0
    
    private var renderer: MetalRenderer?
    private var mtkView: MTKView?
    private var audioEngine: AudioEngine
    private var hapticEngine: HapticEngine
    private var cancellables = Set<AnyCancellable>()
    private var startTime = Date()
    
    init(chapter: Chapter, audioEngine: AudioEngine, hapticEngine: HapticEngine) {
        self.chapter = chapter
        self.audioEngine = audioEngine
        self.hapticEngine = hapticEngine
        
        setupAudioBinding()
    }
    
    func setupRenderer() -> MTKView? {
        mtkView = MTKView()
        guard let mtkView = mtkView else { return nil }
        
        guard let device = MTLCreateSystemDefaultDevice(),
              let renderer = MetalRenderer(device: device) else {
            return nil
        }
        
        self.renderer = renderer
        mtkView.device = device
        mtkView.delegate = renderer
        mtkView.preferredFramesPerSecond = 60
        
        isRendering = true
        startTime = Date()
        
        return mtkView
    }
    
    private func setupAudioBinding() {
        audioEngine.$audioLevel
            .receive(on: DispatchQueue.main)
            .sink { [weak self] level in
                self?.audioLevel = level
                self?.updateRendererWithAudio(level)
                self?.triggerHapticFeedback(level)
            }
            .store(in: &cancellables)
    }
    
    private func updateRendererWithAudio(_ level: Float) {
        guard let renderer = renderer else { return }
        
        let parameters: [String: Any] = [
            "audioLevel": level,
            "time": Float(Date().timeIntervalSince(startTime)),
            "intensity": currentIntensity,
            "theme": chapter.visualTheme
        ]
        
        renderer.updateParameters(parameters)
    }
    
    private func triggerHapticFeedback(_ level: Float) {
        hapticIntensity = level
        hapticEngine.playIntensity(level * 0.8)
    }
    
    func updateIntensity(_ intensity: Float) {
        currentIntensity = intensity
    }
    
    func updateParameters(_ parameters: [String: Any]) {
        renderer?.updateParameters(parameters)
    }
    
    func pauseRendering() {
        isRendering = false
        mtkView?.isPaused = true
    }
    
    func resumeRendering() {
        isRendering = true
        mtkView?.isPaused = false
    }
    
    func cleanup() {
        pauseRendering()
        cancellables.forEach { $0.cancel() }
        cancellables.removeAll()
    }
}