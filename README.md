# Canvas Gantt Custom для Redmine

<a id="redmine-canvas-gantt"></a><a id="why-this-plugin"></a><a id="key-benefits"></a><a id="overview"></a><a id="highlights"></a>

## Що додано в нашій збірці

Гілка за замовчуванням **`custom`** (`0.20.0-custom.1`, на базі `b272f91`) містить **Color by Status**. У **Settings → Display → Color by → Status** можна забарвити смуги задач за статусами Redmine, зокрема користувацькими. Кольори змінюються в легенді, зберігаються в браузері й використовуються в обох PNG-експортах.

## Окремі тестові гілки

| Гілка | Збірка | Що додано |
| --- | --- | --- |
| [`preview/status-palette`](https://github.com/khrystyna-sb/redmine-canvas-gantt-custom/tree/preview/status-palette) | `0.20.0-custom.1` | Палітра статусів поверх `custom`. **Reopened**, **In Progress** і **Ready for Review** мають спільний синій колір, **Ready for QA** — фіолетовий, **Blocked** — бурштиновий. **Status → Active work** вибирає ці п’ять статусів. Добірка застосовується при відкритті діаграми, якщо немає збереженого запиту, явного фільтра статусів чи збереженого вибору статусів. [README гілки](https://github.com/khrystyna-sb/redmine-canvas-gantt-custom/blob/preview/status-palette/README.md#installation) |
| [`feature/release-milestones-019`](https://github.com/khrystyna-sb/redmine-canvas-gantt-custom/tree/feature/release-milestones-019) | `0.19.1.release.1`, на базі `v0.19.0` | У рядку **Target version** синій ромб із датою показує дедлайн версії з Redmine. Натискання відкриває версію. Зелена смуга показує діапазон дат задач і підзадач. Маркер залишається, коли рядок версії згорнуто. [README гілки](https://github.com/khrystyna-sb/redmine-canvas-gantt-custom/blob/feature/release-milestones-019/README.md) |

Кожна гілка встановлюється окремо в `plugins/redmine_canvas_gantt`. У `custom` і `preview/status-palette` однакова версія плагіна, тому для ідентифікації збірки записуйте гілку та SHA коміту.

<a id="installation"></a><a id="requirements"></a><a id="supported-browsers"></a><a id="security-and-impact"></a><a id="enable-canvas-gantt-in-a-project"></a><a id="встановлення-гілки-custom-через-git"></a>

## Встановлення через Git

Потрібні Git і доступ на читання приватного репозиторію. Зібраний інтерфейс є в усіх трьох гілках. Для встановлення достатньо файлів із Git, без Node.js і міграцій БД.

1. На тестовому стенді зупиніть Redmine, зробіть резервну копію БД і перемістіть наявний каталог плагіна за межі `plugins/` для відкату.
2. З кореня Redmine виконайте команди. У `branch` вкажіть потрібну гілку з README.

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

Для `custom` і `feature/release-milestones-019` перевірки проводили на Redmine `6.1.1.stable`. Палітру та фільтр `preview/status-palette` перевірили в Chrome з тестовими задачами.

- Під звичайною роллю відкрийте діаграму, збережений запит і збережіть зміну тестової задачі. Перед перенесенням на робочий Redmine перевірте SSO та спільні запити через Query Share, якщо вони використовуються.
- **`custom` / `preview/status-palette`.** Увімкніть **Color by Status**, змініть колір, оновіть сторінку та перевірте **Export PNG** і **Export full PNG**. У `preview/status-palette` додатково перевірте **Status → Active work** і відкрийте збережений запит із власним фільтром статусів.
- **`feature/release-milestones-019`.** Увімкніть **Show version headers** і відкрийте версію з датою релізу. Згорніть задачі та відкрийте версію за маркером. Змініть дату версії в Redmine й оновіть діаграму. Маркер має переміститися, а діапазон дат задач має лишитися тим самим.

<a id="demo"></a><a id="usage"></a><a id="work-timer"></a><a id="workload-display-settings-and-export"></a><a id="shared-views-filters-and-query-parameters"></a>
<a id="configuration"></a><a id="data-payload-safety-limits"></a><a id="business-calendars"></a><a id="detailed-calendars-with-yaml"></a><a id="one-global-holiday-list-with-csv"></a><a id="generate-yaml-holiday-files"></a><a id="reload-behavior"></a><a id="compatibility-note"></a>
<a id="docker-quick-start"></a><a id="start-the-stack"></a><a id="load-initial-data"></a><a id="stop-the-stack"></a><a id="development"></a>

[Журнал змін](CHANGELOG.md) · [Результати тестів базової збірки](TESTING.md) · [Посібник оригінального Canvas Gantt](https://tiohsa.github.io/redmine_canvas_gantt/en/) · [日本語マニュアル](https://tiohsa.github.io/redmine_canvas_gantt/ja/) · [日本語 README](README_ja.md)
