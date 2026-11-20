import { describe, expect, it } from 'vitest';
import { getHeatmapColor, getHeatmapDayAtX, getHeatmapDays, heatmapColors } from './workloadHeatmap';
import { parseDateOnly } from '../utils/dateOnly';

describe('workload heatmap', () => {
    it('keeps empty days, holidays and individual thresholds distinct', () => {
        expect(getHeatmapColor(0, 8, true)).toBe(heatmapColors.empty);
        expect(getHeatmapColor(0, 8, false)).toBe(heatmapColors.nonWorking);
        expect(getHeatmapColor(4, 8, true)).toBe(heatmapColors.light);
        expect(getHeatmapColor(4, 4, true)).toBe(heatmapColors.full);
        expect(getHeatmapColor(4, 3, true)).toBe(heatmapColors.overload);
        expect(getHeatmapColor(0.5, 0, false)).toBe(heatmapColors.overload);
    });

    it('aligns visible date columns and hit targets across a daylight-saving boundary', () => {
        const viewport = {
            startDate: parseDateOnly('2026-03-07')!,
            scale: 40 / 86_400_000,
            scrollX: 20,
            scrollY: 0,
            width: 100,
            height: 72,
            rowHeight: 36
        };
        expect(getHeatmapDays(viewport, 100).map(({ key, x }) => [key, x])).toEqual([
            ['2026-03-07', -20], ['2026-03-08', 20], ['2026-03-09', 60]
        ]);
        expect(getHeatmapDayAtX(viewport, 25)).toBe('2026-03-08');
        expect(getHeatmapDayAtX(viewport, 85)).toBe('2026-03-09');
    });
});
