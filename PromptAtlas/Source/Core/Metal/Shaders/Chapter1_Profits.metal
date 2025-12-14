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
    
    // Time and audio-reactive parameters
    float time = uniforms.time;
    float audioLevel = uniforms.audioLevel;
    float intensity = uniforms.intensity;
    
    // Gold and wealth theme colors
    float3 goldColor = float3(1.0, 0.84, 0.0);
    float3 copperColor = float3(0.72, 0.45, 0.2);
    float3 silverColor = float3(0.75, 0.75, 0.75);
    
    // Create flowing gold patterns
    float goldPattern = 0.0;
    float2 goldUv = uv * 3.0 + float2(time * 0.1, time * 0.05);
    goldPattern = fbm(goldUv);
    
    // Add coin-like circles
    float coins = 0.0;
    for (int i = 0; i < 5; i++) {
        float2 coinPos = float2(
            0.2 + 0.6 * sin(time * 0.3 + float(i) * 1.5),
            0.3 + 0.4 * cos(time * 0.2 + float(i) * 1.2)
        );
        coins += circle(uv, coinPos, 0.08 + 0.02 * sin(time + float(i)));
    }
    
    // Audio-reactive wave effect
    float wave = sin(uv.y * 20.0 + time * 2.0 + audioLevel * 10.0) * 0.5 + 0.5;
    wave *= audioLevel;
    
    // Combine effects
    float3 color = goldColor * goldPattern;
    color = mix(color, copperColor, coins);
    color += wave * goldColor * 0.3;
    
    // Add sparkle effects
    float sparkle = random(uv * time) * audioLevel * 2.0;
    color += sparkle * silverColor;
    
    // Apply intensity
    color *= intensity;
    
    return float4(color, 1.0);
}

float circle(float2 st, float2 center, float radius) {
    float2 dist = st - center;
    return 1.0 - smoothstep(radius - 0.01, radius + 0.01, length(dist));
}