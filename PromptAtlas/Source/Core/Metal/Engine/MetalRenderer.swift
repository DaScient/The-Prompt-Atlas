import Metal
import MetalKit
import simd

class MetalRenderer: NSObject, MTKViewDelegate {
    let device: MTLDevice
    let commandQueue: MTLCommandQueue
    let library: MTLLibrary
    
    private var renderPipeline: MTLRenderPipelineState?
    private var vertexBuffer: MTLBuffer?
    private var uniformBuffer: MTLBuffer?
    private var texture: MTLTexture?
    
    var time: Float = 0.0
    var audioLevel: Float = 0.0
    var intensity: Float = 0.5
    var theme: VisualTheme = .wonder
    
    init?(device: MTLDevice) {
        self.device = device
        
        guard let commandQueue = device.makeCommandQueue(),
              let library = device.makeDefaultLibrary() else {
            return nil
        }
        
        self.commandQueue = commandQueue
        self.library = library
        
        super.init()
        
        setupPipeline()
        setupBuffers()
    }
    
    private func setupPipeline() {
        let vertexFunction = library.makeFunction(name: "vertex_main")
        let fragmentFunction = library.makeFunction(name: "fragment_main")
        
        let pipelineDescriptor = MTLRenderPipelineDescriptor()
        pipelineDescriptor.vertexFunction = vertexFunction
        pipelineDescriptor.fragmentFunction = fragmentFunction
        pipelineDescriptor.colorAttachments[0].pixelFormat = .bgra8Unorm
        
        do {
            renderPipeline = try device.makeRenderPipelineState(descriptor: pipelineDescriptor)
        } catch {
            print("Failed to create render pipeline: \(error)")
        }
    }
    
    private func setupBuffers() {
        // Create vertex buffer for full-screen quad
        let vertices: [Vertex] = [
            Vertex(position: SIMD2<Float>(-1, -1), texCoord: SIMD2<Float>(0, 1)),
            Vertex(position: SIMD2<Float>(1, -1), texCoord: SIMD2<Float>(1, 1)),
            Vertex(position: SIMD2<Float>(-1, 1), texCoord: SIMD2<Float>(0, 0)),
            Vertex(position: SIMD2<Float>(1, 1), texCoord: SIMD2<Float>(1, 0))
        ]
        
        vertexBuffer = device.makeBuffer(bytes: vertices, length: MemoryLayout<Vertex>.stride * vertices.count, options: .cpuCacheModeWriteCombined)
        
        // Create uniform buffer
        uniformBuffer = device.makeBuffer(length: MemoryLayout<Uniforms>.stride, options: .cpuCacheModeWriteCombined)
    }
    
    // MARK: - MTKViewDelegate
    
    func mtkView(_ view: MTKView, drawableSizeWillChange size: CGSize) {
        // Handle size changes if needed
    }
    
    func draw(in view: MTKView) {
        guard let renderPipeline = renderPipeline,
              let commandBuffer = commandQueue.makeCommandBuffer(),
              let renderPassDescriptor = view.currentRenderPassDescriptor,
              let renderEncoder = commandBuffer.makeRenderCommandEncoder(descriptor: renderPassDescriptor) else {
            return
        }
        
        // Update uniforms
        updateUniforms()
        
        // Set render pipeline
        renderEncoder.setRenderPipelineState(renderPipeline)
        
        // Set vertex buffer
        renderEncoder.setVertexBuffer(vertexBuffer, offset: 0, index: 0)
        
        // Set uniform buffer
        renderEncoder.setVertexBuffer(uniformBuffer, offset: 0, index: 1)
        renderEncoder.setFragmentBuffer(uniformBuffer, offset: 0, index: 1)
        
        // Draw
        renderEncoder.drawPrimitives(type: .triangleStrip, vertexStart: 0, vertexCount: 4)
        
        // End encoding
        renderEncoder.endEncoding()
        
        // Present drawable
        if let drawable = view.currentDrawable {
            commandBuffer.present(drawable)
        }
        
        commandBuffer.commit()
        
        // Update time
        time += 0.016 // Assume 60 FPS
    }
    
    private func updateUniforms() {
        guard let uniformBuffer = uniformBuffer else { return }
        
        let uniforms = Uniforms(
            time: time,
            audioLevel: audioLevel,
            intensity: intensity,
            primaryColor: theme.colors.primary,
            secondaryColor: theme.colors.secondary,
            accentColor: theme.colors.accent
        )
        
        memcpy(uniformBuffer.contents(), &uniforms, MemoryLayout<Uniforms>.stride)
    }
    
    func updateParameters(_ parameters: [String: Any]) {
        if let audioLevel = parameters["audioLevel"] as? Float {
            self.audioLevel = audioLevel
        }
        if let intensity = parameters["intensity"] as? Float {
            self.intensity = intensity
        }
        if let theme = parameters["theme"] as? VisualTheme {
            self.theme = theme
        }
    }
}

// MARK: - Data Structures
struct Vertex {
    var position: SIMD2<Float>
    var texCoord: SIMD2<Float>
}

struct Uniforms {
    var time: Float
    var audioLevel: Float
    var intensity: Float
    var primaryColor: SIMD4<Float>
    var secondaryColor: SIMD4<Float>
    var accentColor: SIMD4<Float>
}