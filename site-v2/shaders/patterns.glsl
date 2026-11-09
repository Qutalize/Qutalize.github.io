// Procedural textile patterns. uv is a repeating surface coordinate.
// uPattern: 0 = leaves, 1 = diamonds, 2 = plaid, 3 = lattice, 4 = arcs, 5 = hexagons.
uniform int uPattern;
float lineMask(float distanceToLine, float width) {
    return 1.0 - smoothstep(width, width + 0.015, abs(distanceToLine));
}
vec3 patternColor(vec2 uv) {
    vec2 p = fract(uv * 4.0) - 0.5;
    vec3 ink = vec3(0.08, 0.24, 0.28);
    vec3 ivory = vec3(0.88, 0.88, 0.82);
    vec3 gold = vec3(0.71, 0.56, 0.34);
    if (uPattern == 0) {
        // Intersecting circles form nested leaf-shaped outlines.
        p = mat2(0.707, -0.707, 0.707, 0.707) * p;
        float leaf = max(length(p - vec2(0.16, 0.0)),
                         length(p + vec2(0.16, 0.0)));
        float rings = max(lineMask(leaf - 0.34, 0.008),
                          lineMask(leaf - 0.25, 0.008));
        vec3 color = mix(ink, ivory, rings);
        return mix(color, gold, lineMask(leaf - 0.295, 0.01));
    }
    if (uPattern == 1) {
        float diamond = abs(p.x) + abs(p.y);
        vec3 base = vec3(0.145, 0.14, 0.22);
        float rings = max(lineMask(diamond - 0.42, 0.012),
                          lineMask(diamond - 0.22, 0.012));
        vec3 color = mix(base, gold, rings);
        return mix(color, vec3(0.45, 0.71, 0.65),
                   lineMask(diamond - 0.32, 0.022));
    }
    if (uPattern == 2) {
        vec2 diagonal = vec2(uv.x + uv.y, uv.x - uv.y) * 4.0;
        vec2 bands = abs(fract(diagonal) - 0.5);
        vec3 color = mix(ivory, ink, 1.0 - smoothstep(0.07, 0.085, bands.x));
        color = mix(color, vec3(0.30, 0.51, 0.49),
                    (1.0 - smoothstep(0.045, 0.06, bands.y)) * 0.85);
        float trim = max(lineMask(bands.x - 0.16, 0.008),
                         lineMask(bands.y - 0.14, 0.006));
        return mix(color, gold, trim);
    }
    if (uPattern == 4) {
        // Staggered semicircular fans, drawn from concentric distance fields.
        vec2 q = uv * vec2(5.0, 7.0);
        float mask = 0.0;
        for (int row = 0; row < 2; row++) {
            float y = floor(q.y) - float(row);
            vec2 local = vec2(fract(q.x - mod(y, 2.0) * 0.5) - 0.5, q.y - y);
            float radius = length(local);
            float rings = max(lineMask(radius - 0.32, 0.01), lineMask(radius - 0.52, 0.01));
            rings = max(rings, lineMask(radius - 0.72, 0.012));
            mask = max(mask, rings);
        }
        return mix(vec3(0.14, 0.28, 0.36), vec3(0.78, 0.87, 0.85), mask);
    }
    if (uPattern == 5) {
        // Nearest cell of two staggered rectangular lattices forms a hexagon.
        vec2 q = uv * 8.0;
        vec2 period = vec2(1.73205, 3.0);
        vec2 a = mod(q, period) - period * 0.5;
        vec2 b = mod(q - period * 0.5, period) - period * 0.5;
        vec2 cell = dot(a, a) < dot(b, b) ? a : b;
        vec2 v = abs(cell);
        float edge = max(v.x, dot(v, vec2(0.5, 0.866025)));
        float outline = max(lineMask(edge - 0.82, 0.012), lineMask(edge - 0.64, 0.009));
        vec3 color = mix(vec3(0.27, 0.21, 0.31), gold, outline);
        return mix(color, ivory, 1.0 - smoothstep(0.035, 0.06, length(cell)));
    }
    float diamond = abs(p.x) + abs(p.y);
    float lattice = max(lineMask(diamond - 0.37, 0.009),
                        lineMask(abs(p.x) - abs(p.y), 0.006));
    vec3 color = mix(vec3(0.10, 0.24, 0.21),
                     vec3(0.65, 0.72, 0.64), lattice);
    return mix(color, gold, 1.0 - smoothstep(0.025, 0.04, length(p)));
}
