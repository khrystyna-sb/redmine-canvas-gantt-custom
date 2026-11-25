import { describe, expect, it } from 'vitest';
import type { Task, Version } from '../../types';
import { buildLayout, getVersionRowId } from './layout';

const start = Date.UTC(2026, 10, 24);
const childDue = Date.UTC(2026, 10, 29);
const deadline = Date.UTC(2026, 11, 9);
const root: Task = {
    id: '1', subject: 'Parent', projectId: 'p', fixedVersionId: 'v',
    startDate: start, dueDate: Date.UTC(2026, 10, 26),
    ratioDone: 0, statusId: 1, lockVersion: 0, editable: true, rowIndex: 0, hasChildren: true
};
const child: Task = { ...root, id: '2', parentId: root.id, dueDate: childDue, hasChildren: false };

describe('version summary dates', () => {
    it.each([deadline, undefined])('uses the full task tree independently of release date %s', effectiveDate => {
        const tasks = [root, child];
        const version: Version = { id: 'v', name: 'Winter', projectId: 'p', status: 'open', effectiveDate };
        const { layoutRows } = buildLayout(
            tasks, [], [version], true, false, true, false, {},
            { [getVersionRowId('p', 'v')]: false }, {}, [], [],
            { key: 'startDate', direction: 'asc' }, tasks, []
        );
        expect(layoutRows).toHaveLength(2);
        expect(layoutRows[1]).toMatchObject({
            type: 'version', startDate: start, dueDate: childDue,
            release: effectiveDate === undefined ? undefined : { date: effectiveDate }
        });
    });
});
