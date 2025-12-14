#include <metal_stdlib>
using namespace metal;

// Common structures and functions for all shaders

struct Vertex {
    float2 position [[attribute(0)]];
    float2 texCoord [[attribute(1)]];
};

struct Uniforms {
    float time;
    float audioLevel;
    float intensity;
    float4 primaryColor;
    float4 secondaryColor;
    float4 accentColor;
};

struct VertexOut {
    float4 position [[position]];
    float2 texCoord;
};

// Vertex shader
vertex VertexOut vertex_main(
    const device Vertex* vertices [[buffer(0)]],
    const device Uniforms& uniforms [[buffer(1)]],
    uint vertexId [[vertex_id]]
) {
    VertexOut out;
    Vertex vertex = vertices[vertexId];
    
    out.position = float4(vertex.position, 0.0, 1.0);
    out.texCoord = vertex.texCoord;
    
    return out;
}

// Common utility functions
float random(float2 st) {
    return fract(sin(dot(st.xy, float2(12.9898,78.233))) * 43758.5453123);
}

float noise(float2 st) {
    float2 i = floor(st);
    float2 f = fract(st);
    
    float a = random(i);
    float b = random(i + float2(1.0, 0.0));
    float c = random(i + float2(0.0, 1.0));
    float d = random(i + float2(1.0, 1.0));
    
    float2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(float2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.0;
    
    for (int i = 0; i < 6; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

float circle(float2 st, float radius) {
    float2 dist = st - float2(0.5);
    return 1.0 - smoothstep(radius - 0.01, radius + 0.01, length(dist));
}

float3 hsv2rgb(float3 c) {
    float4 K = float4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    float3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}