
## Arsitektur & Tech Stack

Sistem ini terdiri dari beberapa layanan terpisah yang berjalan dalam container Docker:

### **Frontend**
* **Tech:** React.js (Vite), Tailwind CSS, Axios.
* **Port:** `5173` (Exposed).
* **Role:** Antarmuka pengguna untuk Admin dan Pembeli.

### **API Gateway**
* **Tech:** Node.js, Express, Http-Proxy-Middleware.
* **Port:** `3000`.
* **Role:** Pintu gerbang utama. Semua request dari frontend masuk ke sini sebelum diteruskan ke service terkait. Menangani otentikasi (JWT) dan routing.

### **Microservices**
1.  **Service Auth & RBAC** (`service-auth-rbac`)
    * **Port:** `3001`
    * **Fungsi:** Login, Register, Manajemen Users, Role-Based Access Control (Admin/Pembeli).
    * **DB:** MySQL (`db_bit_auth_rbac`).
2.  **Service Master Data** (`service-master`)
    * **Port:** `3002`
    * **Fungsi:** CRUD Produk (Nama Produk, Harga per Hit).
    * **DB:** MySQL (`db_master`).
3.  **Service Transaction** (`service-transaction`)
    * **Port:** `3003`
    * **Fungsi:** Keranjang, Checkout, Generate Kode Billing, History Transaksi.
    * **DB:** MySQL (`db_transaction`).

### **Infrastructure**
* **Docker & Docker Compose:** Orkestrasi container.
* **MySQL:** Database tunggal (atau terpisah) yang menampung 3 skema database berbeda.
* **Prisma ORM:** Manajemen database dan migrasi.

---

## Struktur Folder

```text
microservices/
├── api-gateway/            # Gerbang API Utama
├── frontend/               # Frontend React (Vite) + Tailwind
├── service-auth-rbac/      # Backend Auth & RBAC
├── service-master/         # Backend Master Produk / Data Master
├── service-transaction/    # Backend Transaksi
├── docker-compose.yml      # Konfigurasi Docker
└── README.md               # Dokumentasi ini


## Akun Default
Gunakan akun ini untuk login pertama kali (dari hasil seeding):

- Email: admin@test.com
- Password: 12345678
- Role: ADMIN

- Email: pembeli@test.com
- Password: 12345678
- Role: PEMBELI


# Instalasi & Cara Menjalankan (Docker)

Panduan ini menjelaskan langkah-langkah untuk menginstal dan menjalankan sistem microservices menggunakan Docker.

## Prasyarat
Pastikan aplikasi berikut sudah terinstall dan berjalan di komputer Anda:
* **Docker**
* **Docker Desktop**

---

## Langkah-langkah Instalasi

### 1. Clone Repository
Buka terminal dan jalankan perintah berikut:

```bash
git clone <repository_url>
cd microservices

### 2. Konfigurasi Environment Variables (.env)
Setiap service memiliki file .env.example. Anda perlu menyalinnya menjadi file .env

Silakan jalankan perintah berikut di terminal root project/service:

```bash
cd folder-service-project
cp .env.example .env

Catatan: File .env.example sudah dikonfigurasi dan disesuaikan dengan Docker Compose, Jika merubah konfigurasi .env maka pastikan konfigurasi pada docker compose juga sesuai.

### 3. Build & Jalankan Container

```bash
docker-compose up -d --build

# Instalasi & Cara Menjalankan (Manual / Tanpa Docker)
Jika Anda tidak menggunakan Docker, Anda dapat menjalankan setiap service secara manual. Metode ini membutuhkan **Node.js** dan **MySQL** yang sudah terinstall di komputer Anda (misal via XAMPP atau Laragon).

## Prasyarat
1.  **Node.js** (Versi 18 atau 20 ke atas).
2.  **MySQL Server** (Pastikan berjalan di port 3306).
3.  **Git**.

## Langkah-Langkah

### 1. Clone Repository
Buka terminal dan clone project ini ke komputer Anda:
```bash
git clone <repository_url>
cd microservices

### 2. NPM Install (Install Dependencies)
```bash
# 1. Install Gateway & Client
cd api-gateway && npm install && cd ..
cd client && npm install && cd ..

# 2. Install Backend Services
cd service-auth-rbac && npm install && cd ..
cd service-master && npm install && cd ..
cd service-transaction && npm install && cd ..

### 3. Konfigurasi Environment Variables (.env)
Setiap service memiliki file .env.example. Anda perlu menyalinnya menjadi file .env

Silakan jalankan perintah berikut di terminal root project/service:

```bash
cd folder-service-project
cp .env.example .env

Catatan : Sesuaikan root:password dengan MySQL lokal Anda.

### 4. Jalankan Migrasi Database (Prisma)
#### 1. Service Auth & RBAC (Migrasi + Seeding Users):

```bash
cd service-auth-rbac
npx prisma migrate deploy
npx prisma db seed
cd ..

#### 2. Service Data Master:

```bash
cd service-data-master
npx prisma migrate deploy
cd ..

#### 3. Service Transaction:

```bash
cd service-transaction
npx prisma migrate deploy
cd ..

### Jalankan Project (Run Dev)
Karena ini adalah Microservices, Anda perlu menjalankan 5 terminal secara bersamaan agar semua sistem terhubung.

```bash
cd folder-service-atau-project && npm run dev

## Happy Coding! 🚀