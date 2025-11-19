<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let offscreenCanvas: HTMLCanvasElement | null = null
let offscreenCtx: CanvasRenderingContext2D | null = null
let animationId = 0

const pointer = {
  x: 0.5,
  y: 0.5,
  tx: 0.5,
  ty: 0.5,
  active: false,
  pulse: 0,
}

const bayerMatrix = [
  [0, 48, 12, 60, 3, 51, 15, 63],
  [32, 16, 44, 28, 35, 19, 47, 31],
  [8, 56, 4, 52, 11, 59, 7, 55],
  [40, 24, 36, 20, 43, 27, 39, 23],
  [2, 50, 14, 62, 1, 49, 13, 61],
  [34, 18, 46, 30, 33, 17, 45, 29],
  [10, 58, 6, 54, 9, 57, 5, 53],
  [42, 26, 38, 22, 41, 25, 37, 21],
]

let displayWidth = 0
let displayHeight = 0
let devicePixelRatioCache = 1

function updatePointer(event: PointerEvent) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  pointer.tx = (event.clientX - rect.left) / rect.width
  pointer.ty = (event.clientY - rect.top) / rect.height
  pointer.active = true
}

function handlePointerDown(event: PointerEvent) {
  updatePointer(event)
  pointer.pulse = 2.4
}

function handleLeave() {
  pointer.active = false
  pointer.tx = 0.5
  pointer.ty = 0.5
}

function resize() {
  const container = containerRef.value
  const canvas = canvasRef.value
  if (!container || !canvas) return

  const rect = container.getBoundingClientRect()
  displayWidth = rect.width
  displayHeight = rect.height
  devicePixelRatioCache = window.devicePixelRatio || 1

  canvas.width = Math.max(1, Math.floor(displayWidth * devicePixelRatioCache))
  canvas.height = Math.max(1, Math.floor(displayHeight * devicePixelRatioCache))
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height}px`

  ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.setTransform(devicePixelRatioCache, 0, 0, devicePixelRatioCache, 0, 0)
    ctx.imageSmoothingEnabled = false
  }

  if (!offscreenCanvas) {
    offscreenCanvas = document.createElement('canvas')
  }
  const targetWidth = Math.max(128, Math.min(320, Math.floor(displayWidth / 3.2)))
  const targetHeight = Math.max(128, Math.floor(targetWidth * (displayHeight / displayWidth || 1)))
  offscreenCanvas.width = targetWidth
  offscreenCanvas.height = targetHeight
  offscreenCtx = offscreenCanvas.getContext('2d')
}

function renderFrame(timestamp: number) {
  if (!ctx || !offscreenCanvas || !offscreenCtx) {
    animationId = requestAnimationFrame(renderFrame)
    return
  }

  const width = offscreenCanvas.width
  const height = offscreenCanvas.height
  const imageData = offscreenCtx.createImageData(width, height)
  const data = imageData.data as any
  const time = timestamp * 0.00045

  pointer.x += (pointer.tx - pointer.x) * 0.12
  pointer.y += (pointer.ty - pointer.y) * 0.12
  pointer.pulse *= 0.88

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4
      const nx = x / width
      const ny = y / height

      const wave =
        Math.sin((nx * 8.5 + time) * 1.4) +
        Math.cos((ny * 8.2 - time) * 1.3)
      const swirl = Math.sin((nx * 1.5 + ny * 1.5 + time * 0.3) * 6.0)

      const dx = nx - pointer.x
      const dy = ny - pointer.y
      const pointerInfluence =
        Math.exp(-(dx * dx + dy * dy) * (pointer.active ? 20 : 12)) *
        (pointer.active ? 1.4 + pointer.pulse * 2.8 : 0.18)

      const noise = wave * 0.22 + swirl * 0.18
      const base = pointerInfluence + noise
      const normalized = Math.max(0, Math.min(1, base * 0.9 + 0.14))
      const threshold = (bayerMatrix![y % 8]![x % 8]! + 0.5) / 64

      const accent = normalized > threshold + 0.05
      const baseColor = [0, 0, 0]
      const accentColor = [255, 255, 255]

      const r = accent ? accentColor[0] : baseColor[0]
      const g = accent ? accentColor[1] : baseColor[1]
      const b = accent ? accentColor[2] : baseColor[2]

      data[index] = r
      data[index + 1] = g
      data[index + 2] = b
      data[index + 3] = 255
    }
  }

  offscreenCtx.putImageData(imageData, 0, 0)
  ctx.clearRect(0, 0, displayWidth, displayHeight)
  ctx.drawImage(offscreenCanvas, 0, 0, displayWidth, displayHeight)

  animationId = requestAnimationFrame(renderFrame)
}

onMounted(() => {
  resize()
  animationId = requestAnimationFrame(renderFrame)
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <div
      ref="containerRef"
      class="relative h-[320px] md:h-full w-full overflow-hidden bg-black"
      @pointermove="updatePointer"
      @pointerdown="handlePointerDown"
      @pointerleave="handleLeave"
  >
    <canvas ref="canvasRef" class="h-full w-full"></canvas>
    <div class="pointer-events-none absolute inset-0 border border-white/5 rounded-none" />
  </div>
</template>

<style scoped>
</style>
