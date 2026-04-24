<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { useBoardsStore } from '@/stores/boards'
import ItemCard from '@/components/ItemCard.vue'
import { Target } from 'lucide-vue-next'
import type { Item } from '@/types'
import { useToast } from '@/composables/useToast'

const store = useBoardsStore()
const { show } = useToast()

const localItems = computed<Item[]>({
  get: () => store.focusItems,
  set: (newVal: Item[]) => {
    store.reorderItems([...newVal, ...store.deferItems])
  },
})

function onDragEnd() {
  show('已更新聚焦排序')
}
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

    <!-- F22 空状态 -->
    <div
      v-if="store.activeBoard && store.activeBoard.items.length === 0"
      class="py-10 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl space-y-3"
    >
      <p class="text-sm text-gray-400 dark:text-gray-500">列表为空，快来添加你的第一个事项吧！</p>
      <button
        class="px-4 py-1.5 rounded-full text-sm bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60 transition-colors"
        @click="store.loadSampleData()"
      >
        ✨ 加载示例数据
      </button>
    </div>

    <!-- 有事项时的聚焦区 -->
    <template v-else-if="store.activeBoard">
      <div
        v-if="store.focusItems.length === 0"
        class="text-sm text-gray-400 dark:text-gray-500 py-4 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl"
      >
        无聚焦事项（所有事项均在暂缓区）
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
        @end="onDragEnd"
      >
        <template #item="{ element, index }">
          <ItemCard
            :item="element"
            :index="index"
            zone="focus"
            :is-first="index === 0"
            :is-last="index === store.focusItems.length - 1"
          />
        </template>
      </draggable>
    </template>
  </section>
</template>
