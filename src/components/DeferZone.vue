<script setup lang="ts">
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import { useBoardsStore } from '@/stores/boards'
import ItemCard from '@/components/ItemCard.vue'
import { Clock, Pencil, Check } from 'lucide-vue-next'
import type { Item } from '@/types'

const store = useBoardsStore()

const isEditingMessage = ref(false)
const editMessage = ref('')

function startEditMessage() {
  editMessage.value = store.activeBoard?.deferMessage ?? ''
  isEditingMessage.value = true
}

function confirmEditMessage() {
  if (store.activeBoardId && editMessage.value.trim()) {
    store.updateBoardSettings(store.activeBoardId, { deferMessage: editMessage.value.trim() })
  }
  isEditingMessage.value = false
}

// vuedraggable two-way binding for defer items
const localItems = computed<Item[]>({
  get: () => store.deferItems,
  set: (newVal) => {
    const focus = store.focusItems
    store.reorderItems([...focus, ...newVal])
  },
})
</script>

<template>
  <section>
    <div class="flex items-center gap-2 mb-3">
      <Clock :size="18" class="text-gray-400" />
      <h2 class="font-semibold text-gray-600 dark:text-gray-400">
        以后再说
        <span class="ml-1 text-xs font-normal text-gray-400">(剩余 {{ store.deferItems.length }} 项)</span>
      </h2>
    </div>

    <!-- Defer message -->
    <div class="mb-3 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
      <template v-if="isEditingMessage">
        <input
          v-model="editMessage"
          class="flex-1 bg-white dark:bg-gray-800 border border-amber-400 rounded px-1.5 py-0.5 text-sm outline-none dark:text-gray-100"
          autofocus
          @keyup.enter="confirmEditMessage"
          @keyup.escape="isEditingMessage = false"
          @blur="confirmEditMessage"
        />
        <button class="p-0.5 hover:text-amber-900 dark:hover:text-amber-100" @click="confirmEditMessage">
          <Check :size="14" />
        </button>
      </template>
      <template v-else>
        <span class="flex-1 italic">{{ store.activeBoard?.deferMessage }}</span>
        <button class="p-0.5 hover:text-amber-900 dark:hover:text-amber-100 shrink-0 mt-0.5" title="编辑提示文案" @click="startEditMessage">
          <Pencil :size="13" />
        </button>
      </template>
    </div>

    <div
      v-if="store.deferItems.length === 0"
      class="text-sm text-gray-400 dark:text-gray-500 py-4 text-center"
    >
      没有暂缓事项 🎉
    </div>

    <draggable
      v-else
      v-model="localItems"
      item-key="id"
      handle=".drag-handle"
      animation="200"
      ghost-class="opacity-40"
      class="space-y-2"
      group="items"
    >
      <template #item="{ element, index }">
        <ItemCard
          :item="element"
          :index="(store.activeBoard?.topN ?? 3) + index"
          zone="defer"
          :total-in-zone="store.deferItems.length"
          :is-first="index === 0"
          :is-last="index === store.deferItems.length - 1"
        />
      </template>
    </draggable>
  </section>
</template>
