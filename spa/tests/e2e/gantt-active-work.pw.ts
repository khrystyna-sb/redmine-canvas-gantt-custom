import { expect, test } from '@playwright/test';
import { defaultMockData, setupMockApp } from './support/mockApp';

const statuses = [
  'Backlog', 'To do', 'On Hold', 'Reopened', 'In Progress', 'Ready for Review',
  'Ready for QA', 'Done', 'Archive', 'Closed', 'Rejected', 'Blocked',
].map((name, index) => ({
  id: index + 1, name, is_closed: ['Done', 'Archive', 'Closed', 'Rejected'].includes(name),
}));
const activeWorkStatusIds = [4, 5, 6, 7, 12];

test.beforeEach(async ({ page }) => {
  await setupMockApp(page, {
    activeWorkStatusIds,
    mockData: {
      ...defaultMockData,
      relations: [],
      statuses,
      tasks: statuses.map(status => ({
        ...defaultMockData.tasks[0],
        id: 100 + status.id,
        subject: 'Task in ' + status.name,
        status_id: status.id,
        status_name: status.name,
      })),
    },
  });
});

test('starts with active work and restores the preset after an explicit status selection', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('cell-104-subject')).toBeVisible();
  for (const { id } of statuses) {
    const task = page.getByTestId('cell-' + (100 + id) + '-subject');
    if (activeWorkStatusIds.includes(id)) await expect(task).toBeVisible();
    else await expect(task).toHaveCount(0);
  }
  await page.getByTitle('Status', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Active work' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByLabel('To do', { exact: true }).check();
  await expect(page.getByTestId('cell-102-subject')).toBeVisible();
  await page.reload();
  await expect(page.getByTestId('cell-102-subject')).toBeVisible();
  await page.getByTitle('Status', { exact: true }).click();
  await page.getByRole('button', { name: 'Active work' }).click();
  await expect(page.getByTestId('cell-102-subject')).toHaveCount(0);
});

test('honors an explicit status in the shared URL', async ({ page }) => {
  await page.goto('/?status_ids%5B%5D=3');
  await expect(page.getByTestId('cell-103-subject')).toBeVisible();
  await expect(page.getByTestId('cell-105-subject')).toHaveCount(0);
});
