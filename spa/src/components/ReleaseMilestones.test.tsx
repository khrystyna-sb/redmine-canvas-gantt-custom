import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReleaseMilestones } from './ReleaseMilestones';
import type { LayoutRow, Viewport } from '../types';

const day = 86_400_000;
const date = Date.UTC(2026, 10, 25);
const viewport: Viewport = {
    startDate: date - day, scrollX: 0, scrollY: 0, scale: 20 / day,
    width: 300, height: 60, rowHeight: 30
};
const row = {
    type: 'version', id: 'project:42', versionId: '42',
    name: 'Winter release', rowIndex: 0, projectId: 'project',
    dueDate: date + day,
    release: { date, projectName: 'Product', status: 'locked' }
} satisfies LayoutRow;

describe('ReleaseMilestones', () => {
    it('shows the native release date and version link even with no task rows', () => {
        const { rerender } = render(<ReleaseMilestones rows={[row]} viewport={viewport} />);
        const link = screen.getByRole('link', { name: 'Winter release · Product · 2026-11-25 · locked' });
        expect(link).toHaveAttribute('href', '/versions/42');
        expect(link).toHaveTextContent('2026-11-25');
        expect(link.style.left).toBe('34px');

        rerender(<ReleaseMilestones rows={[row]} viewport={{ ...viewport, scale: 40 / day }} />);
        expect(link.style.left).toBe('74px');
        rerender(<ReleaseMilestones rows={[{
            ...row, release: { ...row.release, date: date + day }
        }]} viewport={viewport} />);
        expect(link).toHaveTextContent('2026-11-26');
        expect(link.style.left).toBe('54px');
    });

    it('omits the marker if only a summary date exists or the deadline is outside the viewport', () => {
        const { rerender } = render(<ReleaseMilestones rows={[{ ...row, release: undefined }]} viewport={viewport} />);
        expect(screen.queryByRole('link')).toBeNull();
        rerender(<ReleaseMilestones rows={[row]} viewport={{ ...viewport, scrollX: 100 }} />);
        expect(screen.queryByRole('link')).toBeNull();
    });
});
