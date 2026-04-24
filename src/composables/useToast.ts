import { ref } from 'vue'

interface ToastItem {
  id: number
  message: string
}

const toasts = ref<ToastItem[]>([])
let counter = 0

export function useToast() {
  function show(message: string) {
    const id = ++counter
    toasts.value.push({ id, message })
  }

  function remove(id: number) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  return { toasts, show, remove }
}
