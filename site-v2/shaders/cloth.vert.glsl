// Vertex displacement and finite-difference normals.
attribute vec2 a;
uniform float t;
uniform float aspect;
// x: angle, y: frequency, z: amplitude, w: signed speed.
uniform vec4 waves[6];
varying vec2 uv;
varying vec3 normal;
varying float depth;

float heightAt(vec2 p) {
    vec2 q = p + vec2(0.13 * sin(p.y * 2.1 + t * 0.12),
                      0.11 * cos(p.x * 2.8 - t * 0.10));
    float h = 0.0;
    for (int i = 0; i < 6; i++) {
        vec4 w = waves[i];
        float fi = float(i);
        float angle = w.x + 0.48 * sin(t * 0.07 + fi * 1.7)
                         + 0.16 * sin(p.y * 1.3 + p.x * 0.8 + fi);
        vec2 direction = vec2(cos(angle), sin(angle));
        float amplitude = w.z * (0.72 + 0.28 * sin(t * 0.14 + fi * 2.1 + p.x * 0.9));
        float frequency = w.y * (1.0 + 0.12 * sin(t * 0.08 + fi));
        h += amplitude * sin(dot(q, direction) * frequency + t * w.w + fi * 1.63);
    }
    return h;
}

void main() {
    vec2 p = a * 2.0 - 1.0;
    float z = heightAt(p);
    float dx = (heightAt(p + vec2(0.003, 0.0)) - z) / 0.003;
    float dy = (heightAt(p + vec2(0.0, 0.003)) - z) / 0.003;
    normal = normalize(vec3(-dx * 0.50, -dy * 0.50, 1.0));
    depth = z;
    uv = vec2(a.x * aspect * 2.3, a.y * 2.3);
    p += vec2(0.035 * sin(p.y * 2.8 + p.x + t * 0.16),
              0.035 * cos(p.x * 3.1 - p.y - t * 0.13));
    gl_Position = vec4(p * 1.23, z * 0.12, 1.0 + z * 0.14);
}
