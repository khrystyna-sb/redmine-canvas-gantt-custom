# Canvas Gantt Custom для Redmine

У гілці за замовчуванням `custom` є збірка `0.20.0-custom.1`, перевірена на Redmine `6.1.1.stable`.

## Що додано в нашій збірці

- **Color by Status** — смуги задач забарвлюються за статусами Redmine, включно з користувацькими. Кольори можна змінити в легенді. Палітра застосовується до обох варіантів експорту PNG.
- **Workload Heatmap** — теплокарта запланованих годин за днями й виконавцями. У меню **Workload** можна задати денну місткість окремо для кожного виконавця.
- **Hide Actual** — приховує фактичні години та їхні підсумки. Заплановане навантаження залишається видимим.

## Окремі тестові гілки

- [`preview/status-palette`](https://github.com/khrystyna-sb/redmine-canvas-gantt-custom/tree/preview/status-palette) — готова палітра для статусів команди та швидкий фільтр **Active work**. Інструкція з тестування є в README цієї гілки.
- [`feature/release-milestones-019`](https://github.com/khrystyna-sb/redmine-canvas-gantt-custom/tree/feature/release-milestones-019) — збірка `0.19.1.release.1` на базі `0.19.0`. Синій ромб показує дедлайн версії Redmine, а зелена смуга — діапазон дат задач. Для встановлення використовуйте README цієї гілки.

## Встановлення гілки custom через Git

Потрібен доступ на читання приватного репозиторію. Фронтенд уже зібраний. Для цієї збірки встановлювати Node.js і запускати міграції БД не потрібно.

1. На тестовому стенді зупиніть Redmine й зробіть резервну копію БД. Якщо плагін уже встановлено, перемістіть його каталог за межі `plugins/`.
2. З кореня Redmine клонуйте гілку.

   ```sh
   git clone --branch custom --single-branch \
     https://github.com/khrystyna-sb/redmine-canvas-gantt-custom.git \
     plugins/redmine_canvas_gantt
   ```

3. Запустіть Redmine та звірте `0.20.0-custom.1` у **Administration → Plugins**. Увімкніть REST API й модуль **Canvas Gantt** у потрібному проєкті. Надайте відповідним ролям право **View Canvas Gantt** (`view_canvas_gantt`).

### Оновлення та відкат

Перед оновленням зупиніть Redmine, зробіть резервну копію БД і запишіть SHA з `git -C plugins/redmine_canvas_gantt rev-parse HEAD`. Переконайтеся, що робочий каталог чистий. На гілці `custom` виконайте `git -C plugins/redmine_canvas_gantt pull --ff-only origin custom` і запустіть Redmine.

Для відкату зупиніть Redmine, поверніть збережений каталог плагіна або виконайте `git -C plugins/redmine_canvas_gantt switch --detach ПОПЕРЕДНІЙ_SHA`, потім запустіть Redmine.

Перед оновленням робочого Redmine перевірте сумісність зі своїми версіями плагінів, зокрема вхід через SSO та спільні запити через Query Share.

[Журнал змін](CHANGELOG.md) · [Результати тестів](TESTING.md) · [Посібник з базових можливостей Canvas Gantt](https://tiohsa.github.io/redmine_canvas_gantt/en/)
