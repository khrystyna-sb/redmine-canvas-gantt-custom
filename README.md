# Canvas Gantt Custom для Redmine

<a id="redmine-canvas-gantt"></a><a id="why-this-plugin"></a><a id="key-benefits"></a><a id="overview"></a><a id="highlights"></a>

## Що додано в нашій збірці

Гілка за замовчуванням **`custom`** містить збірку `0.20.0-custom.1` на базі Canvas Gantt `b272f91`.

- **Color by Status.** У **Settings → Display → Color by → Status** діє оновлена палітра. **Reopened**, **In Progress** і **Ready for Review** мають спільний м’який синій колір, **Ready for QA** — фіолетовий, **Blocked** — бурштиновий. Для цих кольорів використано домішку 30% білого. Палітра підтримує користувацькі статуси. Виконана частина смуги має зелену заливку, а колір статусу видно по верхньому краю навіть при 100% виконання. Обидва PNG-експорти відтворюють цей вигляд. Кольори, змінені в легенді, зберігаються в браузері. Щоб повернути оновлені стандартні кольори поверх збережених, натисніть **Reset status colors**.

<a id="окремі-тестові-гілки"></a>

## Тестова гілка дедлайнів релізів

`feature/release-milestones-019` містить окрему збірку `0.19.1.release.1` на базі `v0.19.0`. У рядку **Target version** синій ромб із датою показує дедлайн версії з Redmine і відкриває її. Зелена смуга показує діапазон дат задач і підзадач. Маркер залишається, коли рядок версії згорнуто. [README гілки](https://github.com/khrystyna-sb/redmine-canvas-gantt-custom/blob/feature/release-milestones-019/README.md)

Встановлюйте потрібну збірку в `plugins/redmine_canvas_gantt`. Для ідентифікації збірки записуйте гілку та SHA коміту.

<a id="installation"></a><a id="requirements"></a><a id="supported-browsers"></a><a id="security-and-impact"></a><a id="enable-canvas-gantt-in-a-project"></a><a id="встановлення-гілки-custom-через-git"></a>

## Встановлення через Git

Потрібні Git і доступ на читання приватного репозиторію. Зібраний інтерфейс є в обох збірках. Для встановлення достатньо файлів із Git, без Node.js і міграцій БД.

1. На тестовому стенді зупиніть Redmine, зробіть резервну копію БД і перемістіть наявний каталог плагіна за межі `plugins/` для відкату.
2. З кореня Redmine виконайте команди. Для збірки з дедлайнами замініть `custom` на `feature/release-milestones-019`.

   ```sh
   branch='custom'
   git clone --branch "$branch" --single-branch \
     https://github.com/khrystyna-sb/redmine-canvas-gantt-custom.git \
     plugins/redmine_canvas_gantt
   git -C plugins/redmine_canvas_gantt rev-parse HEAD
   ```

   Для Docker використовуйте каталог на хості, який монтується як `plugins/redmine_canvas_gantt`, або додайте плагін на штатному етапі складання образу.
3. Запишіть SHA. Якщо розгортання має окремий крок публікації статичних файлів, виконайте його. Запустіть Redmine та звірте версію плагіна в **Administration → Plugins**.
4. Перевірте **Administration → Settings → API → Enable REST web service**. У проєкті увімкніть **Settings → Modules → Canvas Gantt**. У **Administration → Roles and permissions** надайте потрібним ролям **View Canvas Gantt** (`view_canvas_gantt`). Для керування базовими планами потрібне окреме право `manage_canvas_gantt_baseline`.

<a id="upgrade"></a><a id="rollback"></a><a id="uninstall"></a><a id="baseline-snapshots"></a>

## Оновлення та відкат

**Оновлення тієї самої гілки.** Зупиніть Redmine, зробіть резервну копію БД і запишіть поточний SHA. Перевірте шлях `origin`, гілку й чистоту робочого каталогу. Якщо плагін встановлено з ZIP, з іншого репозиторію або треба змінити гілку, скористайтеся кроками першого встановлення.

```sh
git -C plugins/redmine_canvas_gantt remote get-url origin
git -C plugins/redmine_canvas_gantt branch --show-current
git -C plugins/redmine_canvas_gantt rev-parse HEAD
git -C plugins/redmine_canvas_gantt status --short
```

Якщо гілка правильна, а `status --short` нічого не вивів, виконайте `git -C plugins/redmine_canvas_gantt pull --ff-only`. Запишіть новий SHA, за потреби оновіть статичні файли й запустіть Redmine.

**Відкат.** Зупиніть Redmine. Після заміни каталогу поверніть збережений `plugins/redmine_canvas_gantt`. Після Git-оновлення, за чистого робочого каталогу, виконайте `git -C plugins/redmine_canvas_gantt switch --detach ПОПЕРЕДНІЙ_SHA`, підставивши записаний SHA. Для подальшого оновлення після відкату поверніться на потрібну гілку через `git switch`. За потреби відновіть відповідні статичні файли й запустіть Redmine. Щоб зберегти базові плани, залиште запис налаштувань плагіна в БД. Завдання `redmine_canvas_gantt:uninstall` видаляє цей запис.

<a id="verification"></a>

## Перевірка на тестовому стенді

Базову збірку `0.20.0-custom.1` і гілку дедлайнів перевіряли на Redmine `6.1.1.stable`. Оновлену палітру й ручний вибір статусів перевіряли в Chrome з тестовими задачами.

- Під звичайною роллю відкрийте діаграму, збережений запит і збережіть зміну тестової задачі. Перед перенесенням на робочий Redmine перевірте SSO та спільні запити через Query Share, якщо вони використовуються.
- **`custom`.** Увімкніть **Color by Status**, перевірте оновлену палітру в діаграмі, **Export PNG** і **Export full PNG**. Виберіть статуси галочками в меню **Status** і відкрийте збережений запит із власним фільтром статусів.
- **`feature/release-milestones-019`.** Увімкніть **Show version headers** і відкрийте версію з датою релізу. Згорніть задачі та відкрийте версію за маркером. Змініть дату версії в Redmine й оновіть діаграму. Маркер має переміститися, а діапазон дат задач має лишитися тим самим.

<a id="demo"></a><a id="usage"></a><a id="work-timer"></a><a id="workload-display-settings-and-export"></a><a id="shared-views-filters-and-query-parameters"></a>
<a id="configuration"></a><a id="data-payload-safety-limits"></a><a id="business-calendars"></a><a id="detailed-calendars-with-yaml"></a><a id="one-global-holiday-list-with-csv"></a><a id="generate-yaml-holiday-files"></a><a id="reload-behavior"></a><a id="compatibility-note"></a>
<a id="docker-quick-start"></a><a id="start-the-stack"></a><a id="load-initial-data"></a><a id="stop-the-stack"></a><a id="development"></a>

[Журнал змін](CHANGELOG.md) · [Результати тестів базової збірки](TESTING.md) · [Посібник оригінального Canvas Gantt](https://tiohsa.github.io/redmine_canvas_gantt/en/) · [日本語マニュアル](https://tiohsa.github.io/redmine_canvas_gantt/ja/) · [日本語 README](README_ja.md)
