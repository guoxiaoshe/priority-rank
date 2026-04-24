export interface Item {
  id: string
  text: string
  createdAt: number
}

export interface Board {
  id: string
  name: string
  items: Item[]
  topN: number
  sortLabel: string
  deferMessage: string
}

export interface AppState {
  boards: Board[]
  activeBoardId: string | null
}

export const DEFAULT_SORT_LABEL = '对长期幸福的重要性'

export const SAMPLE_ITEMS: string[] = [
  '改善睡眠',
  '保持运动',
  '提升自媒体产出',
  '继续记录冲动',
  '补充镁元素',
  '徒步探索',
]

export function makeDeferMessage(): string {
  const now = new Date()
  const nextMonth = now.getMonth() + 2 // getMonth() 0-indexed, +1 to human, +1 for next
  const monthLabel = nextMonth > 12 ? nextMonth - 12 : nextMonth
  return `我不是放弃它们，我只是暂时把它们放在 ${monthLabel}月 之后。`
}
