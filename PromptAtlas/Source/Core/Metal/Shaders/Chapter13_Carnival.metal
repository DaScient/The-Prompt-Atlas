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
    
    // Carnival colors - vibrant and festive
    float3 pinkColor = float3(1.0, 0.3, 0.7);
    float3 orangeColor = float3(1.0, 0.6, 0.2);
    float3 yellowColor = float3(1.0, 0.9, 0.3);
    float3 purpleColor = float3(0.8, 0.2, 1.0);
    
    // Spinning carnival wheel
    float wheelAngle = time * 0.5 + audioLevel * 2.0;
    float2 wheelCenter = float2(0.5, 0.5);
    float2 wheelDist = uv - wheelCenter;
    float wheelRadius = length(wheelDist);
    float wheelAngleLocal = atan2(wheelDist.y, wheelDist.x) + wheelAngle;
    
    // Color segments on wheel
    float segmentAngle = wheelAngleLocal / (2.0 * 3.14159) * 12.0; // 12 segments
    float segmentIndex = floor(segmentAngle);
    
    float3 wheelColor;
    if (fmod(segmentIndex, 4.0) == 0.0) wheelColor = pinkColor;
    else if (fmod(segmentIndex, 4.0) == 1.0) wheelColor = orangeColor;
    else if (fmod(segmentIndex, 4.0) == 2.0) wheelColor = yellowColor;
    else wheelColor = purpleColor;
    
    float wheelPattern = 1.0 - smoothstep(0.0, 0.4, wheelRadius);
    
    // Confetti particles
    float confetti = 0.0;
    for (int i = 0; i < 50; i++) {
        float2 confettiPos = float2(
            0.1 + 0.8 * sin(time * 0.3 + float(i) * 0.8),
            0.1 + 0.8 * cos(time * 0.4 + float(i) * 0.6)
        );
        float confettiSize = 0.005 + 0.003 * sin(time + float(i));
        confetti += circle(uv, confettiPos, confettiSize);
    }
    
    // Streamers
    float streamers = 0.0;
    for (int i = 0; i < 8; i++) {
        float streamerX = 0.1 + 0.8 * float(i) / 8.0;
        float streamerY = 0.1 + 0.8 * sin(time * 2.0 + float(i) * 0.5);
        float streamerWidth = 0.02;
        streamers += smoothstep(streamerX - streamerWidth, streamerX, uv.x) * 
                    smoothstep(streamerX + streamerWidth, streamerX, uv.x) * 
                    smoothstep(streamerY - 0.3, streamerY, uv.y) * 
                    smoothstep(streamerY + 0.3, streamerY, uv.y);
    }
    
    // Fireworks burst
    float fireworks = 0.0;
    float2 fireworkCenter = float2(
        0.3 + 0.4 * sin(time * 0.2),
        0.3 + 0.4 * cos(time * 0.3)
    );
    float fireworkDist = length(uv - fireworkCenter);
    float fireworkRadius = 0.1 + 0.05 * sin(time * 4.0);
    fireworks = 1.0 - smoothstep(fireworkRadius - 0.02, fireworkRadius + 0.02, fireworkDist);
    
    // Audio-reactive pulse
    float pulse = sin(time * 8.0) * audioLevel * 0.5 + 0.5;
    
    // Combine carnival effects
    float3 color = wheelColor * wheelPattern;
    color = mix(color, yellowColor, confetti * 0.7);
    color = mix(color, pinkColor, streamers * 0.5);
    color = mix(color, orangeColor, fireworks * 0.8);
    color += pulse * purpleColor * 0.3;
    
    // Add sparkle effects
    float sparkle = random(uv * time * 5.0) * audioLevel;
    color += sparkle * yellowColor;
    
    // Apply intensity
    color *= intensity;
    
    return float4(color, 1.0);
}