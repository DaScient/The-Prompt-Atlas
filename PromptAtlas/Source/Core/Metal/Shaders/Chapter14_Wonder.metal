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
    
    // Wonder colors - ethereal blues and whites
    float3 skyBlueColor = float3(0.3, 0.8, 1.0);
    float3 cloudWhiteColor = float3(0.95, 0.95, 1.0);
    float3 starColor = float3(1.0, 1.0, 0.8);
    float3 nebulaColor = float3(0.6, 0.4, 1.0);
    
    // Aurora-like flowing patterns
    float aurora = 0.0;
    float2 auroraUv = uv * 6.0 + float2(time * 0.1, time * 0.15);
    aurora = fbm(auroraUv);
    aurora *= sin(auroraUv.x * 3.0 + time * 2.0) * 0.5 + 0.5;
    
    // Floating particles of light (wonder dust)
    float particles = 0.0;
    for (int i = 0; i < 30; i++) {
        float2 particlePos = float2(
            0.05 + 0.9 * sin(time * 0.1 + float(i) * 0.3),
            0.05 + 0.9 * cos(time * 0.08 + float(i) * 0.4)
        );
        float particleSize = 0.003 + 0.002 * sin(time + float(i));
        particles += circle(uv, particlePos, particleSize);
    }
    
    // Constellation patterns
    float constellation = 0.0;
    float2 constellationCenter = float2(0.7, 0.3);
    float2 constellationDist = uv - constellationCenter;
    
    // Create star pattern
    for (int i = 0; i < 7; i++) {
        float starAngle = float(i) * 0.9 + time * 0.05;
        float starRadius = 0.15 + 0.05 * sin(time * 0.3 + float(i));
        float2 starPos = constellationCenter + float2(
            cos(starAngle) * starRadius,
            sin(starAngle) * starRadius
        );
        constellation += circle(uv, starPos, 0.008);
    }
    
    // Central wonder burst
    float2 center = float2(0.5, 0.5);
    float2 dist = uv - center;
    float radius = length(dist);
    float angle = atan2(dist.y, dist.x);
    
    float wonderBurst = 1.0 - smoothstep(0.0, 0.6, radius);
    wonderBurst *= sin(angle * 8.0 + time * 3.0) * 0.5 + 0.5;
    
    // Gentle wave motion
    float wave = sin(uv.x * 15.0 + time * 1.5) * sin(uv.y * 10.0 + time * 1.2) * 0.1;
    
    // Audio-reactive glow
    float glow = audioLevel * (1.0 - radius) * 2.0;
    
    // Combine wonder effects
    float3 color = skyBlueColor * (1.0 - aurora * 0.4);
    color = mix(color, cloudWhiteColor, particles * 0.8);
    color = mix(color, starColor, constellation * 0.9);
    color = mix(color, nebulaColor, wonderBurst * 0.6);
    color += wave * cloudWhiteColor * 0.2;
    color += glow * starColor * 0.5;
    
    // Add ethereal shimmer
    float shimmer = sin(time * 4.0 + radius * 10.0) * audioLevel * 0.3 + 0.7;
    color *= shimmer;
    
    // Apply intensity
    color *= intensity;
    
    return float4(color, 1.0);
}