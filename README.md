# sofof‑todo

A comprehensive full-stack TODO application leveraging a Turborepo monorepo.

- **Backend API**: Built with NestJS
- **Frontend**: Built with Next.js

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Installation & Running Locally (Without Docker)](#installation--running-locally)
5. [Docker Setup (Optional)](#docker-setup-optional)
6. [Common Commands](#common-commands)
7. [API Overview](#api-overview)
8. [Troubleshooting & Tips](#troubleshooting--tips)

---

## Tech Stack

### Backend (API)

- Framework: **NestJS**
- Language: **TypeScript**

### Frontend (Web)

- Framework: **Next.js**

### Monorepo & Tooling

- Monorepo Management: **Turborepo**
- Package Manager: **npm**
- Optional Containerization: **Docker** & **Docker Compose**

---

## Project Structure

```
sofof-todo/
├── apps/
│   ├── api/   — NestJS backend
│   └── web/   — Next.js frontend
├── packages/
│   ├── @repo/eslint-config       — ESLint & Prettier
│   ├── @repo/jest-config         — Jest setup
│   └── @repo/typescript-config   — Shared TypeScript settings
├── .env.example
├── docker-compose.yml
├── turbo.json
├── package.json
└── README.md
```

---

## Prerequisites

Ensure the following are installed prior to setup:

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js)
- **Docker** & **Docker Compose** (optional for container usage)

---

## Installation & Running Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/ashrafemon/sofof-todo.git
   cd sofof-todo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` files in:
   - Root directory
   - `apps/api`
   - `apps/web`

   Make sure `DATABASE_URL` in `apps/api/.env` points to the correct Docker DB connection string.

4. **Launch database containers**

   ```bash
   docker compose up -d
   ```

5. **Ensure database user permissions**

   Use phpMyAdmin (if included) or another tool to ensure your DB user has access.

6. **Apply Prisma Schema**

   Navigate to the API folder:

   ```bash
   cd apps/api
   ```

   Then either:
   - **Option A** (Quick sync without migration history):

     ```bash
     npx prisma db push
     ```

   - **Option B** (Recommended for dev):

     ```bash
     npx prisma migrate dev --name init
     ```

   - **Option C** (Recommended for dev):

     ```bash
     npx prisma db seed
     ```

   Then go back to the root:

   ```bash
   cd ../../
   ```

7. **Start development servers**

   ```bash
   npm run dev
   ```

   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:5000](http://localhost:5000)

---

## Docker Setup (Optional)

To build and run the full stack in Docker:

```bash
docker-compose up --build
```

This will run both API and web apps as services in isolated containers.

---

## Common Commands

| Command            | Description                           |
| ------------------ | ------------------------------------- |
| `npm run dev`      | Run both frontend and API in dev mode |
| `npm run build`    | Build all apps and packages           |
| `npm run test`     | Run all Jest tests                    |
| `npm run test:e2e` | Run end-to-end tests (if configured)  |
| `npm run lint`     | Check code quality using ESLint       |
| `npm run format`   | Format code using Prettier            |

---

## API Overview

Common endpoints (subject to implementation):

- `GET /todos` — Get all tasks
- `POST /todos` — Create a new task
- `GET /todos/:id` — Get task by ID
- `PATCH /todos/:id` — Update a task
- `DELETE /todos/:id` — Delete a task

---

## Troubleshooting & Tips

- Check `.env` values if apps fail to start
- Ensure no port conflicts (API on `5000`, frontend on `3000`)
- Use `docker ps` to confirm containers are running
- If Prisma fails, make sure DB is up and `DATABASE_URL` is correct
- To reset your DB:

  ```bash
  npx prisma migrate reset
  ```

---
