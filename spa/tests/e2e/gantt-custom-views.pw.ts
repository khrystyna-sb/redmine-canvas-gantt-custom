import { readFile } from 'node:fs/promises';
import { expect, test, type Page } from '@playwright/test';
import { defaultMockData, setupMockApp, waitForInitialRender } from './support/mockApp';

const workDate = '2026-02-02';
const customColor = '#d125c7';
const data = {
  ...defaultMockData,
  relations: [],
  statuses: [
    { id: 1, name: 'New', is_closed: false },
    { id: 24, name: 'Ready for review', is_closed: false },
  ],
  tasks: defaultMockData.tasks.slice(0, 2).map((task, index) => ({
    ...task,
    id: 101 + index,
    subject: index ? 'Synthetic test review' : 'Synthetic test planning',
    status_id: index ? 1 : 24,
    status_name: index ? 'New' : 'Ready for review',
    start_date: workDate,
    due_date: workDate,
    estimated_hours: 8,
    ratio_done: 0,
    parent_id: undefined,
  })),
  filter_options: {
    projects: [{ id: 1, name: 'Synthetic project' }],
    assignees: [
      { id: 10, name: 'Jane Doe', project_ids: [1] },
      { id: 11, name: 'John Smith', project_ids: [1] },
    ],
  },
};

const alignTimeline = async (page: Page) => page.evaluate(async () => {
  const { useTaskStore } = await import('/src/stores/TaskStore.ts');
  const store = useTaskStore.getState();
  store.setZoomLevel(2);
  store.updateViewport({ startDate: Date.UTC(2026, 1, 2), scrollX: 0, scrollY: 0 });
});

const openWorkload = async (page: Page) => {
  await page.getByTestId('workload-menu-button').click();
  await page.getByLabel('Show Workload Pane').check();
};

const countCustomPixels = async (page: Page, entry: string) => {
  await page.getByTestId('export-menu-button').click();
  const received = page.waitForEvent('download');
  await page.getByRole('button', { name: entry, exact: true }).click();
  const path = await (await received).path();
  if (!path) throw new Error('PNG download did not produce a file');
  const base64 = (await readFile(path)).toString('base64');
  return page.evaluate(async (png) => {
    const image = await createImageBitmap(await fetch(`data:image/png;base64,${png}`).then(response => response.blob()));
    const canvas = new OffscreenCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(image, 0, 0);
    const colors = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    image.close();
    let count = 0;
    for (let offset = 0; offset < colors.length; offset += 4) {
      if (colors[offset] === 209 && colors[offset + 1] === 37 && colors[offset + 2] === 199) count++;
    }
    return count;
  }, base64);
};

test.beforeEach(async ({ page }) => {
  await setupMockApp(page, { mockData: data });
  await page.route('**/canvas_gantt/actual_workload.json**', route => route.fulfill({ json: { entries: [
    { id: 'demo-entry', issueId: '101', userId: 10, userName: 'Jane Doe', spentOn: workDate, hours: 12 },
  ] } }));
  await waitForInitialRender(page);
  await alignTimeline(page);
});

test('persists status colors and exports the configured RGB in both PNGs', async ({ page }) => {
  await page.getByTestId('display-settings-menu-button').click();
  await page.getByRole('combobox', { name: 'Color by' }).selectOption('status');
  await expect(page.getByRole('group', { name: 'Status colors' })).toBeVisible();
  await expect(page.getByLabel('New', { exact: true })).toBeVisible();
  await page.getByLabel('Ready for review', { exact: true }).fill(customColor);

  await page.reload();
  await page.getByTestId('cell-101-subject').waitFor();
  await alignTimeline(page);
  await page.getByTestId('display-settings-menu-button').click();
  await expect(page.getByRole('combobox', { name: 'Color by' })).toHaveValue('status');
  await expect(page.getByLabel('Ready for review', { exact: true })).toHaveValue(customColor);
  await page.getByTestId('display-settings-menu-button').click();

  expect(await countCustomPixels(page, 'Export PNG')).toBeGreaterThan(20);
  expect(await countCustomPixels(page, 'Export full PNG')).toBeGreaterThan(20);
});

test('applies capacity and status filters and preserves workload modes on reload', async ({ page }) => {
  await openWorkload(page);
  const panel = page.getByTestId('workload-canvas-panel');
  const sidebar = page.getByTestId('workload-sidebar');
  await expect(sidebar.getByLabel('Actual 12.0h').first()).toBeVisible();
  await expect(sidebar.getByTestId('actual-overload-action-area-10')).toBeVisible();

  const menu = page.getByTestId('workload-menu');
  await menu.getByRole('combobox', { name: 'Actual hours', exact: true }).selectOption('hide');
  await expect(sidebar.getByLabel('Actual 12.0h')).toHaveCount(0);
  await expect(sidebar.getByTestId('actual-overload-action-area-10')).toHaveCount(0);
  await expect(sidebar.getByTestId('workload-sidebar-total-10').getByLabel('Planned 8.0h')).toBeVisible();

  await menu.getByRole('combobox', { name: 'Workload view', exact: true }).selectOption('heatmap');
  await menu.getByRole('combobox', { name: 'Capacity by assignee (hours/day)', exact: true }).selectOption('10');
  await menu.getByLabel('Capacity by assignee (hours/day) — Jane Doe').fill('4');
  await expect(sidebar.getByTestId('overload-action-area-10')).toBeVisible();
  await expect(sidebar.getByTestId('overload-action-area-11')).toHaveCount(0);
  await page.getByTestId('workload-menu-button').click();
  await expect(panel.getByTestId('workload-heatmap-dates')).toBeVisible();
  await panel.getByTestId('workload-canvas').hover({ position: { x: 12, y: 12 } });
  await expect(panel.getByRole('tooltip')).toContainText('8.0h');
  await expect(panel.getByRole('tooltip')).toContainText('4h');

  await page.goto('/?status_ids=24');
  await page.getByTestId('cell-101-subject').waitFor();
  await alignTimeline(page);
  await openWorkload(page);
  await expect(menu.getByRole('combobox', { name: 'Actual hours', exact: true })).toHaveValue('hide');
  await expect(menu.getByRole('combobox', { name: 'Workload view', exact: true })).toHaveValue('heatmap');
  await expect(sidebar.getByTestId('workload-sidebar-row-10')).toBeVisible();
  await expect(sidebar.getByTestId('workload-sidebar-row-11')).toHaveCount(0);
});
