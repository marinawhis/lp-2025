<script setup lang="ts">
import LinkButton from "@/components/LinkButton.vue";
import InteractiveDither from "@/components/InteractiveDither.vue";
import { ref, onMounted, onUnmounted } from 'vue';

const links = [
  {
    title: "Linkedin",
    icon: "Linkedin",
    href: "https://www.linkedin.com/in/marina-djundjas",
  },
  {
    title: "GitHub",
    icon: "Github",
    href: "https://github.com/marinawhis",
  },
]

const timeline = [
  { label: "Currently", role: "Senior Product Designer", place: "Noxtua", timeframe: "2025" },
  { label: "Before", role: "UI/UX Designer", place: "sipgate", timeframe: "2021 → 2024" },
  { label: "Earlier", role: "Web- and Interface Designer", place: "Various", timeframe: "2017 → 2021" },
  { label: "Sidequests", role: "Internet Friend", place: "Gaming, Discord Communities", timeframe: "2001" },
]

const localTime = ref('')

function updateTime() {
  localTime.value = new Date().toLocaleTimeString('de-DE', {
    timeZone: 'Europe/Berlin',
    hour12: true
  })
}

onMounted(() => {
  updateTime()
  const timer = setInterval(updateTime, 1000)
  onUnmounted(() => clearInterval(timer))
})
</script>

<template>
  <div class="bg-black text-white min-h-screen md:h-screen md:overflow-hidden">
    <div class="flex min-h-screen flex-col justify-center md:h-full md:flex-row md:items-stretch md:justify-start">
      <section class="flex flex-1 flex-col justify-center border-b border-white/10 px-6 py-16 md:border-b-0 md:border-r md:px-12 md:py-20">
        <div class="space-y-20">
          <div class="space-y-8">
            <p class="text-sm uppercase font-mono text-zinc-500">Düsseldorf, Germany — {{ localTime }}</p>
            <h1 class="text-4xl font-mono uppercase leading-tight sm:text-5xl">// Marina Djundjas</h1>
            <p class="font-mono text-lg leading-relaxed text-zinc-400">
              Henlo, I'm Marina. I currently design products at
              <a
                href="https://www.noxtua.com/"
                class="uppercase font-mono text-white underline decoration-[#ffffff] decoration-4 underline-offset-4 transition"
                target="_blank"
              >
                Noxtua</a>, where we're shaping sovereign European Legal AI. My work centers on making complex tools feel simple, smooth, and genuinely helpful.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-5 text-sm text-zinc-400 sm:grid-cols-2">
            <div v-for="item in timeline" :key="item.label" class="space-y-1 border-l border-white/10 pl-4">
              <p class="text-sm font-mono uppercase text-zinc-500">{{ item.label }}</p>
              <p class="font-semibold text-lg text-white">{{ item.role }}</p>
              <p class="text-md">{{ item.place }}</p>
              <p class="text-sm text-zinc-500">{{ item.timeframe }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <LinkButton
                v-for="link in links"
                :key="link.title"
                :title="link.title"
                :icon="link.icon"
                :href="link.href"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="flex h-full flex-1 flex-col bg-black md:h-full">
        <div class="relative flex-1 h-full overflow-hidden">
          <InteractiveDither />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped></style>
