<script setup lang="ts">
import { ref } from 'vue'
import { useBoardsStore } from '@/stores/boards'
import { Plus } from 'lucide-vue-next'

const store = useBoardsStore()
const inputText = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

function submit() {
  if (!inputText.value.trim()) return
  store.addItem(inputText.value)
  inputText.value = ''
  inputRef.value?.focus()
}
</script>

<template>
  <div class="flex gap-2">
    <input
      ref="inputRef"
      v-model="inputText"
      placeholder="添加新事项…"
      class="flex-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 outline-none focus:border-green-400 focus:ring-1 focus:ring-green-300 bg-white dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 transition-colors"
      @keyup.enter="submit"
    />
    <button
      class="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors disabled:opacity-40"
      :disabled="!inputText.trim()"
      @click="submit"
    >
      <Plus :size="16" />
      添加
    </button>
  </div>
</template>
