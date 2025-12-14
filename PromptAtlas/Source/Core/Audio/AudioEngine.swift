import AVFoundation
import Combine

class AudioEngine: ObservableObject {
    @Published var isAuthorized = false
    @Published var isRecording = false
    @Published var audioLevel: Float = 0.0
    
    private var audioEngine = AVAudioEngine()
    private var inputNode: AVAudioInputNode?
    private var audioSession = AVAudioSession.sharedInstance()
    private var levelTimer: Timer?
    private var cancellables = Set<AnyCancellable>()
    
    deinit {
        stop()
    }
    
    func requestPermissions() {
        audioSession.requestRecordPermission { [weak self] granted in
            DispatchQueue.main.async {
                self?.isAuthorized = granted
            }
        }
    }
    
    func start() throws {
        guard isAuthorized else { throw AudioError.notAuthorized }
        
        do {
            try configureAudioSession()
            try setupAudioEngine()
            try audioEngine.start()
            isRecording = true
            startLevelMonitoring()
        } catch {
            throw AudioError.engineSetupFailed(error)
        }
    }
    
    func stop() {
        audioEngine.stop()
        audioEngine.reset()
        isRecording = false
        levelTimer?.invalidate()
        levelTimer = nil
    }
    
    private func configureAudioSession() throws {
        try audioSession.setCategory(.playAndRecord, mode: .measurement, options: [])
        try audioSession.setActive(true, options: .notifyOthersOnDeactivation)
    }
    
    private func setupAudioEngine() throws {
        inputNode = audioEngine.inputNode
        let bus = 0
        
        let format = inputNode!.outputFormat(forBus: bus)
        
        inputNode!.installTap(onBus: bus, bufferSize: 1024, format: format) { buffer, _ in
            let level = self.calculateAudioLevel(from: buffer)
            DispatchQueue.main.async {
                self.audioLevel = level
            }
        }
    }
    
    private func calculateAudioLevel(from buffer: AVAudioPCMBuffer) -> Float {
        guard let channelData = buffer.floatChannelData?[0] else { return 0.0 }
        let channelDataArray = Array(UnsafeBufferPointer(start: channelData, count: Int(buffer.frameLength)))
        
        let rms = sqrt(channelDataArray.map { $0 * $0 }.reduce(0, +) / Float(buffer.frameLength))
        let level = 20 * log10(rms)
        
        return max(0, (level + 80) / 80) // Normalize to 0-1
    }
    
    private func startLevelMonitoring() {
        levelTimer = Timer.scheduledTimer(withTimeInterval: 0.05, repeats: true) { _ in
            // Audio level is updated by the tap
        }
    }
    
    enum AudioError: LocalizedError {
        case notAuthorized
        case engineSetupFailed(Error)
        
        var errorDescription: String? {
            switch self {
            case .notAuthorized:
                return "Microphone access not authorized"
            case .engineSetupFailed(let error):
                return "Failed to setup audio engine: \(error.localizedDescription)"
            }
        }
    }
}