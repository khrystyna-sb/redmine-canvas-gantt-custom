export type TaskColorMode = 'default' | 'status';
export type StatusColors = Readonly<Record<number, string>>;

const STATUS_PALETTE = [
    '#2563eb', '#7c3aed', '#00877c', '#a34b08', '#be185d', '#475569',
    '#0369a1', '#4d7c0f', '#b91c1c', '#6d28a8', '#047857', '#9a3412'
];

export const isStatusColor = (color: unknown): color is string =>
    typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color);

export const normalizeStatusColors = (value: unknown): StatusColors => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

    return Object.fromEntries(Object.entries(value)
        .filter(([id, color]) => /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id)) && isStatusColor(color))
        .map(([id, color]) => [id, color.toLowerCase()]));
};

export const getStatusColor = (id: number, colors: StatusColors): string =>
    colors[id] ?? STATUS_PALETTE[(id - 1) % STATUS_PALETTE.length];
