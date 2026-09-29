<p align="center"><img src="public/Logo.svg" width="96" alt="Logo"></p>

# Лабораторна робота №8: Робота з JSON-файлами

Повноцінний веб-застосунок на **Next.js (App Router) + TypeScript** для демонстрації роботи з JSON-файлами.

## Опис проєкту

Цей проєкт створено як частину лабораторної роботи №8 "Робота з JSON-файлами". Веб-застосунок демонструє:
- REST API на Next.js Route Handlers для роботи з JSON-файлами
- Читання та запис JSON-файлів (`fs/promises`)
- Серіалізацію та десеріалізацію даних з типізацією TypeScript
- Роботу з Fetch API на клієнті та сервері
- Фільтрацію та обробку JSON-даних
- Злиття кількох JSON-файлів з видаленням дублікатів
- Інтеграцію з зовнішнім API (JSONPlaceholder)
- Інтерфейс на React з вкладками

## Структура проєкту

```
json-work/
├── app/                               # Next.js App Router
│   ├── api/
│   │   ├── users/route.ts             # GET, POST /api/users
│   │   ├── users/[id]/route.ts        # DELETE /api/users/:id
│   │   ├── products/[file]/route.ts   # GET /api/products/:file
│   │   ├── products/merge/route.ts    # POST /api/products/merge
│   │   ├── posts/route.ts             # GET /api/posts?userId=X
│   │   └── posts/saved/route.ts       # GET /api/posts/saved
│   ├── fetch-posts/                   # Клієнтська версія завдання 3 (Fetch + Blob)
│   ├── globals.css                    # Стилі (палітра з логотипу)
│   ├── icon.svg                       # Favicon (логотип)
│   ├── layout.tsx                     # Кореневий layout
│   └── page.tsx                       # Головна сторінка з вкладками
├── components/                        # React-компоненти (вкладки, таблиці, сповіщення)
├── lib/
│   ├── types.ts                       # Типи User, Product, Post, ...
│   ├── jsonStore.ts                   # readJSON / writeJSON
│   ├── logic.ts                       # Валідація, злиття, статистика, fetch постів
│   ├── api.ts                         # Хелпери відповідей API
│   └── client.ts                      # Типізований fetch для клієнта
├── scripts/                           # CLI-скрипти на TypeScript (запуск через tsx)
├── data/                              # JSON дані
├── public/Logo.svg                    # Логотип
├── next.config.ts
├── tsconfig.json
└── package.json
```

## Швидкий старт

```bash
npm install
npm run dev        # режим розробки: http://localhost:3000
```

Продакшн-збірка:

```bash
npm run build
npm start
```

Перевірка типів: `npm run lint`.

Відкрийте `http://localhost:3000` — веб-інтерфейс з трьома вкладками для кожного завдання.
Сторінка `/fetch-posts` — клієнтська версія завдання 3: пости завантажуються прямо з браузера і зберігаються як файл `user_posts.json`.

## Завдання

Всі три завдання реалізовані в єдиному веб-інтерфейсі з вкладками.

### ✅ Завдання 1: Управління списком користувачів

**REST API Endpoints:**
- `GET /api/users` - Отримати всіх користувачів
- `POST /api/users` - Додати нового користувача
- `DELETE /api/users/:id` - Видалити користувача

**Функціональність:**
- Зчитування користувачів з JSON через API
- Додавання нових користувачів через форму
- Автоматична генерація ID на сервері
- Валідація email (перевірка на @ та формат)
- Перевірка на дублікати email
- Видалення користувачів з підтвердженням
- Відображення у таблиці з можливістю оновлення
- Сповіщення про успішні/неуспішні операції

**Веб-інтерфейс:**
- Форма додавання: поля "Ім'я" та "Email"
- Таблиця користувачів з кнопками видалення
- Кнопка "Оновити" для перезавантаження даних

**Структура даних:**

```json
[
  {
    "id": 1,
    "name": "Іван Петренко",
    "email": "ivan.petrenko@example.com"
  }
]
```

**API Response приклад:**

```json
{
  "success": true,
  "users": [...],
  "total": 4
}
```

---

### ✅ Завдання 2: Злиття двох JSON-файлів

**REST API Endpoints:**
- `GET /api/products/products1` - Отримати товари з першого файлу
- `GET /api/products/products2` - Отримати товари з другого файлу
- `GET /api/products/combined` - Отримати об'єднані товари
- `POST /api/products/merge` - Об'єднати файли

**Функціональність:**
- Перегляд товарів з кожного файлу окремо
- Об'єднання масивів через Map для видалення дублікатів
- Видалення дублікатів за ID (пріоритет першому файлу)
- Сортування за ціною (від меншої до більшої)
- Збереження результату в `products_combined.json`
- Детальна статистика з 6 показниками

**Веб-інтерфейс:**
- Кнопки: "Товари 1", "Товари 2", "Об'єднати", "Результат"
- Таблиця товарів з ID, назвою та ціною
- Панель статистики (показується після злиття):
  - Всього товарів
  - Видалено дублікатів
  - Загальна вартість
  - Середня ціна
  - Мінімальна ціна
  - Максимальна ціна

**Структура даних:**

```json
[
  {
    "id": 1,
    "name": "Ноутбук ASUS",
    "price": 25000
  }
]
```

**API Response приклад:**

```json
{
  "success": true,
  "products": [...],
  "stats": {
    "total": 9,
    "duplicatesRemoved": 2,
    "totalPrice": 65900,
    "avgPrice": 7322.22,
    "minPrice": 1200,
    "maxPrice": 25000
  }
}
```

---

### ✅ Завдання 3: Завантаження даних з API

**REST API Endpoints:**
- `GET /api/posts?userId=5` - Завантажити та відфільтрувати пости з JSONPlaceholder
- `GET /api/posts/saved` - Отримати збережені пости з файлу

**Функціональність:**
- Завантаження даних з JSONPlaceholder API через Fetch API
- Фільтрація постів за userId (1-10)
- Автоматичне збереження в `user_posts.json`
- Відображення статистики (кількість постів, userId)
- Можливість перегляду раніше збережених постів
- Відображення індикатора завантаження

**Веб-інтерфейс:**
- Форма з полем "User ID" (1-10)
- Кнопка "Завантажити з API"
- Кнопка "Показати збережені"
- Панель статистики
- Список постів з карткам (заголовок, мета-дані, текст)

**Структура даних:**

```json
[
  {
    "userId": 5,
    "id": 41,
    "title": "non est facere",
    "body": "molestias id nostrum..."
  }
]
```

**API Response приклад:**

```json
{
  "success": true,
  "posts": [...],
  "stats": {
    "total": 10,
    "userId": 5
  }
}
```

---

## REST API

### Користувачі

| Метод | Endpoint | Опис |
|-------|----------|------|
| GET | `/api/users` | Отримати всіх користувачів |
| POST | `/api/users` | Додати користувача (body: `{name, email}`) |
| DELETE | `/api/users/:id` | Видалити користувача за ID |

### Товари

| Метод | Endpoint | Опис |
|-------|----------|------|
| GET | `/api/products/products1` | Товари з першого файлу |
| GET | `/api/products/products2` | Товари з другого файлу |
| GET | `/api/products/combined` | Об'єднані товари |
| POST | `/api/products/merge` | Об'єднати файли |

### Пости

| Метод | Endpoint | Опис |
|-------|----------|------|
| GET | `/api/posts?userId=X` | Завантажити пости користувача X |
| GET | `/api/posts/saved` | Отримати збережені пости |

---

## Теоретична частина

### JSON (JavaScript Object Notation)

**Що таке JSON?**
- Текстовий формат для структурованих даних
- Базується на синтаксисі об'єктів JavaScript
- MIME-тип: `application/json`
- Розширення файлу: `.json`

**Основні правила:**
- Ключі в подвійних лапках: `"key"`
- Рядки в подвійних лапках: `"value"`
- Числа без лапок: `42`, `3.14`
- Булеві значення: `true`, `false`
- Null: `null`
- Масиви: `[1, 2, 3]`
- Об'єкти: `{"key": "value"}`
- Немає коментарів
- Немає зайвих ком

### Методи роботи з JSON

#### JSON.parse()

Перетворення JSON-рядка в об'єкт JavaScript:

```javascript
const jsonString = '{"name":"Іван","age":25}';
const obj = JSON.parse(jsonString);
console.log(obj.name); // "Іван"
```

#### JSON.stringify()

Перетворення об'єкта JavaScript в JSON-рядок:

```javascript
const obj = { name: "Марія", age: 30 };
const json = JSON.stringify(obj);
console.log(json); // '{"name":"Марія","age":30}'

// З форматуванням
const formatted = JSON.stringify(obj, null, 2);
```

### Робота з файлами в Node.js

#### Читання JSON файлу

```javascript
const fs = require('fs');

// Синхронне читання
const data = fs.readFileSync('data.json', 'utf8');
const obj = JSON.parse(data);

// Асинхронне читання
fs.readFile('data.json', 'utf8', (err, data) => {
  if (err) throw err;
  const obj = JSON.parse(data);
});
```

#### Запис JSON файлу

```javascript
const fs = require('fs');
const obj = { name: "Тарас", age: 28 };

// Синхронний запис
fs.writeFileSync('data.json', JSON.stringify(obj, null, 2));

// Асинхронний запис
fs.writeFile('data.json', JSON.stringify(obj, null, 2), (err) => {
  if (err) throw err;
  console.log('Збережено!');
});
```

## Контрольні запитання

1. **Що таке JSON та для чого він використовується?**
   - Текстовий формат для обміну даними між клієнтом і сервером

2. **Чим відрізняється JSON від звичайних об'єктів JavaScript?**
   - JSON - текстовий формат, ключі в лапках, обмеження по типах

3. **Які методи використовуються для перетворення між об'єктами та JSON?**
   - `JSON.parse()` - з рядка в об'єкт
   - `JSON.stringify()` - з об'єкта в рядок

4. **Чому у JSON не можна використовувати функції чи undefined?**
   - JSON підтримує лише прості типи даних для сумісності з різними мовами

5. **Різниця між fs.readFile() та fs.readFileSync()?**
   - `readFile()` - асинхронний, не блокує виконання
   - `readFileSync()` - синхронний, блокує до завершення

6. **Що відбувається при зайвій комі або одинарних лапках в JSON?**
   - Помилка `SyntaxError` при парсингу

7. **Роль параметра space у JSON.stringify()?**
   - Форматування виводу з відступами для читабельності

8. **Чим небезпечне використання require() для JSON що змінюються?**
   - require() кешує результат, не бачить змін

9. **Як обробляти помилки при десеріалізації JSON?**
   - Використовувати try-catch блоки навколо JSON.parse()

10. **Переваги та недоліки зберігання даних у JSON?**
    - ✅ Простота, читабельність, підтримка мовами
    - ❌ Розмір файлів, відсутність типізації, не для складних структур

## Технології

### Backend
- **Next.js Route Handlers** — REST API
- **TypeScript** — строга типізація даних
- **fs/promises** — асинхронна робота з файлами
- **Fetch API (Node.js)** — завантаження даних з зовнішніх API

### Frontend
- **React 19** — компоненти та стан
- **Next.js App Router** — маршрутизація та layout
- **CSS** — темна тема в кольорах логотипу, адаптивність

## Особливості реалізації

- **Спільна логіка** — `lib/logic.ts` використовується і API, і CLI-скриптами, і клієнтом
- **Map для дедуплікації** — ефективне видалення дублікатів за O(n)
- **Валідація на сервері** — перевірка email та дублікатів
- **Безпечний рендеринг** — React екранує дані (без `innerHTML`)
- **Notification система** — сповіщення через React Context
- **Responsive design** — адаптивний дизайн для мобільних

## Додаткові CLI скрипти

У папці `scripts/` доступні TypeScript-скрипти для роботи з терміналом:

```bash
npm run users                                      # Показати список користувачів
npm run users -- "Петро Іванов" petro@example.com  # Додати користувача
npm run merge                                      # Злиття товарів
npm run posts                                      # Завантажити пости (userId = 5)
npm run posts -- 3                                 # Пости іншого користувача
```

## Автор

Виконано як лабораторна робота №8 з курсу ООРВЗ

## Ліцензія

MIT
