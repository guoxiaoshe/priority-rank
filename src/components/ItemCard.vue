<script setup lang="ts">
import { ref } from 'vue'
import { useBoardsStore } from '@/stores/boards'
import { GripVertical, ChevronUp, ChevronDown, Pencil, Trash2, Check, X } from 'lucide-vue-next'
import type { Item } from '@/types'

const props = defineProps<{
  item: Item
  index: number
  zone: 'focus' | 'defer'
  totalInZone: number
  isFirst: boolean
  isLast: boolean
}>()

const store = useBoardsStore()
const isEditing = ref(false)
const editText = ref('')

function startEdit() {
  isEditing.value = true
  editText.value = props.item.text
}

function confirmEdit() {
  if (editText.value.trim()) {
    store.updateItem(props.item.id, editText.value)
  }
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}
</script>

<template>
  <div
    class="group flex items-center gap-2 rounded-xl px-3 py-3 transition-colors"
    :class="zone === 'focus'
      ? 'bg-white dark:bg-gray-800 border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md'
      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300'"
  >
    <!-- Drag handle -->
    <span
      class="drag-handle cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-400 shrink-0"
      title="拖拽排序"
    >
      <GripVertical :size="18" />
    </span>

    <!-- Index badge -->
    <span
      class="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold"
      :class="zone === 'focus'
        ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
    >
      {{ index + 1 }}
    </span>

    <!-- Text / Edit -->
    <div class="flex-1 min-w-0">
      <template v-if="isEditing">
        <input
          v-model="editText"
          class="w-full text-sm border border-blue-400 rounded px-1.5 py-0.5 outline-none bg-white dark:bg-gray-800 dark:text-gray-100"
          autofocus
          @keyup.enter="confirmEdit"
          @keyup.escape="cancelEdit"
        />
      </template>
      <template v-else>
        <span class="text-sm text-gray-800 dark:text-gray-100 truncate block">{{ item.text }}</span>
      </template>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center gap-0.5 shrink-0">
      <template v-if="isEditing">
        <button class="p-1 rounded hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600" @click="confirmEdit" title="保存">
          <Check :size="15" />
        </button>
        <button class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500" @click="cancelEdit" title="取消">
          <X :size="15" />
        </button>
      </template>
      <template v-else>
        <button
          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-30"
          :disabled="isFirst"
          title="上移"
          @click="store.moveItemUp(item.id)"
        >
          <ChevronUp :size="15" />
        </button>
        <button
          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 disabled:opacity-30"
          :disabled="isLast"
          title="下移"
          @click="store.moveItemDown(item.id)"
        >
          <ChevronDown :size="15" />
        </button>
        <button
          class="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-500"
          title="编辑"
          @click="startEdit"
        >
          <Pencil :size="14" />
        </button>
        <button
          class="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500"
          title="删除"
          @click="store.deleteItem(item.id)"
        >
          <Trash2 :size="14" />
        </button>
        <button
          v-if="zone === 'defer'"
          class="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors"
          title="移入聚焦区"
          @click="store.moveToFocus(item.id)"
        >
          移入聚焦
        </button>
        <button
          v-if="zone === 'focus'"
          class="ml-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="移入以后再说"
          @click="store.moveToDefer(item.id)"
        >
          暂缓
        </button>
      </template>
    </div>
  </div>
</template>
