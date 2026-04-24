<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { CheckCircle2 } from 'lucide-vue-next'

const props = defineProps<{
  message: string
  duration?: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

let timer: ReturnType<typeof setTimeout>

onMounted(() => {
  timer = setTimeout(() => emit('close'), props.duration ?? 2500)
})

onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <div class="flex items-center gap-2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium pointer-events-none select-none">
    <CheckCircle2 :size="16" class="text-green-400 dark:text-green-600 shrink-0" />
    {{ message }}
  </div>
</template>
