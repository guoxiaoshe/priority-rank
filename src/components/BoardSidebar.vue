<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBoardsStore } from '@/stores/boards'
import { PenLine, Trash2, Plus } from 'lucide-vue-next'

const store = useBoardsStore()

const isCreating = ref(false)
const newBoardName = ref('')
const editingId = ref<string | null>(null)
const editingName = ref('')

function startCreate() {
  isCreating.value = true
  newBoardName.value = ''
}

function confirmCreate() {
  if (newBoardName.value.trim()) {
    store.addBoard(newBoardName.value.trim())
  }
  isCreating.value = false
}

function startEdit(id: string, name: string) {
  editingId.value = id
  editingName.value = name
}

function confirmEdit() {
  if (editingId.value && editingName.value.trim()) {
    store.renameBoard(editingId.value, editingName.value.trim())
  }
  editingId.value = null
}

function confirmDelete(id: string, name: string) {
  if (confirm(`确认删除排队板"${name}"？此操作不可恢复。`)) {
    store.deleteBoard(id)
  }
}

const boards = computed(() => store.boards)
</script>

<template>
  <aside class="flex flex-col w-56 shrink-0 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
    <div class="px-4 py-3 font-semibold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
      我的排队板
    </div>

    <ul class="flex-1 px-2 space-y-0.5">
      <li v-for="board in boards" :key="board.id">
        <div
          class="group flex items-center gap-1 rounded-lg px-2 py-2 cursor-pointer text-sm transition-colors"
          :class="board.id === store.activeBoardId
            ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200 font-medium'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'"
          @click="store.setActiveBoard(board.id)"
        >
          <template v-if="editingId === board.id">
            <input
              v-model="editingName"
              class="flex-1 bg-white dark:bg-gray-800 border border-green-400 rounded px-1 py-0.5 text-sm outline-none"
              autofocus
              @keyup.enter="confirmEdit"
              @keyup.escape="editingId = null"
              @blur="confirmEdit"
            />
          </template>
          <template v-else>
            <span class="flex-1 truncate">{{ board.name }}</span>
            <button
              class="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:text-blue-500 transition-opacity"
              title="重命名"
              @click.stop="startEdit(board.id, board.name)"
            >
              <PenLine :size="13" />
            </button>
            <button
              class="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:text-red-500 transition-opacity"
              title="删除"
              @click.stop="confirmDelete(board.id, board.name)"
            >
              <Trash2 :size="13" />
            </button>
          </template>
        </div>
      </li>
    </ul>

    <div class="px-2 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
      <template v-if="isCreating">
        <input
          v-model="newBoardName"
          placeholder="输入板名称…"
          class="w-full text-sm border border-green-400 rounded px-2 py-1 outline-none bg-white dark:bg-gray-800 dark:text-gray-100"
          autofocus
          @keyup.enter="confirmCreate"
          @keyup.escape="isCreating = false"
          @blur="confirmCreate"
        />
      </template>
      <template v-else>
        <button
          class="w-full flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 px-2 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          @click="startCreate"
        >
          <Plus :size="15" />
          新建排队板
        </button>
      </template>
    </div>
  </aside>
</template>
