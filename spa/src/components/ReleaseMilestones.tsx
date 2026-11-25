import { LayoutEngine } from '../engines/LayoutEngine';
import { designTokens } from '../styles/designTokens';
import type { LayoutRow, Viewport } from '../types';
import { formatDateOnly } from '../utils/dateOnly';
import { buildRedmineUrl } from '../utils/redmineUrl';

type Props = {
    rows: LayoutRow[];
    viewport: Viewport;
};

export function ReleaseMilestones({ rows, viewport }: Props) {
    const [startRow, endRow] = LayoutEngine.getVisibleRowRange(viewport, rows.length);

    return rows.slice(startRow, endRow + 1).map(row => {
        if (row.type !== 'version' || !row.release) return null;

        const { date, projectName, status } = row.release;
        const label = formatDateOnly(date);
        const x = LayoutEngine.calendarDateToX(LayoutEngine.snapDate(date), viewport, 'end') - viewport.scrollX;
        if (!label || x < 0 || x >= viewport.width) return null;

        const hasTaskRange = row.startDate !== undefined && row.dueDate !== undefined;
        const details = [row.name, projectName, label, status].filter(Boolean).join(' · ');
        return (
            <a
                key={row.id}
                href={buildRedmineUrl(`/versions/${encodeURIComponent(row.versionId)}`)}
                title={details}
                aria-label={details}
                draggable={false}
                data-release-milestone

                style={{
                    position: 'absolute',
                    zIndex: 5,
                    left: x - 6,
                    top: (row.rowIndex + 0.5) * viewport.rowHeight - viewport.scrollY - (hasTaskRange ? 10 : 0),
                    transform: 'translateY(-50%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    paddingRight: 6,
                    whiteSpace: 'nowrap',
                    color: designTokens.controlActiveFg,
                    background: designTokens.controlActiveBg,
                    borderRadius: 4,
                    textDecoration: 'none',
                    fontSize: 12,
                    fontWeight: 700,
                    lineHeight: '16px'
                }}
            >
                <span aria-hidden="true" style={{
                    display: 'inline-block',
                    width: 12,
                    height: 12,
                    background: 'currentColor',
                    transform: 'rotate(45deg) scale(0.9)'
                }} />
                {label}
            </a>
        );
    });
}
