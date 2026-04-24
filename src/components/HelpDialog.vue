<script setup lang="ts">
import { X, GripVertical, Plus, Layers, SlidersHorizontal } from 'lucide-vue-next'

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-base font-bold text-gray-900 dark:text-gray-100">使用引导</h2>
        <button
          class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"
          @click="$emit('close')"
        >
          <X :size="18" />
        </button>
      </div>

      <!-- Content -->
      <div class="px-6 py-5 space-y-6 text-sm text-gray-700 dark:text-gray-300">

        <div class="flex gap-4">
          <div class="shrink-0 w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400">
            <Plus :size="18" />
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-gray-100 mb-1">添加你的事项</p>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">在顶部输入框中逐条输入你的目标或任务，按 Enter 或点击"添加"。也可以点击"加载示例数据"快速体验。</p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="shrink-0 w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <GripVertical :size="18" />
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-gray-100 mb-1">拖拽排序</p>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">拖拽每行左侧的手柄，将最重要的事项放到前面。也可以使用 ↑ / ↓ 按钮精确调整。越靠上 = 越重要，位置即优先级。</p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="shrink-0 w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <SlidersHorizontal :size="18" />
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-gray-100 mb-1">设置聚焦数量 N</p>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">点击工具栏的设置图标，调整 N 值（默认 3）。前 N 项进入当前聚焦区，其余自动归入以后再说清单。</p>
          </div>
        </div>

        <div class="flex gap-4">
          <div class="shrink-0 w-9 h-9 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Layers :size="18" />
          </div>
          <div>
            <p class="font-semibold text-gray-900 dark:text-gray-100 mb-1">创建多个领域板</p>
            <p class="text-gray-500 dark:text-gray-400 leading-relaxed">左侧侧边栏点击"+ 新建排队板"，为不同领域（工作、健康、学习）分别创建独立的优先级列表，切换时数据互不干扰。</p>
          </div>
        </div>

        <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
          <p class="font-semibold text-gray-900 dark:text-gray-100 text-xs uppercase tracking-wide">小贴士</p>
          <ul class="space-y-1 text-gray-500 dark:text-gray-400 list-disc list-inside">
            <li>点击"移入聚焦"可将暂缓事项快速提升到第 N 位</li>
            <li>数据自动保存到浏览器，刷新页面不会丢失</li>
            <li>工具栏支持导出/导入 JSON，方便备份或迁移</li>
          </ul>
        </div>
      </div>

      <div class="px-6 pb-5">
        <button
          class="w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-medium transition-colors"
          @click="$emit('close')"
        >
          开始使用
        </button>
      </div>
    </div>
  </div>
</template>
