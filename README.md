# Веб-приложение для учета личных финансов

Полноценный стартовый проект для веб‑приложения, анализирующего поведение пользователя, помогающего планировать бюджет и визуализирующего расходы. Архитектура включает REST API с JWT авторизацией, UI на TypeScript/React/Material-UI и диаграммы Chart.js, а также базу данных PostgreSQL.

## Архитектура и методология
- **C4/моделирование**: уровни система → контейнеры → компоненты, дополненные UML-диаграммами последовательностей (аутентификация, CRUD транзакций) и ER-диаграммой (users, categories, transactions).
- **Контейнеры**: frontend (React/Vite), backend (FastAPI/Uvicorn), PostgreSQL. Предусмотрен сервис фоновых задач для поведенческой аналитики.
- **Безопасность**: JWT токены (Bearer) с валидацией на каждом запросе, хранение секретов в `.env`, CORS для взаимодействия с фронтендом.

## Стек технологий
### Frontend
- **TypeScript** + **React** (Vite) с **Material-UI** компонентами.
- **Chart.js** через `react-chartjs-2` для дашбордов расходов и прогнозов.

### Backend
- **Python**, **FastAPI** (REST API) под управлением **Uvicorn**.
- SQLAlchemy + PostgreSQL для хранения пользователей, категорий и транзакций.

### База данных
- **PostgreSQL**: типовые таблицы users, categories, transactions. Миграции предлагается вести через Alembic.

## Быстрый старт
### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
export DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/finance
export SECRET_KEY=dev-secret
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## REST API (JWT)
- `POST /api/auth/register` — регистрация пользователя.
- `POST /api/auth/login` — получение JWT по логину/паролю (OAuth2 Password Flow).
- `GET /api/categories/` — список категорий (требует JWT).
- `POST /api/transactions/` — создание операции.
- `GET /api/transactions/` — список операций.
- `GET /api/transactions/insights/sample` — пример поведенческих инсайтов (используется на фронтенде).

## Поведенческая аналитика
- Сбор событий транзакций, расчет разбивки по категориям и прогнозы (пример в `DashboardInsight.example`).
- В продакшене инсайты могут вычисляться асинхронно (Celery/Redis) и отображаться на графиках Chart.js.

## Файловая структура
- `backend/app` — FastAPI, модели, схемы, маршруты и защита JWT.
- `frontend/src` — React + Material-UI компоненты, интеграция с REST API и Chart.js.
- `.gitignore` — артефакты окружений Node/Python.

## Дорожная карта
1. Добавить миграции Alembic и тестовые данные PostgreSQL.
2. Расширить поведенческие метрики (воронки, привычные категории) и графики Chart.js.
3. Настроить CI/CD и контейнеризацию (docker-compose для frontend, backend, PostgreSQL).
