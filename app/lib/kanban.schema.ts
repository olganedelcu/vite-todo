export const COLUMNS = {
  todo: { label: 'Todo' },
  doing: { label: 'In Progress' },
  done: { label: 'Done' },
} as const;

export type KanbanStatus = keyof typeof COLUMNS;

const COLUMN_ORDER: KanbanStatus[] = ['todo', 'doing', 'done'];

export function getNextStatus(current: KanbanStatus): KanbanStatus {
  const index = COLUMN_ORDER.indexOf(current);
  return COLUMN_ORDER[Math.min(index + 1, COLUMN_ORDER.length - 1)];
}

export function isValidStatus(status: string): status is KanbanStatus {
  return Object.keys(COLUMNS).includes(status);
}
