import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { nanoid } from 'nanoid'
import type { Board, Item } from '@/types'
import { DEFAULT_SORT_LABEL, SAMPLE_ITEMS, makeDeferMessage } from '@/types'

function createBoard(name: string): Board {
  return {
    id: nanoid(),
    name,
    items: [],
    topN: 3,
    sortLabel: DEFAULT_SORT_LABEL,
    deferMessage: makeDeferMessage(),
  }
}

function createItem(text: string): Item {
  return {
    id: nanoid(),
    text: text.trim(),
    createdAt: Date.now(),
  }
}

export const useBoardsStore = defineStore(
  'boards',
  () => {
    const boards = ref<Board[]>([])
    const activeBoardId = ref<string | null>(null)

    // ─── Getters ───────────────────────────────────────────────────────────
    const activeBoard = computed<Board | undefined>(() =>
      boards.value.find((b) => b.id === activeBoardId.value),
    )

    const focusItems = computed<Item[]>(() => {
      if (!activeBoard.value) return []
      return activeBoard.value.items.slice(0, activeBoard.value.topN)
    })

    const deferItems = computed<Item[]>(() => {
      if (!activeBoard.value) return []
      return activeBoard.value.items.slice(activeBoard.value.topN)
    })

    // ─── Board Actions ─────────────────────────────────────────────────────
    function init() {
      if (boards.value.length === 0) {
        const defaultBoard = createBoard('我的优先级排队')
        boards.value.push(defaultBoard)
        activeBoardId.value = defaultBoard.id
      } else if (!activeBoardId.value || !boards.value.find((b) => b.id === activeBoardId.value)) {
        activeBoardId.value = boards.value[0].id
      }
    }

    function addBoard(name?: string) {
      const board = createBoard(name ?? `排队板 ${boards.value.length + 1}`)
      boards.value.push(board)
      activeBoardId.value = board.id
      return board
    }

    function renameBoard(boardId: string, newName: string) {
      const board = boards.value.find((b) => b.id === boardId)
      if (board) board.name = newName.trim()
    }

    function deleteBoard(boardId: string) {
      const idx = boards.value.findIndex((b) => b.id === boardId)
      if (idx === -1) return
      boards.value.splice(idx, 1)
      if (activeBoardId.value === boardId) {
        activeBoardId.value = boards.value.length > 0 ? boards.value[0].id : null
        if (boards.value.length === 0) {
          const defaultBoard = createBoard('我的优先级排队')
          boards.value.push(defaultBoard)
          activeBoardId.value = defaultBoard.id
        }
      }
    }

    function setActiveBoard(boardId: string) {
      activeBoardId.value = boardId
    }

    function updateBoardSettings(
      boardId: string,
      patch: Partial<Pick<Board, 'topN' | 'sortLabel' | 'deferMessage'>>,
    ) {
      const board = boards.value.find((b) => b.id === boardId)
      if (!board) return
      if (patch.topN !== undefined) board.topN = Math.max(1, Math.min(10, patch.topN))
      if (patch.sortLabel !== undefined) board.sortLabel = patch.sortLabel
      if (patch.deferMessage !== undefined) board.deferMessage = patch.deferMessage
    }

    // ─── Item Actions ──────────────────────────────────────────────────────
    function addItem(text: string) {
      if (!activeBoard.value || !text.trim()) return
      activeBoard.value.items.push(createItem(text))
    }

    function updateItem(itemId: string, text: string) {
      if (!activeBoard.value || !text.trim()) return
      const item = activeBoard.value.items.find((i) => i.id === itemId)
      if (item) item.text = text.trim()
    }

    function deleteItem(itemId: string) {
      if (!activeBoard.value) return
      const idx = activeBoard.value.items.findIndex((i) => i.id === itemId)
      if (idx !== -1) activeBoard.value.items.splice(idx, 1)
    }

    function deleteItems(itemIds: string[]) {
      if (!activeBoard.value) return
      const idSet = new Set(itemIds)
      activeBoard.value.items = activeBoard.value.items.filter((i) => !idSet.has(i.id))
    }

    function clearAllItems() {
      if (!activeBoard.value) return
      activeBoard.value.items = []
    }

    /** Replace the entire items array (used after drag-drop reorder) */
    function reorderItems(newItems: Item[]) {
      if (!activeBoard.value) return
      activeBoard.value.items = newItems
    }

    function moveItemUp(itemId: string) {
      if (!activeBoard.value) return
      const items = activeBoard.value.items
      const idx = items.findIndex((i) => i.id === itemId)
      if (idx > 0) {
        ;[items[idx - 1], items[idx]] = [items[idx], items[idx - 1]]
      }
    }

    function moveItemDown(itemId: string) {
      if (!activeBoard.value) return
      const items = activeBoard.value.items
      const idx = items.findIndex((i) => i.id === itemId)
      if (idx !== -1 && idx < items.length - 1) {
        ;[items[idx], items[idx + 1]] = [items[idx + 1], items[idx]]
      }
    }

    /** Move an item from defer zone into focus zone at position topN-1 */
    function moveToFocus(itemId: string) {
      if (!activeBoard.value) return
      const items = activeBoard.value.items
      const n = activeBoard.value.topN
      const idx = items.findIndex((i) => i.id === itemId)
      if (idx === -1 || idx < n) return
      const [item] = items.splice(idx, 1)
      items.splice(n - 1, 0, item)
    }

    /** Move an item from focus zone into defer zone at position topN */
    function moveToDefer(itemId: string) {
      if (!activeBoard.value) return
      const items = activeBoard.value.items
      const n = activeBoard.value.topN
      const idx = items.findIndex((i) => i.id === itemId)
      if (idx === -1 || idx >= n) return
      const [item] = items.splice(idx, 1)
      items.splice(n, 0, item)
    }

    /** Load sample data into the active board */
    function loadSampleData() {
      if (!activeBoard.value) return
      const existing = new Set(activeBoard.value.items.map((i) => i.text))
      for (const text of SAMPLE_ITEMS) {
        if (!existing.has(text)) {
          activeBoard.value.items.push(createItem(text))
        }
      }
    }

    /** Reset active board items to empty */
    function resetBoard() {
      if (!activeBoard.value) return
      activeBoard.value.items = []
    }

    // ─── Import / Export ───────────────────────────────────────────────────
    function exportBoard(): string {
      if (!activeBoard.value) return '{}'
      return JSON.stringify(activeBoard.value, null, 2)
    }

    function importBoard(json: string, mode: 'overwrite' | 'new' = 'new') {
      const data = JSON.parse(json) as Board
      if (!data.id || !data.name || !Array.isArray(data.items)) {
        throw new Error('无效的导入数据格式')
      }
      if (mode === 'overwrite' && activeBoard.value) {
        const idx = boards.value.findIndex((b) => b.id === activeBoardId.value)
        boards.value.splice(idx, 1, { ...data })
      } else {
        const newBoard = { ...data, id: nanoid(), name: `${data.name}（导入）` }
        boards.value.push(newBoard)
        activeBoardId.value = newBoard.id
      }
    }

    return {
      // state
      boards,
      activeBoardId,
      // getters
      activeBoard,
      focusItems,
      deferItems,
      // board actions
      init,
      addBoard,
      renameBoard,
      deleteBoard,
      setActiveBoard,
      updateBoardSettings,
      // item actions
      addItem,
      updateItem,
      deleteItem,
      deleteItems,
      clearAllItems,
      reorderItems,
      moveItemUp,
      moveItemDown,
      moveToFocus,
      moveToDefer,
      loadSampleData,
      resetBoard,
      // import/export
      exportBoard,
      importBoard,
    }
  },
  {
    persist: true,
  },
)
