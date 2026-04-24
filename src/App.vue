<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useBoardsStore } from '@/stores/boards'
import { useToast } from '@/composables/useToast'
import BoardSidebar from '@/components/BoardSidebar.vue'
import AddItemInput from '@/components/AddItemInput.vue'
import FocusZone from '@/components/FocusZone.vue'
import DeferZone from '@/components/DeferZone.vue'
import Toast from '@/components/Toast.vue'
import HelpDialog from '@/components/HelpDialog.vue'
import {
  Download, Upload, RotateCcw, Sparkles, Settings, Moon, Sun, Menu, X as XIcon, HelpCircle, Trash2,
} from 'lucide-vue-next'

const store = useBoardsStore()
const { toasts, show, remove } = useToast()

const isDark = ref(false)
const sidebarOpen = ref(false)
const showSettings = ref(false)
const showHelp = ref(false)
const topNInput = ref(3)
const sortLabelInput = ref('')

onMounted(() => {
  store.init()
  syncSettings()
  // Restore dark mode preference
  isDark.value = localStorage.getItem('pq-dark') === '1'
  applyDark()
  if (!localStorage.getItem('pq-help-seen')) {
    showHelp.value = true
  }
})

function syncSettings() {
  if (!store.activeBoard) return
  topNInput.value = store.activeBoard.topN
  sortLabelInput.value = store.activeBoard.sortLabel
}

watch(() => store.activeBoardId, () => syncSettings())

function applyDark() {
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('pq-dark', isDark.value ? '1' : '0')
}

function toggleDark() {
  isDark.value = !isDark.value
  applyDark()
}

function applySettings() {
  if (!store.activeBoardId) return
  store.updateBoardSettings(store.activeBoardId, {
    topN: topNInput.value,
    sortLabel: sortLabelInput.value,
  })
  show('设置已更新')
  showSettings.value = false
  syncSettings()
}

function handleLoadSample() {
  store.loadSampleData()
  show('已加载示例数据')
}

function handleReset() {
  if (confirm('确认清空当前板的所有事项？')) {
    store.resetBoard()
    show('已重置当前板')
  }
}

function handleExport() {
  const json = store.exportBoard()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${store.activeBoard?.name ?? 'board'}.json`
  a.click()
  URL.revokeObjectURL(url)
  show('已导出 JSON 文件')
}

function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      store.importBoard(text, 'new')
      show('导入成功，已创建新板')
    } catch {
      alert('导入失败：文件格式不正确')
    }
  }
  input.click()
}

function openHelp() {
  showHelp.value = true
}

function closeHelp() {
  showHelp.value = false
  localStorage.setItem('pq-help-seen', '1')
}

function handleClearAll() {
  if (confirm('确认清空当前板的所有事项？此操作不可恢复。')) {
    store.clearAllItems()
    show('已清空全部事项')
  }
}
</script>

<template>
  <div class="flex h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">

    <!-- Mobile sidebar backdrop -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/40 z-20 md:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <div
      class="fixed md:static inset-y-0 left-0 z-30 transition-transform md:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <BoardSidebar class="h-full" @click="sidebarOpen = false" />
    </div>

    <!-- Main content -->
    <div class="flex flex-col flex-1 min-w-0 overflow-hidden">

      <!-- Header -->
      <header class="shrink-0 flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <button class="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" @click="sidebarOpen = !sidebarOpen">
          <Menu :size="20" />
        </button>

        <div class="flex-1 min-w-0">
          <h1 class="text-base font-bold text-gray-900 dark:text-gray-100 truncate">
            {{ store.activeBoard?.name ?? 'PriorityQueue' }}
          </h1>
          <p v-if="store.activeBoard" class="text-xs text-gray-400 truncate">
            排序依据：{{ store.activeBoard.sortLabel }}
          </p>
        </div>

        <!-- Toolbar -->
        <div class="flex items-center gap-1 shrink-0">
          <button
            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            title="加载示例数据"
            @click="handleLoadSample"
          >
            <Sparkles :size="18" />
          </button>
          <button
            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            title="重置当前板"
            @click="handleReset"
          >
            <RotateCcw :size="18" />
          </button>
          <button
            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            title="导出 JSON"
            @click="handleExport"
          >
            <Download :size="18" />
          </button>
          <button
            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            title="导入 JSON"
            @click="handleImport"
          >
            <Upload :size="18" />
          </button>
          <button
            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            title="设置"
            @click="showSettings = !showSettings"
          >
            <Settings :size="18" />
          </button>
          <button
            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            title="清空全部事项"
            @click="handleClearAll"
          >
            <Trash2 :size="18" />
          </button>
          <button
            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            title="使用引导"
            @click="openHelp"
          >
            <HelpCircle :size="18" />
          </button>
          <button
            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            :title="isDark ? '切换亮色' : '切换暗色'"
            @click="toggleDark"
          >
            <Moon v-if="!isDark" :size="18" />
            <Sun v-else :size="18" />
          </button>
        </div>
      </header>

      <!-- Settings panel (inline dropdown) -->
      <div
        v-if="showSettings"
        class="shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex flex-wrap gap-4 items-end"
      >
        <div>
          <label class="block text-xs text-gray-500 mb-1">聚焦数量 N（1–10）</label>
          <input
            v-model.number="topNInput"
            type="number"
            min="1"
            max="10"
            class="w-20 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm outline-none focus:border-green-400 bg-white dark:bg-gray-800"
          />
        </div>
        <div class="flex-1 min-w-48">
          <label class="block text-xs text-gray-500 mb-1">排序依据文案</label>
          <input
            v-model="sortLabelInput"
            class="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm outline-none focus:border-green-400 bg-white dark:bg-gray-800"
          />
        </div>
        <div class="flex gap-2">
          <button
            class="px-3 py-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium"
            @click="applySettings"
          >
            应用
          </button>
          <button
            class="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
            @click="showSettings = false"
          >
            <XIcon :size="16" />
          </button>
        </div>
      </div>

      <!-- Content scroll area -->
      <main class="flex-1 overflow-y-auto px-4 py-5 space-y-6 max-w-2xl mx-auto w-full">

        <!-- Empty state -->
        <div
          v-if="!store.activeBoard"
          class="text-center text-gray-400 py-20"
        >
          请在左侧创建一个排队板
        </div>

        <template v-else>
          <!-- Add item -->
          <AddItemInput />

          <!-- Focus zone -->
          <FocusZone />

          <!-- Divider -->
          <hr class="border-dashed border-gray-300 dark:border-gray-700" />

          <!-- Defer zone -->
          <DeferZone />
        </template>
      </main>
    </div>

    <!-- Toast container -->
    <div class="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 pointer-events-none">
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        @close="remove(toast.id)"
      />
    </div>

    <!-- Help dialog -->
    <HelpDialog v-if="showHelp" @close="closeHelp" />
  </div>
</template>
