<script setup lang="ts">
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import { useBoardsStore } from '@/stores/boards'
import ItemCard from '@/components/ItemCard.vue'
import { Target } from 'lucide-vue-next'
import type { Item } from '@/types'

const store = useBoardsStore()

// vuedraggable needs a writable local copy; sync back on end
const localItems = computed<Item[]>({
  get: () => store.focusItems,
  set: (newVal) => {
    // When drag moves within focus zone, rebuild the full list
    const defer = store.deferItems
    store.reorderItems([...newVal, ...defer])
  },
})
</script>

<template>
  <section>
    <div class="flex items-center gap-2 mb-3">
      <Target :size="18" class="text-green-500" />
      <h2 class="font-semibold text-gray-800 dark:text-gray-100">
        当前聚焦
        <span class="ml-1 text-xs font-normal text-gray-400">(前 {{ store.activeBoard?.topN }} 项)</span>
      </h2>
    </div>

    <div
      v-if="store.focusItems.length === 0"
      class="text-sm text-gray-400 dark:text-gray-500 py-6 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl"
    >
      暂无聚焦事项，请添加或拖拽事项到此区域
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
          :index="index"
          zone="focus"
          :total-in-zone="store.focusItems.length"
          :is-first="index === 0"
          :is-last="index === store.focusItems.length - 1"
        />
      </template>
    </draggable>
  </section>
</template>
