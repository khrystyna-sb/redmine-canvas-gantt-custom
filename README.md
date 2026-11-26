<div align="center">

# Redmine Canvas Gantt

Canvas Gantt Custom `0.20.0-custom.1` extends the upstream Canvas-based Gantt plugin for Redmine 6.0, 6.1, and 7.0. It is based on upstream commit `b272f91`. The linked public manuals describe upstream releases.

[Встановлення з GitHub](#installation) · [Оновлення](#upgrade) · [Відкат](#rollback) · [Перевірка після встановлення](#verification)

[English user manual](https://tiohsa.github.io/redmine_canvas_gantt/en/) · [日本語マニュアル](https://tiohsa.github.io/redmine_canvas_gantt/ja/) · [Developer guide](spa/README.md)

Use the manual's navigation for detailed feature, setup, and administration guidance.

[![License](https://img.shields.io/github/license/tiohsa/redmine_canvas_gantt)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/tiohsa/redmine_canvas_gantt/ci.yml?branch=main\&label=CI)](https://github.com/tiohsa/redmine_canvas_gantt/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/tiohsa/redmine_canvas_gantt)](https://github.com/tiohsa/redmine_canvas_gantt/releases)
[![Redmine](https://img.shields.io/badge/Redmine-6.0%20%7C%206.1%20%7C%207.0-red)](#requirements)
[![Ruby](https://img.shields.io/badge/Ruby-See%20Redmine%20requirements-cc342d)](#requirements)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933)](#requirements)

[Redmine Plugins Directory](https://www.redmine.org/plugins/redmine_canvas_gantt) · [Releases](https://github.com/tiohsa/redmine_canvas_gantt/releases) · [Issues](https://github.com/tiohsa/redmine_canvas_gantt/issues) · [日本語 README](README_ja.md)

</div>

## Why this plugin?

Canvas Gantt brings responsive timeline rendering and direct schedule editing to Redmine projects while using Redmine issues, permissions, and saved queries.

## Key benefits

- **Fast:** Canvas rendering with smooth scrolling and zooming.
- **Interactive:** Edit schedules, dependencies, hierarchy, and issue fields from the chart.
- **Low impact:** No database migration; an uninstall task removes the plugin settings and saved baselines.
- **Compatible:** Targets Redmine 6.0, 6.1, and 7.0.

## Overview

View and edit project issues on a Gantt chart, with a task list beside the timeline.

## Highlights

- Move and resize schedules, edit issue fields, and manage pending changes.
- Organize parent-child issues, manage scheduling links, and narrow or share views with filters and saved queries.
- Compare schedules with baselines, review workload, or measure work with the Work Timer.
- Adjust chart presentation and export PNG or CSV.

## Custom features

- **Color by Status** uses Redmine status IDs, including custom statuses. Reopened, In Progress, and Ready for Review share one blue. Ready for QA is purple, and Blocked is amber. The active-work colors are lightened with 30% white. The legend lets you change each color, and both PNG exports use the selected palette.
- **Active work** shows Reopened, In Progress, Ready for Review, Ready for QA, and Blocked when the view opens without a status selection or saved query. Use the **Status** menu to change the selection or choose **Active work** to restore it.
- **Workload Heatmap** shows planned hours by assignee and date with capacity-based colors. Set a daily threshold for each assignee in the Workload menu.
- **Hide Actual** hides time-entry bars, totals, and related indicators while planned hours continue to be calculated.

The browser remembers these preferences. See the [changelog](CHANGELOG.md) and [verification results](TESTING.md).

## Demo

![Canvas Gantt demo: schedule editing and dependency creation](./docs/demo-current.gif)

Watch [schedule editing](./website/public/videos/schedule-edit.mp4) and [dependency creation](./website/public/videos/dependency-create.mp4).

## Requirements

- Redmine 6.0, 6.1, or 7.0 and a Ruby version supported by that Redmine release.
- Redmine REST API enabled and a desktop version of Google Chrome or Microsoft Edge.
- Node.js 20+ only to build the SPA from source; it is not required for normal operation with the included built assets.

<a id="supported-browsers"></a>

### Tested environment

Tested with desktop versions of Google Chrome and Microsoft Edge. Other browsers have not been tested.

### Security and impact

No database migration is required. Access requires `view_canvas_gantt`; baseline saving uses `manage_canvas_gantt_baseline`, and issue actions follow standard Redmine permissions on each target issue's project. Before removing the plugin, run the uninstall task; it deletes the complete plugin settings row, including saved baselines.

## Installation

Для тестування кольорів використовуйте гілку **`preview/status-palette`**. Потрібні Git на сервері й доступ на читання до приватного репозиторію. Файли інтерфейсу вже зібрані. Для цієї збірки встановлювати Node.js або запускати міграції бази даних не потрібно.

1. На тестовому стенді зупиніть Redmine й зробіть резервну копію бази даних. Якщо Canvas Gantt уже встановлено, збережіть його каталог і перемістіть його за межі `plugins/`.
2. З кореневого каталогу Redmine виконайте:

   ```sh
   git clone --branch preview/status-palette --single-branch \
     https://github.com/khrystyna-sb/redmine-canvas-gantt-custom.git \
     plugins/redmine_canvas_gantt

   git -C plugins/redmine_canvas_gantt rev-parse HEAD
   test -f plugins/redmine_canvas_gantt/init.rb
   test -f plugins/redmine_canvas_gantt/assets/build/.vite/manifest.json
   ```

   Запишіть SHA, який показав Git. Якщо Redmine працює в Docker, клонуйте плагін у каталог на хості, який монтується як `plugins/redmine_canvas_gantt`.
3. Запустіть Redmine штатним способом. У **Administration → Plugins** перевірте, що Canvas Gantt доступний і має версію `0.20.0-custom.1`.
4. Увімкніть REST API в **Administration → Settings → API**. У потрібному проєкті увімкніть модуль **Canvas Gantt** через **Settings → Modules**. Для ролей, які мають бачити діаграму, увімкніть право **View Canvas Gantt** (`view_canvas_gantt`) в **Administration → Roles and permissions**.

### Upgrade

Для переходу зі збірки, встановленої з ZIP або іншого джерела, виконайте [першу установку](#installation) зі збереженням попереднього каталогу. Для наступного оновлення цієї ж гілки зупиніть Redmine, зробіть резервну копію та збережіть поточний SHA:

```sh
git -C plugins/redmine_canvas_gantt rev-parse HEAD
git -C plugins/redmine_canvas_gantt status --short
```

Якщо `git status` показує локальні зміни, спершу збережіть їх. Коли робочий каталог чистий, виконайте:

```sh
git -C plugins/redmine_canvas_gantt switch preview/status-palette
git -C plugins/redmine_canvas_gantt pull --ff-only origin preview/status-palette
git -C plugins/redmine_canvas_gantt rev-parse HEAD
```

Запустіть Redmine й повторіть [перевірку після встановлення](#verification).

### Rollback

Зупиніть Redmine. Якщо замінювали попередній каталог плагіна, поверніть його під назвою `plugins/redmine_canvas_gantt`. Після Git-оновлення поверніться на SHA, збережений перед оновленням:

```sh
git -C plugins/redmine_canvas_gantt switch --detach ПОПЕРЕДНІЙ_SHA
```

Запустіть Redmine і перевірте відкриття діаграми. Збережіть запис налаштувань плагіна в Redmine, щоб зберегти базові плани. Завдання `redmine_canvas_gantt:uninstall` призначене для повного видалення.

<a id="verification"></a>

### Перевірка після встановлення

- Відкрийте **Canvas Gantt** під звичайним учасником проєкту. У вигляді без збереженого запиту чи вибраного фільтра перевірте п’ять активних статусів. **Status → Active work** відновлює цю добірку.
- Увімкніть **Settings → Display → Color by → Status**. Перевірте спільний синій колір для In Progress і Ready for Review, фіолетовий для Ready for QA і бурштиновий для Blocked. Змініть один колір і оновіть сторінку. Переконайтеся, що вибраний колір зберігся.
- Завантажте **Export PNG** і **Export full PNG**. Обидва файли мають показувати вибрані кольори. У режимі **Default** перевірте зелений відрізок виконаного відсотка.

Палітру та фільтр цієї гілки перевірено в Chrome з вигаданими задачами. Перед ширшим використанням повторіть ці кроки на вашій версії Redmine з установленими плагінами.

### Uninstall

Run `bundle exec rake redmine_canvas_gantt:uninstall RAILS_ENV=production` from the Redmine application directory while the plugin is still present, then remove the plugin directory and restart Redmine. This deletes the complete `plugin_redmine_canvas_gantt` settings row, including stored baselines and plugin defaults; browser `localStorage` is not cleared. For Docker, run the task inside the Redmine service.

## Usage

Enable Redmine's REST API, enable **Canvas Gantt** under the project's **Settings → Modules**, grant `view_canvas_gantt`, and open the chart from the project menu. Issue edits, creation, deletion, and relations still require the relevant standard Redmine permissions on the target issue's project; grant `manage_canvas_gantt_baseline` only to roles allowed to save baselines.

### Work Timer

Measure work on an issue and record it through Redmine's standard time-entry form.

### Baseline snapshots

Save one schedule snapshot per project and compare it with the current chart. Saving another snapshot replaces the previous one.

### Workload, display settings, and export

Review planned and actual workload, keep display preferences in the browser profile, and export the current view.

## Shared views, filters, and query parameters

Use supported URL parameters and Redmine saved queries to share business filters and view state.

## Configuration

Canvas Gantt has no plugin configuration screen. Baselines are stored in Redmine plugin settings; display preferences are stored in each browser profile.

### Data payload safety limits

The data endpoint rejects oversized complete payloads instead of returning a truncated task graph; administrators can lower its built-in limits with environment variables.

### Business calendars

Named business calendars can define weekly non-working days, holidays, company shutdowns, and substitute working days. Use either YAML calendar configuration or the single shared `holiday.csv` format in a calendar directory; CSV and YAML files cannot coexist there.

#### Detailed calendars with YAML

YAML supports named calendars, project mapping, inheritance, and working-day overrides.

#### One global holiday list with CSV

Place one `holiday.csv` at the calendar directory root for a shared global holiday list. Do not place YAML calendar files in the same directory.

#### Generate YAML holiday files

The repository includes a tool for generating country holiday calendars.

#### Reload behavior

Calendar files are checked at runtime, and an invalid reload keeps the last valid snapshot.

### Compatibility note

If Redmica UI Extension's Select2 behavior interferes with chart controls, disable searchable select boxes in that extension's settings.

## Docker Quick Start

This repository includes a disposable Docker Compose environment for local Redmine evaluation. It uses sample credentials; do not expose it to a network or use it with production data.

### Start the stack

Use `docker compose up -d --wait` from the repository root.

### Load initial data

Follow the manual navigation above for local initial-data setup. Load test fixtures only into a fresh disposable database; they can overwrite records.

### Enable Canvas Gantt in a project

Enable the project module and grant `view_canvas_gantt` plus the standard Redmine permissions needed for the intended issue actions.

### Stop the stack

Use `docker compose down` from the repository root.

## Development

The SPA is in `spa/`. See [spa/README.md](spa/README.md) for frontend setup and development commands.
