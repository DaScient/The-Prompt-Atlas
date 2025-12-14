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
    
    // Nature colors
    float3 leafColor = float3(0.2, 0.8, 0.2);
    float3 earthColor = float3(0.4, 0.2, 0.1);
    float3 skyColor = float3(0.5, 0.7, 1.0);
    
    // Organic growth patterns
    float growth = 0.0;
    float2 growthUv = uv * 4.0 + float2(time * 0.05, time * 0.08);
    growth = fbm(growthUv);
    
    // Branching tree-like structures
    float branches = 0.0;
    float2 branchUv = uv * 8.0;
    float angle = atan2(branchUv.y - 0.5, branchUv.x - 0.5);
    float radius = length(branchUv - float2(0.5));
    
    for (int i = 0; i < 8; i++) {
        float branchAngle = float(i) * 0.785 + sin(time * 0.1) * 0.2;
        float branchWidth = 0.1 + 0.05 * sin(time * 0.3 + float(i));
        float branchDist = abs(angle - branchAngle);
        if (branchDist < branchWidth && radius > 0.1 && radius < 0.4) {
            branches = 1.0;
        }
    }
    
    // Leaf particles
    float leaves = 0.0;
    for (int i = 0; i < 20; i++) {
        float2 leafPos = float2(
            0.1 + 0.8 * sin(time * 0.2 + float(i) * 0.5),
            0.1 + 0.8 * cos(time * 0.15 + float(i) * 0.7)
        );
        float leafSize = 0.02 + 0.01 * sin(time + float(i));
        leaves += circle(uv, leafPos, leafSize);
    }
    
    // Wind effect from audio
    float windStrength = audioLevel * 2.0;
    float windPattern = sin(uv.x * 30.0 + time * 3.0) * windStrength;
    
    // Combine nature elements
    float3 color = skyColor * (1.0 - growth * 0.3);
    color = mix(color, leafColor, branches);
    color = mix(color, earthColor, leaves * 0.5);
    color += windPattern * leafColor * 0.2;
    
    // Add organic flow
    float flow = sin(uv.x * 10.0 + uv.y * 5.0 + time) * 0.1;
    color += flow * leafColor;
    
    // Apply intensity
    color *= intensity;
    
    return float4(color, 1.0);
}