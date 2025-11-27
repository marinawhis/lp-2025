<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch, computed } from 'vue';
import GlslCanvas from "glslCanvas";

const props = defineProps<{
  width?: number;
  height?: number;
  fragShader?: string;
  vertShader?: string;
  uniforms?: Record<string, unknown> | undefined;
  superSample?: number;
  style?: Record<string, string | number>;
  class?: string | Record<string, boolean | string>;
}>();

const webGlSupported = !!document.createElement('canvas').getContext('webgl');
const pixelDensity = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

const canvasEl = ref<HTMLCanvasElement | null>(null);
let glslInstance: GlslCanvas | null = null;
let rafId: number | null = null;

const cssBoxWidth = ref(0);
const cssBoxHeight = ref(0);
const superSample = computed(() => (props.superSample ?? 1));
const frag = computed(() => props.fragShader ?? 'precision mediump float; void main() { gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); }');
const vert = computed(() => props.vertShader);

const canvasWidth = computed(() => Math.max(1, Math.floor(cssBoxWidth.value * pixelDensity * superSample.value)));
const canvasHeight = computed(() => Math.max(1, Math.floor(cssBoxHeight.value * pixelDensity * superSample.value)));

let ro: ResizeObserver | null = null;

function measureCanvasSize() {
  const el = canvasEl.value;
  if (!el) return;

  cssBoxWidth.value = el.clientWidth;
  cssBoxHeight.value = el.clientHeight;
}

function applyUniforms() {
  if (!glslInstance || !props.uniforms) return;

  glslInstance.setUniforms(props.uniforms);
}

function startLoop() {
  stopLoop();

  const render = () => {
    applyUniforms();

    rafId = requestAnimationFrame(render);
  };

  rafId = requestAnimationFrame(render);
}

function stopLoop() {
  if (rafId != null) {
    cancelAnimationFrame(rafId);

    rafId = null;
  }
}

onMounted(() => {
  if (!webGlSupported) return;
  if (!canvasEl.value) return;

  measureCanvasSize();
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => {
      measureCanvasSize();
    });

    ro.observe(canvasEl.value);
  } else {
    window.addEventListener('resize', measureCanvasSize);
  }

  glslInstance = new GlslCanvas(canvasEl.value, {
    vertexString: vert.value,
    fragmentString: frag.value,
    alpha: false,
    antialias: true,
    mode: 'flat',
  });

  startLoop();
});

onBeforeUnmount(() => {
  stopLoop();

  if (ro) {
    try { ro.disconnect(); } catch {
      // ignore errors during disconnect
    }
    ro = null;
  } else {
    window.removeEventListener('resize', measureCanvasSize);
  }

  if (glslInstance) {
    try {
      glslInstance.destroy();
    } catch (e) {
        // ignore errors during destroy
    }
    glslInstance = null;
  }
});

watch([frag, vert], ([f, v]) => {
    if (!glslInstance || !webGlSupported) return;
    if (!canvasEl.value) return;

    if (glslInstance) {
        try {
            glslInstance.destroy();
        } catch (e) {
            // ignore errors during destroy
        }
        glslInstance = null;
    }

    glslInstance = new GlslCanvas(canvasEl.value, {
        vertexString: v,
        fragmentString: f,
        alpha: false,
        antialias: true,
        mode: 'flat',
    });
}, { immediate: false });

watch(() => props.uniforms, () => {
  applyUniforms();
}, { deep: true });

watch(superSample, () => {
  measureCanvasSize();
});
</script>

<template>
  <canvas
    ref="canvasEl"
    :width="canvasWidth"
    :height="canvasHeight"
    :style="{ ...(style || {}), width: '100%', height: '100%' }"
    :class="class"
  />
</template>