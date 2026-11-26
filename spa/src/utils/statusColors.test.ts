import { describe, expect, it } from 'vitest';
import { getStatusColor } from './statusColors';

describe('default status palette', () => {
    it.each([
        ['New', '#748191'],
        ['  In_Progress ', '#658ede'],
        ['Reopened', '#658ede'],
        ['Ready for Review', '#658ede'],
        ['Ready for QA', '#9e79d6'],
        ['Готово', '#598371'],
        ['Blocked', '#c3804d'],
    ])('uses the same default for %s across Redmine status IDs', (name, color) => {
        const status = { name, isClosed: false };
        expect(getStatusColor(4, {}, status)).toBe(color);
        expect(getStatusColor(42, {}, status)).toBe(color);
    });

    it('uses stable muted defaults for custom statuses and respects overrides', () => {
        const waiting = { name: 'Waiting for supplier', isClosed: false };
        expect(getStatusColor(7, {}, waiting)).toBe('#617f8d');
        expect(getStatusColor(7, {}, { ...waiting, isClosed: true })).toBe('#598371');
        expect(getStatusColor(7, { 7: '#ff9900' }, waiting)).toBe('#ff9900');
    });
});
