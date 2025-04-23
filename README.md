# 📡 event-api

This is the backend API for the Webhook Notifier project. It allows authenticated users to configure and trigger alerts via **Email (SMTP)** and **SMS (Twilio)**. Settings and credentials are securely stored in a PostgreSQL database using Sequelize ORM.

---

## 🚀 Features

- 🔒 JWT-based authentication
- 📧 Send email alerts via configurable SMTP
- 📱 Send SMS alerts via Twilio
- ⚙️ Configuration management via REST API
- 🗄 Settings stored in PostgreSQL
- 🔌 Frontend dashboard support (see UI repo)

---

## 🛠 Setup

### 1. Clone the repo

```bash
git clone https://github.com/kvanonckelen/event-api.git
cd event-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create .env file

```bash
cp .env.example .env
```

### 4. Setup database

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=database \
  -p 5432:5432 \
  postgres
```

### 5. Setup SMTP server

```bash
docker run -d \
  --name mailhog \
  -p 1025:1025 \   # SMTP
  -p 8025:8025 \   # Web UI
  mailhog/mailhog
```

- SMTP Server: localhost:1025
- Web UI: [http://localhost:8025](http://localhost:8025)

### 6. Run database migrations

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 7. Start the development server

```bash
node index.js
```

API will be available at [http://localhost:3000](http://localhost:3000).

## 📦 API Endpoints

| Method | Endpoint                | Description                          |
|--------|-------------------------|--------------------------------------|
| POST   | `/api/login`            | Log in with credentials              |
| POST   | `/api/settings`         | Save SMTP, Twilio, recipient data    |
| GET    | `/api/settings/:key`    | Load setting (e.g. `smtp`, `twilio`) |
| POST   | `/api/send-test-email`  | Send a test email using SMTP         |

> 🔐 **Note:** All endpoints (except `/api/login`) require a valid `Authorization: Bearer <token>` JWT header.

---

### 🔑 POST `/api/login`

Login and receive a JWT token.

**Request:**

```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin", "password":"admin"}'
```

**Response:**

```json
{ "token": "your.jwt.token" }
```



