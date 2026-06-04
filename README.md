# Distributed Product Management System

## Folder Structure

```
distributed-product-management/
├── apps/
│   ├── auth-service/          # .NET 10 Auth Service
│   ├── catalog-service/       # .NET 10 Catalog Service
│   ├── order-service/         # NestJS Order Service
│   └── api-gateway/           # .NET 10 YARP Gateway
├── frontend/                  # Next.js Frontend (SPA)
├── infra/
│   ├── docker-compose.yml     # Full stack orchestration
│   └── migrations/            # DB migration scripts
├── docs/
│   ├── Distributed Product Management System — Architecture & Technical Overview.PDF
│   ├── RabbitMQ_Setup_Guide_Distributed_Product_System.md
│   ├── คู่มือ Setup DB สำหรับ Order Service.txt
│   ├── SQL Insert สำหรับ-user-admin.txt
├── .gitignore
└── README.md
```

---

## Prerequisites

- Docker >= 24.0
- Docker Compose >= 2.0
- .NET SDK 10 (สำหรับ local development)
- Node.js >= 20 (สำหรับ Order Service และ Frontend)

---

## Environment Variables

### Auth Service (`apps/auth-service/appsettings.json`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=auth_db;User Id=sa;Password=YourPassword123!;TrustServerCertificate=True"
  },
  "JwtSettings": {
    "AccessSecret": "your-access-secret-key",
    "RefreshSecret": "your-refresh-secret-key",
    "AccessExpiresIn": "15m",
    "RefreshExpiresIn": "7d"
  }
}
```

### Catalog Service (`apps/catalog-service/appsettings.json`)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=catalog_db;User Id=sa;Password=YourPassword123!;TrustServerCertificate=True"
  }
}
```

### Order Service (`apps/order-service/.env`)

```env
PORT=5003
DATABASE_URL=sqlserver://localhost:1433;database=order_db;user=sa;password=YourPassword123!;trustServerCertificate=true
CATALOG_SERVICE_URL=http://localhost:5012
AUTH_SERVICE_URL=http://localhost:5294
JWT_ACCESS_SECRET=your-access-secret-key
```

### API Gateway (`apps/api-gateway/appsettings.json`)

```json
{
  "ReverseProxy": {
    "Routes": {
      "auth-route": {
        "ClusterId": "auth-cluster",
        "Match": { "Path": "/api/auth/{**catch-all}" }
      },
      "catalog-route": {
        "ClusterId": "catalog-cluster",
        "Match": { "Path": "/api/catalog/{**catch-all}" }
      },
      "order-route": {
        "ClusterId": "order-cluster",
        "Match": { "Path": "/api/orders/{**catch-all}" }
      }
    },
    "Clusters": {
      "auth-cluster":    { "Destinations": { "d1": { "Address": "http://localhost:5294/" } } },
      "catalog-cluster": { "Destinations": { "d1": { "Address": "http://localhost:5012/" } } },
      "order-cluster":   { "Destinations": { "d1": { "Address": "http://localhost:5003/" } } }
    }
  }
}
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5067
```

---

## วิธี Run ด้วย Docker Compose (แนะนำ)

```bash
# 1. Clone repository
git clone https://github.com/SirichaiP/distributed-product-management.git
cd distributed-product-management

# 2. Copy environment files (ถ้ามี .env.example)
cp apps/order-service/.env.example apps/order-service/.env

# 3. Start ทุก service
docker compose -f infra/docker-compose.yml up --build

# 4. รอให้ทุก service healthy แล้วเข้าใช้งาน
# Frontend:    http://localhost:3000
# API Gateway: http://localhost:5067
```

---

## วิธี Run Locally (Development)

### 1. Start Infrastructure (MSSQL)

```bash
docker compose -f infra/docker-compose.yml up mssql -d
```

> SQL Server จะ listen บน `localhost:1433`  
> Username: `sa` | Password: ตามที่กำหนดใน `docker-compose.yml`

### 2. Auth Service

```bash
cd apps/auth-service
dotnet restore
dotnet ef database update
dotnet run
# Running on http://localhost:5294
```

### 3. Catalog Service

```bash
cd apps/catalog-service
dotnet restore
dotnet ef database update
dotnet run
# Running on http://localhost:5012
```

### 4. Order Service

```bash
cd apps/order-service
npm install
npx prisma migrate deploy   # หรือ typeorm migration:run ตาม ORM ที่ใช้
npm run start:dev
# Running on http://localhost:5003
```

### 5. API Gateway

```bash
cd apps/api-gateway
dotnet restore
dotnet run
# Running on http://localhost:5067
```

### 6. Frontend

```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:3000
```

---

## Service URLs

| Service | URL | Swagger / Docs |
|---|---|---|
| Frontend | http://localhost:3000 | — |
| API Gateway | http://localhost:5067 | — |
| Auth Service | http://localhost:5294 | http://localhost:5294/swagger |
| Catalog Service | http://localhost:5012 | http://localhost:5012/swagger |
| Order Service | http://localhost:5003 | http://localhost:5003/api-docs |

---

## Authentication Flow

```
1. POST /api/auth/register  → สร้าง user ใหม่ (role: USER)
2. POST /api/auth/login     → รับ access_token (15m) + refresh_token (7d)
3. ใส่ Authorization: Bearer <access_token> ใน request header
4. POST /api/auth/refresh   → ต่ออายุ access_token
5. POST /api/auth/logout    → revoke refresh_token
```

---

## Role-Based Authorization

| Role | สิทธิ์ |
|---|---|
| `ADMIN` | CRUD product, category, stock adjustment, ดู orders ทั้งหมด |
| `USER` | ดู product, สั่งซื้อ, ดู order ของตัวเอง |

---

## Important API Endpoints

### Auth

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

### Catalog

```
GET    /api/catalog/products
POST   /api/catalog/products             [ADMIN]
PUT    /api/catalog/products/:id         [ADMIN]
DELETE /api/catalog/products/:id         [ADMIN]
PATCH  /api/catalog/products/:id/stock   [ADMIN]
GET    /api/catalog/categories
POST   /api/catalog/categories           [ADMIN]
PUT    /api/catalog/categories/:id       [ADMIN]
DELETE /api/catalog/categories/:id       [ADMIN]
```

### Orders

```
POST /api/orders                         [USER]
GET  /api/orders/me                      [USER]
GET  /api/orders/:id                     [USER/ADMIN]
GET  /api/orders                         [ADMIN]
```

---

## Order Flow

```
1. USER เรียก POST /api/orders พร้อม items[]
2. Order Service ตรวจสอบ stock ผ่าน Catalog Service (HTTP)
3. ถ้า stock เพียงพอ → reserve stock → สร้าง order (status: PENDING)
4. Order confirm → ตัด stock จริง → status: CONFIRMED
5. ถ้า stock ไม่พอ → return 400 Bad Request
```


## Demo User Accounts (แนบ SQL Insert ใน Folder doc)

| Email | Password | Role |
|---|---|---|
|sirichai@test01.com|P@ssw0rd123 | ADMIN |


ส่วน Rol User สามารถ Register ได้ปกติ

# Database Setup & Migration Guide

ก่อน Run ระบบแบบ Local Development ต้องเตรียมฐานข้อมูลและรัน migration ให้ครบทุก service ก่อน โดยระบบนี้ใช้ SQL Server เป็น database หลัก และแยก database ตาม service ดังนี้

| Service         | Database -| Technology 			    |
|-----------------|-----------|---------------------------------|
| Auth Service    | AuthDb    | .NET 10 + Entity Framework Core |
| Catalog Service | CatalogDb | .NET 10 + Entity Framework Core |
| Order Service   | OrderDb   | NestJS + TypeORM / Prisma       |


ต้องแน่ใจว่า SQL Server พร้อมใช้งานก่อนรัน dotnet ef database update หรือรัน NestJS


## 2. Auth Service Migration (.NET + EF Core)

เข้าไปที่โปรเจกต์ Auth Service

`powershell
cd apps/auth-service

Restore package

dotnet restore
`

ตรวจสอบ EF Core CLI
`
dotnet ef --version
`

ถ้ายังไม่มี ให้ติดตั้ง
`
dotnet tool install --global dotnet-ef
`

หรือ update เป็น version ล่าสุด
`
dotnet tool update --global dotnet-ef
`

รัน migration เพื่อสร้างหรือ update database

`

dotnet ef database update
`

จากนั้นจึง run service

`
dotnet run

Auth Service จะทำงานที่

http://localhost:5294


## 3. Catalog Service Migration (.NET + EF Core)

เข้าไปที่โปรเจกต์ Catalog Service

`powershell
cd apps/catalog-service

Restore package

dotnet restore

รัน EF Core migration

dotnet ef database update

จากนั้น run service

dotnet run

Catalog Service จะทำงานที่

http://localhost:5012

---


## 4. Order Service Database Setup Before Run NestJS

Order Service ใช้ NestJS ดังนั้นต้องเตรียม Node.js, npm package และ database ให้พร้อมก่อน

### 4.1 Install Node.js

แนะนำให้ใช้ Node.js version 20 ขึ้นไป

ตรวจสอบ version

`powershell
node --version
npm --version

ตัวอย่าง version ที่แนะนำ

node v20.x.x
npm 10.x.x

ถ้ายังไม่ได้ติดตั้ง Node.js ให้ดาวน์โหลดและติดตั้งจาก Node.js LTS version

หลังติดตั้งแล้วให้ปิดและเปิด Terminal ใหม่ จากนั้นตรวจสอบอีกครั้ง

node --version
npm --version

---

### 4.2 Install npm packages

เข้าไปที่ Order Service

`powershell
cd apps/order-service

ติดตั้ง dependencies

npm install

---

### 4.3 Create Order Database Before Running NestJS

ก่อนรัน NestJS ต้องแน่ใจว่ามี database สำหรับ Order Service แล้ว เช่น `OrderDb`

สามารถสร้าง database ด้วย SQL Server Management Studio หรือ Azure Data Studio

ตัวอย่าง SQL:

```sql
IF DB_ID('OrderDb') IS NULL
BEGIN
    CREATE DATABASE OrderDb;
END
GO

ตรวจสอบว่า database ถูกสร้างแล้ว

SELECT name 
FROM sys.databases
WHERE name = 'OrderDb';

---


### 4.4 Configure Order Service Environment

สร้างหรือแก้ไขไฟล์ `.env` ใน `apps/order-service`

```env
PORT=5003

DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourPassword123!
DB_DATABASE=OrderDb

CATALOG_SERVICE_URL=http://localhost:5012
AUTH_SERVICE_URL=http://localhost:5294
JWT_ACCESS_SECRET=your-access-secret-key

ค่า database name ต้องตรงกับ database ที่สร้างไว้ใน SQL Server


---


### 4.5 Run Order Service Migration

ถ้าโปรเจกต์ใช้ Prisma

`powershell
npx prisma migrate deploy

หรือถ้าใช้ TypeORM

npm run migration:run

ถ้าโปรเจกต์ตั้งค่า TypeORM เป็น synchronize: true ใน development database table อาจถูกสร้างอัตโนมัติได้ แต่ไม่แนะนำสำหรับ production


---


### 4.6 Run NestJS Order Service

หลังจากสร้าง database และติดตั้ง package แล้ว ให้ run service

`powershell
npm run start:dev

Order Service จะทำงานที่

http://localhost:5003

---


## 5. API Gateway

หลังจาก Auth, Catalog และ Order Service พร้อมแล้ว ให้รัน API Gateway

`powershell
cd apps/api-gateway
dotnet restore
dotnet run

API Gateway จะทำงานที่

http://localhost:5067

Frontend จะเรียก API ผ่าน Gateway เป็นหลัก


---


## 6. Frontend Setup

Frontend ใช้ Next.js ดังนั้นต้องติดตั้ง Node.js ก่อนเช่นเดียวกัน

เข้าไปที่ frontend project

`powershell
cd frontend

ติดตั้ง dependencies

npm install

สร้างหรือแก้ไขไฟล์ .env.local

NEXT_PUBLIC_API_BASE_URL=http://localhost:5067

Run frontend

npm run dev

Frontend จะทำงานที่

http://localhost:3000

---


## Recommended Local Run Order

เพื่อให้ระบบทำงานถูกต้อง แนะนำให้รันตามลำดับนี้

```text
1. Start SQL Server
2. Run Auth Service EF migration
3. Run Catalog Service EF migration
4. Create OrderDb for NestJS
5. Run Order Service migration
6. Run Auth Service
7. Run Catalog Service
8. Run Order Service
9. Run API Gateway
10. Run Frontend

ตัวอย่างคำสั่งแบบย่อ

# 1. Start SQL Server
docker compose -f infra/docker-compose.yml up mssql -d

# 2. Auth Service
cd apps/auth-service
dotnet restore
dotnet ef database update
dotnet run

# 3. Catalog Service
cd ../catalog-service
dotnet restore
dotnet ef database update
dotnet run

# 4. Order Service
cd ../order-service
npm install
npm run migration:run
npm run start:dev

# 5. API Gateway
cd ../api-gateway
dotnet restore
dotnet run

# 6. Frontend
cd ../../frontend
npm install
npm run dev

---


## Common Issues

### dotnet ef command not found

ให้ติดตั้ง EF Core CLI

`powershell
dotnet tool install --global dotnet-ef

ถ้าติดตั้งแล้วแต่ยังใช้ไม่ได้ ให้ปิด Terminal แล้วเปิดใหม่

Cannot connect to SQL Server

ตรวจสอบว่า SQL Server container ทำงานอยู่

docker ps

ตรวจสอบ port 1433

docker compose -f infra/docker-compose.yml logs mssql
NestJS run แล้วเจอ database not found

ให้สร้าง database ของ Order Service ก่อน เช่น

CREATE DATABASE OrderDb;

จากนั้นตรวจสอบค่า .env ว่า DB_DATABASE=OrderDb

npm install error

ให้ตรวจสอบ Node.js version

node --version
npm --version

แนะนำ Node.js 20 ขึ้นไป


## Port Verification Reminder

ก่อนเริ่ม Run ระบบ หรือหลังจาก Run service แล้ว ควรตรวจสอบ port อีกครั้งว่าแต่ละ service ทำงานถูก port และไม่มี port conflict

### Expected Running Ports

| Service | Port | URL |
|-------------- --------- |------:|-----------------------|
| Frontend 			  | 3000   | http://localhost:3000 |
| API Gateway		 | 5067   | http://localhost:5067 |
| Auth Service 		  | 5294   | http://localhost:5294 |
| Catalog Service	 	 | 5012   | http://localhost:5012 |
| Order Service		 | 5003   | http://localhost:5003 |
| SQL Server 	  	  | 1433   | localhost,1433 	      |
| RabbitMQ   		  | 5672   | localhost:5672    	      |
| RabbitMQ Management UI | 15672 | http://localhost:15672|

> หาก service ใดไม่สามารถ start ได้ ให้ตรวจสอบก่อนว่า port นั้นถูกใช้งานอยู่แล้วหรือไม่

## Author

**Sirichai P.**
Senior Developer Assignment Submission
   