import type { TaskStatus } from '../types';

export type TaskColorMode = 'default' | 'status';
export type StatusColors = Readonly<Record<number, string>>;

const PLANNED = '#748191';
const COMPLETED = '#598371';

// Blend the active-work colors with 30% white so swatches, bars, and PNGs use the same hex values.
const ACTIVE = '#658ede';
const QA = '#9e79d6';
const BLOCKED = '#c3804d';

const STATUS_GROUPS = [
    { color: PLANNED, names: ['new', 'open', 'to do', 'planned', 'backlog', 'новий', 'відкрито', 'заплановано', '新規'] },
    { color: ACTIVE, names: ['in progress', 'in work', 'reopened', 'review', 'in review', 'ready for review', 'в роботі', 'на перевірці', '処理中', '進行中', 'レビュー中'] },
    { color: QA, names: ['ready for qa', 'qa', 'testing', 'feedback', 'тестування', 'フィードバック'] },
    { color: COMPLETED, names: ['done', 'resolved', 'completed', 'closed', 'готово', 'виконано', 'вирішено', 'закрито', '解決', '終了', '完了'] },
    { color: BLOCKED, names: ['blocked', 'on hold', 'заблоковано', 'призупинено', '保留'] },
    { color: PLANNED, names: ['archive', 'archived', 'cancelled', 'canceled', 'rejected', 'відхилено', 'скасовано', '却下'] },
];

const COLOR_BY_NAME = new Map(STATUS_GROUPS.flatMap(({ color, names }) => names.map(name => [name, color] as const)));
const CUSTOM_STATUS_PALETTE = ['#617f8d', '#89677a', '#786c8e', '#7c794e', '#986a61', PLANNED];

export const isStatusColor = (color: unknown): color is string =>
    typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color);

export const normalizeStatusColors = (value: unknown): StatusColors => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

    return Object.fromEntries(Object.entries(value)
        .filter(([id, color]) => /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id)) && isStatusColor(color))
        .map(([id, color]) => [id, color.toLowerCase()]));
};

export const getStatusColor = (id: number, colors: StatusColors, status?: Pick<TaskStatus, 'name' | 'isClosed'>): string => {
    const name = status?.name.normalize('NFKC').trim().toLowerCase().replace(/[\s_-]+/g, ' ') ?? '';
    const fallback = CUSTOM_STATUS_PALETTE[(id - 1) % CUSTOM_STATUS_PALETTE.length] ?? PLANNED;
    return colors[id] ?? COLOR_BY_NAME.get(name) ?? (status?.isClosed ? COMPLETED : fallback);
};
