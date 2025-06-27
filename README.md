# RS Syafira Frontend

Frontend aplikasi manajemen pasien untuk Rumah Sakit Syafira yang dibangun dengan Vue.js 3.

## 🚀 Cara Clone dan Setup Project

### Prerequisites

Pastikan Anda sudah menginstall:

- [Node.js](https://nodejs.org/) (versi 14 atau lebih baru)
- [Git](https://git-scm.com/)
- Package manager: npm (sudah termasuk dengan Node.js)

### 1. Clone Repository

```bash
# Clone repository ini
git clone https://github.com/username/rs-syafira-frontend.git

# Masuk ke direktori project
cd rs-syafira-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan Development Server

```bash
npm run serve
```

Aplikasi akan berjalan di `http://localhost:8080`

username: admin@gmail.com
password: admin123

## 📁 Struktur Project

```
rs-syafira-frontend/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Dashboard.vue
│   │   ├── EditPatientModal.vue
│   │   ├── LoadingSpinner.vue
│   │   ├── LoginForm.vue
│   │   ├── NotificationCenter.vue
│   │   ├── PatientForm.vue
│   │   ├── PatientTable.vue
│   │   └── SignupForm.vue
│   ├── services/
│   │   └── apiService.js
│   ├── App.vue
│   └── main.js
├── babel.config.js
├── jsconfig.json
├── package.json
├── README.md
└── vue.config.js
```

## 🛠️ Available Scripts

### Development

```bash
npm run serve
```

Menjalankan aplikasi dalam mode development dengan hot-reload.

### Production Build

```bash
npm run build
```

Membangun aplikasi untuk production ke folder `dist/`.

### Linting

```bash
npm run lint
```

Menjalankan ESLint untuk memeriksa dan memperbaiki kode.

## 🔧 Teknologi yang Digunakan

- **Vue.js 3** - Progressive JavaScript Framework
- **Vue Router 4** - Official router untuk Vue.js
- **Axios** - HTTP client untuk API calls
- **DataTables** - Library untuk tabel data interaktif
- **jQuery** - JavaScript library
- **ESLint** - Code linting tool

## 📱 Fitur Utama

- **Dashboard** - Overview data pasien
- **Manajemen Pasien** - CRUD operations untuk data pasien
- **Sistem Login/Register** - Autentikasi pengguna
- **Notifikasi** - Sistem notifikasi real-time
- **Responsive Design** - Tampilan responsif untuk semua perangkat

## 🌐 API Integration

Project ini menggunakan `apiService.js` untuk mengelola komunikasi dengan backend API. Pastikan backend server sudah berjalan sebelum menggunakan aplikasi.

## 📋 Environment Setup

Untuk konfigurasi environment yang berbeda, Anda dapat membuat file:

- `.env.local` - untuk development lokal
- `.env.production` - untuk production

## 🤝 Contributing

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan, silakan buat issue di repository ini.

## 📄 License

Project ini dilisensikan di bawah [MIT License](LICENSE).

---

**Developed for RS Syafira** 🏥
