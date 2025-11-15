<script setup lang="ts">
import {Button} from "@/components/ui/button";
import {ArrowUpRight} from "lucide-vue-next";
import {Linkedin} from "lucide-vue-next";
import {Github} from "lucide-vue-next";
import {AtSign} from "lucide-vue-next";
import {Globe} from "lucide-vue-next";

const props = defineProps<{
  title: string
  icon: string
  href: string
}>()

const iconComponent = {
  "ArrowUpRight": ArrowUpRight,
  "Linkedin": Linkedin,
  "Github": Github,
  "AtSign": AtSign,
  "Globe": Globe,
}[props.icon]
</script>

<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
  >
    <Button variant="ghost" class="p-8 w-full hover:text-[#c2fe0c]">
      <div class="flex items-center w-full gap-4">
        <component :is="iconComponent" class="text-[#c2fe0c]"/>
        <div class="flex flex-col items-start w-full">
          <span class="text-base font-mono">{{ title }}</span>
        </div>
      </div>
      <ArrowUpRight :size="12" class="inline mx-1" />
    </Button>
  </a>
</template>
