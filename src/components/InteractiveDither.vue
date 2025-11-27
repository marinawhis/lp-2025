<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import ShaderCanvas from '@/components/ShaderCanvas.vue'
import fragSrc from '@/shaders/interactiveDither.frag?raw'

const pointer = {
  active: false,
  pulse: 0,
}

let rafId = 0

const uniforms: Record<string, unknown> = {
  u_active: 0,
  u_pulse: 0,
}

function updatePointer(event: PointerEvent) {
  pointer.active = true
}

function handlePointerDown(event: PointerEvent) {
  updatePointer(event)
  pointer.pulse = 2.4
}

function handleLeave() {
  pointer.active = false
}

function loop() {
  pointer.pulse *= 0.88
  
  uniforms.u_active = pointer.active ? 1 : 0
  uniforms.u_pulse = pointer.pulse

  rafId = requestAnimationFrame(loop)
}

onMounted(() => {
  rafId = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <div
      class="relative h-[320px] md:h-full w-full overflow-hidden bg-black"
      @pointermove="updatePointer"
      @pointerdown="handlePointerDown"
      @pointerleave="handleLeave"
  >
    <ShaderCanvas
      :frag-shader="fragSrc"
      :uniforms="uniforms"
      :super-sample="1"
      class="absolute inset-0 w-full h-full"
    />
  </div>
</template>

<style scoped>
</style>
