#include <metal_stdlib>
using namespace metal;

#include "Common.metal"

fragment float4 fragment_main(
    VertexOut in [[stage_in]],
    const device Uniforms& uniforms [[buffer(1)]],
    float2 pixelCoord [[position]]
) {
    float2 uv = in.texCoord;
    float2 st = uv;
    
    float time = uniforms.time;
    float audioLevel = uniforms.audioLevel;
    float intensity = uniforms.intensity;
    
    // Mirror/reflection colors - silvers and blues
    float3 silverColor = float3(0.75, 0.75, 0.85);
    float3 blueColor = float3(0.3, 0.4, 0.8);
    float3 purpleColor = float3(0.5, 0.3, 0.7);
    
    // Mirror distortion effect
    float2 center = float2(0.5, 0.5);
    float2 dist = uv - center;
    float distLength = length(dist);
    
    // Radial distortion
    float distortion = 1.0 + sin(time * 2.0) * 0.1 * audioLevel;
    float2 distortedUv = center + dist * distortion;
    
    // Mirror-like reflections
    float reflection = 1.0 - smoothstep(0.0, 0.7, distLength);
    
    // Fractal mirror patterns
    float mirrorPattern = 0.0;
    float2 mirrorUv = distortedUv * 8.0;
    
    for (int i = 0; i < 4; i++) {
        float scale = pow(2.0, float(i));
        mirrorPattern += sin(mirrorUv.x * scale + time) * cos(mirrorUv.y * scale + time) / scale;
    }
    
    mirrorPattern = abs(mirrorPattern) * 0.5 + 0.5;
    
    // Kaleidoscope effect
    float angle = atan2(dist.y, dist.x);
    float radius = length(dist);
    
    float kaleidoscope = 0.0;
    float segments = 8.0;
    float segmentAngle = angle * segments / (2.0 * 3.14159);
    kaleidoscope = sin(segmentAngle * 2.0 * 3.14159 + time) * 0.5 + 0.5;
    
    // Shimmer effect from audio
    float shimmer = sin(time * 5.0 + radius * 20.0) * audioLevel * 0.5 + 0.5;
    
    // Combine mirror effects
    float3 color = silverColor * reflection;
    color = mix(color, blueColor, mirrorPattern * 0.3);
    color = mix(color, purpleColor, kaleidoscope * 0.2);
    color += shimmer * silverColor * 0.4;
    
    // Add depth and dimension
    float depth = 1.0 - distLength;
    color *= depth;
    
    // Glint effects
    float glint = random(uv * time * 10.0) * audioLevel * 2.0;
    color += glint * silverColor;
    
    // Apply intensity
    color *= intensity;
    
    return float4(color, 1.0);
}