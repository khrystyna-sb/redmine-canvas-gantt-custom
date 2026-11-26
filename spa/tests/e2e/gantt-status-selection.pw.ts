import { expect, test } from '@playwright/test';
import { defaultMockData, setupMockApp } from './support/mockApp';

const statuses = [
  'Backlog', 'To do', 'On Hold', 'Reopened', 'In Progress', 'Ready for Review',
  'Ready for QA', 'Done', 'Archive', 'Closed', 'Rejected', 'Blocked',
].map((name, index) => ({
  id: index + 1, name, is_closed: ['Done', 'Archive', 'Closed', 'Rejected'].includes(name),
}));

test.beforeEach(async ({ page }) => {
  await setupMockApp(page, {
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

test('opens without a preset and restores manually selected statuses after reload', async ({ page }) => {
  await page.goto('/');
  for (const { id } of statuses) {
    await expect(page.getByTestId('cell-' + (100 + id) + '-subject')).toBeVisible();
  }

  await page.getByTitle('Status', { exact: true }).click();
  await expect(page.getByRole('button', { name: 'Active work', exact: true })).toHaveCount(0);
  await page.getByLabel('To do', { exact: true }).check();
  await expect(page.getByTestId('cell-102-subject')).toBeVisible();
  await expect(page.getByTestId('cell-105-subject')).toHaveCount(0);

  await page.reload();
  await expect(page.getByTestId('cell-102-subject')).toBeVisible();
  await expect(page.getByTestId('cell-105-subject')).toHaveCount(0);
});

test('honors an explicit status in the shared URL', async ({ page }) => {
  await page.goto('/?status_ids%5B%5D=3');
  await expect(page.getByTestId('cell-103-subject')).toBeVisible();
  await expect(page.getByTestId('cell-105-subject')).toHaveCount(0);
});
