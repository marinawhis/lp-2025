precision mediump float;

// builtin
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

// custom
uniform float u_active;
uniform float u_pulse;

void main() {
    float x = gl_FragCoord.x / 3.2;
    float y = gl_FragCoord.y / 3.2;

    int index = int(mod(float(y), 8.0)) * 8 + int(mod(float(x), 8.0));

    float nx = float(x) / u_resolution.x * 3.2;
    float ny = float(y) / u_resolution.y * 3.2;

    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float wave = sin((nx * 8.5 + u_time) * 1.4) + cos((ny * 8.2 - u_time) * 1.3);
    float swirl = sin((nx * 1.5 + ny * 1.5 + u_time * 0.3) * 6.0);

    vec2 mouseUV = u_mouse / u_resolution;
    float dx = nx - mouseUV.x;
    float dy = ny - mouseUV.y;
    float pointerInfluence = exp(-(dx * dx + dy * dy) * (u_active > 0.5 ? 20.0 : 12.0)) * (u_active > 0.5 ? 1.4 + u_pulse * 2.8 : 0.18);

    float noise = (wave * 0.22 + swirl * 0.18);
    float base = pointerInfluence + noise;
    float normalized = clamp(base * 0.9 + 0.14, 0.0, 1.0);

    float bayerValue = 0.0;

    if (index == 1) bayerValue = 48.0;
    else if (index == 2) bayerValue = 12.0;
    else if (index == 3) bayerValue = 60.0;
    else if (index == 4) bayerValue = 3.0;
    else if (index == 5) bayerValue = 51.0;
    else if (index == 6) bayerValue = 15.0;
    else if (index == 7) bayerValue = 63.0;
    else if (index == 8) bayerValue = 32.0;
    else if (index == 9) bayerValue = 16.0;
    else if (index == 10) bayerValue = 44.0;
    else if (index == 11) bayerValue = 28.0;
    else if (index == 12) bayerValue = 35.0;
    else if (index == 13) bayerValue = 19.0;
    else if (index == 14) bayerValue = 47.0;
    else if (index == 15) bayerValue = 31.0;
    else if (index == 16) bayerValue = 8.0;
    else if (index == 17) bayerValue = 56.0;
    else if (index == 18) bayerValue = 4.0;
    else if (index == 19) bayerValue = 52.0;
    else if (index == 20) bayerValue = 11.0;
    else if (index == 21) bayerValue = 59.0;
    else if (index == 22) bayerValue = 7.0;
    else if (index == 23) bayerValue = 55.0;
    else if (index == 24) bayerValue = 40.0;
    else if (index == 25) bayerValue = 24.0;
    else if (index == 26) bayerValue = 36.0;
    else if (index == 27) bayerValue = 20.0;
    else if (index == 28) bayerValue = 43.0;
    else if (index == 29) bayerValue = 27.0;
    else if (index == 30) bayerValue = 39.0;
    else if (index == 31) bayerValue = 23.0;
    else if (index == 32) bayerValue = 2.0;
    else if (index == 33) bayerValue = 50.0;
    else if (index == 34) bayerValue = 14.0;
    else if (index == 35) bayerValue = 62.0;
    else if (index == 36) bayerValue = 1.0;
    else if (index == 37) bayerValue = 49.0;
    else if (index == 38) bayerValue = 13.0;
    else if (index == 39) bayerValue = 61.0;
    else if (index == 40) bayerValue = 34.0;
    else if (index == 41) bayerValue = 18.0;
    else if (index == 42) bayerValue = 46.0;
    else if (index == 43) bayerValue = 30.0;
    else if (index == 44) bayerValue = 33.0;
    else if (index == 45) bayerValue = 17.0;
    else if (index == 46) bayerValue = 45.0;
    else if (index == 47) bayerValue = 29.0;
    else if (index == 48) bayerValue = 10.0;
    else if (index == 49) bayerValue = 58.0;
    else if (index == 50) bayerValue = 6.0;
    else if (index == 51) bayerValue = 54.0;
    else if (index == 52) bayerValue = 9.0;
    else if (index == 53) bayerValue = 57.0;
    else if (index == 54) bayerValue = 5.0;
    else if (index == 55) bayerValue = 53.0;
    else if (index == 56) bayerValue = 42.0;
    else if (index == 57) bayerValue = 26.0;
    else if (index == 58) bayerValue = 38.0;
    else if (index == 59) bayerValue = 22.0;
    else if (index == 60) bayerValue = 41.0;
    else if (index == 61) bayerValue = 25.0;
    else if (index == 62) bayerValue = 37.0;
    else if (index == 63) bayerValue = 21.0;

    float threshold = (bayerValue + 0.5) / 64.0;

    bool accent = normalized > threshold + 0.05;

    if (accent) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
    }
}
