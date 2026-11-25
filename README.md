# Canvas Gantt із дедлайнами релізів

**Збірка `0.19.1.release.1`** для Redmine `6.1.1.stable` на базі Canvas Gantt `0.19.0`. У рядку версії синій ромб позначає дедлайн Redmine, а зелений відрізок показує діапазон дат задач.

Для встановлення потрібен доступ на читання приватного репозиторію. Зібраний фронтенд уже в Git. Для цієї збірки міграції й збірка через npm не потрібні.

## Перше встановлення з Git або перехід із 0.19.0

1. На тестовому Redmine зупиніть застосунок, зробіть резервну копію БД і перемістіть наявний каталог `plugins/redmine_canvas_gantt` за межі `plugins/`.
2. З кореня Redmine виконайте:

   ```sh
   git clone --branch feature/release-milestones-019 \
     https://github.com/khrystyna-sb/redmine-canvas-gantt-custom.git \
     plugins/redmine_canvas_gantt
   git -C plugins/redmine_canvas_gantt rev-parse HEAD
   ```

3. Запишіть SHA, виконайте штатний крок публікації assets, якщо він є у вашому розгортанні, та запустіть Redmine. У **Administration → Plugins** перевірте версію. Для нового проєкту увімкніть модуль **Canvas Gantt**, надайте ролі право `view_canvas_gantt` і перевірте, що REST API увімкнено.

## Наступні оновлення

Зупиніть Redmine, запишіть поточний SHA й підтвердьте, що `git status --short` не показує локальних змін. Із кореня Redmine виконайте:

```sh
git -C plugins/redmine_canvas_gantt rev-parse HEAD
git -C plugins/redmine_canvas_gantt status --short
git -C plugins/redmine_canvas_gantt switch feature/release-milestones-019
git -C plugins/redmine_canvas_gantt pull --ff-only origin feature/release-milestones-019
```

Виконайте штатне оновлення assets, запустіть Redmine та перевірте [сценарії приймання](docs/release-milestone-test-build.md).

## Відкат

Зупиніть Redmine. Після першого переходу поверніть попередній каталог плагіна. Після Git-оновлення поверніться на записаний SHA:

```sh
git -C plugins/redmine_canvas_gantt switch --detach ПОПЕРЕДНІЙ_SHA
```

Відновіть відповідні assets і запустіть Redmine. Для відкату цієї збірки на `0.19.0` відновлення БД не потрібне.

## Перевірка сумісності

Оновлення перевірено на Redmine `6.1.1.stable` разом із вісьмома плагінами. Перед оновленням робочого Redmine перевірте на вашому тестовому стенді SSO та спільні запити через Query Share. Повний набір встановлених плагінів ще не перевірено.
