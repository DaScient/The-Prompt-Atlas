import Foundation
import Accelerate

class AudioAnalyzer {
    typealias AudioCallback = ([Float]) -> Void
    
    private var sampleRate: Double = 44100
    private var fftSize: vDSP_Length = 1024
    private var log2n: vDSP_Length = 10
    private var fftSetup: FFTSetup?
    private var window: [Float]
    
    init(sampleRate: Double = 44100, fftSize: Int = 1024) {
        self.sampleRate = sampleRate
        self.fftSize = vDSP_Length(fftSize)
        self.log2n = vDSP_Length(log2(Double(fftSize)) / log2(2.0))
        
        self.window = [Float](repeating: 0, count: Int(fftSize))
        vDSP_hamm_window(&window, vDSP_Length(fftSize), 0)
        
        self.fftSetup = vDSP_create_fftsetup(log2n, FFTRadix(kFFTRadix2))
    }
    
    deinit {
        if let fftSetup = fftSetup {
            vDSP_destroy_fftsetup(fftSetup)
        }
    }
    
    func analyzeAudioBuffer(_ buffer: [Float], callback: AudioCallback) {
        guard buffer.count == window.count else { return }
        
        var windowedAudio = [Float](repeating: 0, count: Int(fftSize))
        vDSP_vmul(buffer, 1, window, 1, &windowedAudio, 1, vDSP_Length(fftSize))
        
        var realp = [Float](windowedAudio)
        var imagp = [Float](repeating: 0, count: Int(fftSize))
        var splitComplex = DSPSplitComplex(realp: &realp, imagp: &imagp)
        
        vDSP_fft_zip(fftSetup!, &splitComplex, 1, log2n, FFTDirection(FFT_FORWARD))
        
        var magnitudes = [Float](repeating: 0, count: Int(fftSize / 2))
        vDSP_zvmags(&splitComplex, 1, &magnitudes, 1, vDSP_Length(fftSize / 2))
        
        var normalizedMagnitudes = [Float](repeating: 0, count: Int(fftSize / 2))
        var zero: Float = 0
        vDSP_vsqrt(&magnitudes, 1, &normalizedMagnitudes, 1, vDSP_Length(fftSize / 2))
        vDSP_vsmul(&normalizedMagnitudes, 1, &zero, &normalizedMagnitudes, 1, vDSP_Length(fftSize / 2))
        
        callback(normalizedMagnitudes)
    }
    
    func frequencyBins() -> [Float] {
        let nyquist = Float(sampleRate / 2.0)
        let binWidth = nyquist / Float(fftSize / 2)
        
        return (0..<Int(fftSize / 2)).map { Float($0) * binWidth }
    }
}