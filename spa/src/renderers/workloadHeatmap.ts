import type { Viewport } from '../types';
import { addCalendarDays, calendarDateKey, toCalendarDate } from '../utils/dateOnly';
import { isWorkingDay } from '../utils/businessCalendar';
import { canvasFonts, designTokens } from '../styles/designTokens';
import { compareWorkloadAssignees } from '../services/WorkloadLogicService';
import type { WorkloadRenderState } from './WorkloadRenderer';

const DAY_MS = 86_400_000;

export const heatmapColors = {
    empty: '#f5f7fa',
    nonWorking: '#e8ecf1',
    light: '#d9edf7',
    moderate: '#abd5ec',
    full: '#74b5db',
    overload: '#f2a49d'
};

export const getHeatmapColor = (hours: number, capacity: number, working: boolean) => {
    if (hours <= 0) return working ? heatmapColors.empty : heatmapColors.nonWorking;
    if (hours > capacity) return heatmapColors.overload;
    if (hours <= capacity * 0.5) return heatmapColors.light;
    if (hours <= capacity * 0.8) return heatmapColors.moderate;
    return heatmapColors.full;
};

export const getHeatmapDayAtX = (viewport: Viewport, x: number) =>
    calendarDateKey(toCalendarDate(viewport.startDate + (viewport.scrollX + x) / viewport.scale));

export const getHeatmapDays = (viewport: Viewport, width: number) => {
    if (width <= 0 || !Number.isFinite(viewport.scale) || viewport.scale <= 0) return [];

    const dayWidth = DAY_MS * viewport.scale;
    const firstDay = toCalendarDate(viewport.startDate + viewport.scrollX / viewport.scale);
    const firstX = (firstDay - viewport.startDate) * viewport.scale - viewport.scrollX;
    const count = Math.ceil((width - firstX) / dayWidth);
    // A corrupt or extreme stored scale can otherwise allocate an unbounded array.
    if (!Number.isSafeInteger(count) || count < 1 || count > 10_000) return [];
    return Array.from({ length: count }, (_, index) => {
        const date = addCalendarDays(firstDay, index);
        return { date, key: calendarDateKey(date), x: firstX + index * dayWidth, width: dayWidth };
    });
};

export function renderWorkloadHeatmap(ctx: CanvasRenderingContext2D, state: WorkloadRenderState, width: number, height: number) {
    if (!state.workloadData) return;
    const rowHeight = state.viewport.rowHeight * 2;
    const days = getHeatmapDays(state.viewport, width).map(day => ({
        ...day, working: isWorkingDay(day.date, state.projectId)
    }));
    const assignees = [...state.workloadData.assignees.values()].sort(compareWorkloadAssignees);
    const firstRow = Math.max(0, Math.floor(state.verticalScroll / rowHeight));
    const endRow = Math.ceil((state.verticalScroll + height) / rowHeight);

    ctx.font = canvasFonts.bodyStrong;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const [index, assignee] of assignees.slice(firstRow, endRow).entries()) {
        const y = (firstRow + index) * rowHeight - state.verticalScroll;
        const capacity = assignee.capacityHours ?? state.capacityThreshold;
        days.forEach(day => {
            const hours = assignee.dailyWorkloads.get(day.key)?.plannedLoad ?? 0;
            const cellWidth = Math.max(day.width - 1, day.width / 2);
            ctx.fillStyle = getHeatmapColor(hours, capacity, day.working);
            ctx.fillRect(day.x, y + 1, cellWidth, rowHeight - 2);

            const label = hours === 0 && !day.working ? '—' : hours.toFixed(1);
            if (cellWidth >= 24 && ctx.measureText(label).width + 4 <= cellWidth) {
                ctx.fillStyle = designTokens.textPrimary;
                ctx.fillText(label, day.x + cellWidth / 2, y + rowHeight / 2);
            }
            if (assignee.assigneeId === state.focusedAssigneeId && day.key === state.focusedDateStr && state.focusedSeries !== 'actual') {
                ctx.strokeStyle = designTokens.focus;
                ctx.lineWidth = 2;
                ctx.strokeRect(day.x, y + 1, cellWidth, rowHeight - 2);
            }
        });
    }
}
