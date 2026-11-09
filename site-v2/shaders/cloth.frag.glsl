precision mediump float;
varying vec2 uv;
varying vec3 normal;
varying float depth;

// The runtime inserts patterns.glsl at this marker.
// @patterns

void main() {
    vec3 n = normalize(normal);
    vec3 light = normalize(vec3(-0.6, 0.65, 1.0));
    float diffuse = max(dot(n, light), 0.0);
    vec3 halfway = normalize(light + vec3(0.0, 0.0, 1.0));
    float sheen = pow(max(dot(n, halfway), 0.0), 22.0);
    vec3 color = patternColor(uv);
    float thread = sin(uv.x * 1608.0) * sin(uv.y * 1608.0) * 0.013;
    float shade = 0.48 + 0.68 * diffuse + depth * 0.1;
    color = color * shade + vec3(1.0, 0.92, 0.77) * sheen * 0.22 + thread;
    gl_FragColor = vec4(color, 1.0);
}
