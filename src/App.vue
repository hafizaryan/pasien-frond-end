<template>
  <div id="app">
    <!-- Header -->
    <header>
      <div class="navbar">
        <a href="/" class="klik-logo"
          ><div class="logo">
            <img src="@/assets/logo.png" alt="RS Syafira Logo" />
            <h1>RS Syafira</h1>
          </div>
        </a>
        <nav>
          <ul class="nav-links">
            <li v-if="!isAuthenticated">
              <a href="#home" @click="showMainContent">Beranda</a>
            </li>
            <li v-if="!isAuthenticated">
              <a href="#services" @click="showMainContent">Layanan</a>
            </li>
            <li v-if="!isAuthenticated">
              <a href="#register" @click="showMainContent">Daftar Berobat</a>
            </li>
            <li v-if="!isAuthenticated">
              <a href="#login" @click="showLogin">Login</a>
            </li>
            <li v-if="isAuthenticated">
              <a href="#logout" @click="handleLogout">Logout</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Dashboard Section -->
    <section v-if="showDashboard && isAuthenticated">
      <Dashboard
        :patients="patients"
        @refresh-data="loadPatients"
        @logout="handleLogout"
        @navigate-to="handleNavigation"
        @show-notification="showNotification"
        @edit-patient="onEditPatient"
        @patient-deleted="onPatientDeleted"
      />
    </section>

    <!-- Login Section -->
    <section id="login" v-if="showLoginSection && !isAuthenticated">
      <LoginForm
        @login-success="handleLoginSuccess"
        @show-notification="showNotification"
        @go-to-signup="
          showSignupSection = true;
          showLoginSection = false;
        "
      />
    </section>

    <!-- Hero Section -->
    <section
      class="hero"
      id="home"
      v-if="
        !showLoginSection &&
        !showSignupSection &&
        !showDashboard &&
        !isAuthenticated
      "
    >
      <div class="container">
        <h2>Selamat Datang di Rumah Sakit Syafira</h2>
        <p>
          Rumah Sakit Syafira Pekanbaru awalnya adalah praktik mandiri dr.
          Khairul Nasir, SpOG, yang bergabung dengan Apotek Bertuah pada 2002.
          Pada 2006, dr. Khairul mendirikan Klinik Syafira yang sederhana dengan
          fasilitas dan staf terbatas. Berkat pelayanan ramah dan keahliannya,
          klinik ini berkembang hingga pada 2009 bersama istriya Lucky Kartika
          Sari, SE ia berhasil mengembangkan klinik menjadi Rumah Sakit Bedah
          dan Kebidanan 5 lantai dengan 114 tempat tidur, UGD 24 jam, dan lebih
          dari 200 staf.
        </p>
        <p>
          Pada 2017, RS Syafira semakin maju dengan gedung 11 lantai, 184 kamar
          rawat inap, lebih dari 600 karyawan, serta fasilitas lengkap dan
          pelayanan unggul. Rumah sakit ini kini menjadi salah satu rumah sakit
          swasta terkemuka di Pekanbaru, dengan akreditasi PARIPURNA KARS.
        </p>
        <p>Melayani dengan senyum tulus</p>
        <a href="#register" class="btn">Daftar Berobat Sekarang</a>
      </div>
    </section>

    <!-- Services Section -->
    <section
      id="services"
      v-if="
        !showLoginSection &&
        !showSignupSection &&
        !showDashboard &&
        !isAuthenticated
      "
    >
      <div class="container">
        <div class="section-title">
          <h2>Layanan Kami</h2>
        </div>
        <div class="services">
          <div class="service-card">
            <i class="fas fa-user-md"></i>
            <h3>Konsultasi Dokter</h3>
            <p>Konsultasi dengan dokter spesialis berpengalaman</p>
          </div>
          <div class="service-card">
            <i class="fas fa-ambulance"></i>
            <h3>Layanan Darurat</h3>
            <p>Pelayanan gawat darurat 24 jam</p>
          </div>
          <div class="service-card">
            <i class="fas fa-microscope"></i>
            <h3>Alat Diagnostik</h3>
            <p>Alat diagnostik terlengkap</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Patient Registration Section -->
    <section
      id="register"
      v-if="
        !showLoginSection &&
        !showSignupSection &&
        !showDashboard &&
        !isAuthenticated
      "
    >
      <div class="container">
        <div class="section-title">
          <h2>Pendaftaran Pasien</h2>
        </div>
        <PatientForm
          @patient-added="onPatientAdded"
          @show-notification="showNotification"
        />
      </div>
    </section>

    <!-- Edit Modal -->
    <EditPatientModal
      :show="showEditModal"
      :patient="selectedPatient"
      @close="closeEditModal"
      @patient-updated="onPatientUpdated"
      @show-notification="showNotification"
    />

    <!-- Notification Center -->
    <NotificationCenter ref="notifications" />

    <!-- Footer -->
    <footer>
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">Rumah Sakit Syafira</div>
          <ul class="social-links">
            <li>
              <a href="#"><i class="fab fa-facebook"></i></a>
            </li>
            <li>
              <a href="#"><i class="fab fa-twitter"></i></a>
            </li>
            <li>
              <a href="#"><i class="fab fa-instagram"></i></a>
            </li>
          </ul>
          <div class="copyright">
            &copy; 2025 RS Syafira. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import PatientForm from "@/components/PatientForm.vue";
import EditPatientModal from "@/components/EditPatientModal.vue";
import NotificationCenter from "@/components/NotificationCenter.vue";
import LoginForm from "@/components/LoginForm.vue";
import Dashboard from "@/components/Dashboard.vue";
import { patientService, authService } from "@/services/apiService";

export default {
  name: "App",
  components: {
    PatientForm,
    EditPatientModal,
    NotificationCenter,
    LoginForm,
    Dashboard,
  },
  data() {
    return {
      patients: [],
      showEditModal: false,
      selectedPatient: {},
      showLoginSection: false,
      showSignupSection: false,
      isAuthenticated: false,
      currentUser: null,
      showDashboard: false,
    };
  },
  mounted() {
    // Periksa status authentication terlebih dahulu
    this.checkAuthenticationStatus();

    // Hanya load patients jika user sudah authenticated
    if (this.isAuthenticated) {
      this.loadPatients();
    }

    this.initSmoothScrolling();
  },
  methods: {
    async loadPatients() {
      // Jangan load patients jika belum authenticated
      if (!this.isAuthenticated) {
        return;
      }

      try {
        const response = await patientService.getPatients();

        if (response.success) {
          this.patients = response.data;
        } else {
          this.$refs.notifications.error(
            "Gagal memuat data pasien: " + response.message
          );
        }
      } catch (error) {
        console.error("Error:", error);

        // Jangan otomatis logout pada error
        // Hanya tampilkan pesan error jika bukan masalah auth
        if (error.response?.status !== 401) {
          this.$refs.notifications.error(
            "Terjadi kesalahan saat memuat data pasien"
          );
        }
      }
    },

    onPatientAdded() {
      this.loadPatients();
    },

    onEditPatient(patient) {
      this.selectedPatient = { ...patient };
      this.showEditModal = true;
    },

    onPatientUpdated() {
      this.loadPatients();
    },

    onPatientDeleted() {
      this.loadPatients();
    },

    closeEditModal() {
      this.showEditModal = false;
      this.selectedPatient = {};
    },

    showNotification(message, type = "info", duration = 5000) {
      this.$refs.notifications[type](message, duration);
    },

    initSmoothScrolling() {
      // Add smooth scrolling for navigation links
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute("href"));
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        });
      });
    },

    checkAuthenticationStatus() {
      console.log("Memeriksa status authentication...");

      this.isAuthenticated = authService.isAuthenticated();

      if (this.isAuthenticated) {
        this.currentUser = authService.getCurrentUser();
        this.showDashboard = true;
        this.showLoginSection = false;
        this.showSignupSection = false;

        console.log("User sudah login:", this.currentUser);
      } else {
        this.currentUser = null;
        this.showDashboard = false;

        console.log("User belum login");
      }
    },

    showLogin() {
      if (!this.isAuthenticated) {
        this.showLoginSection = true;
        this.showSignupSection = false;
        this.showDashboard = false;
      }
    },

    showMainContent() {
      if (!this.isAuthenticated) {
        this.showLoginSection = false;
        this.showSignupSection = false;
        this.showDashboard = false;
      }
    },

    handleLoginSuccess(loginData) {
      console.log("Login successful:", loginData);

      // Sesuaikan dengan struktur response API
      this.isAuthenticated = true;
      this.currentUser = loginData.data.user; // data.user bukan langsung user

      // Tampilkan dashboard
      this.showDashboard = true;
      this.showLoginSection = false;
      this.showSignupSection = false;

      // Load data patients setelah login
      this.loadPatients();

      // Tampilkan notifikasi sukses
      this.showNotification(
        `Selamat datang, ${loginData.data.user.name}!`,
        "success"
      );
    },

    async handleLogout() {
      try {
        // Panggil API logout
        await authService.logout();

        // Reset semua state authentication
        this.isAuthenticated = false;
        this.currentUser = null;
        this.showDashboard = false;
        this.showLoginSection = false;
        this.showSignupSection = false;

        // Hapus data patients
        this.patients = [];

        // Tampilkan notifikasi
        this.showNotification("Berhasil logout", "success");

        console.log("User berhasil logout");
      } catch (error) {
        console.error("Logout error:", error);

        // Tetap lakukan logout local meskipun API error
        this.isAuthenticated = false;
        this.currentUser = null;
        this.showDashboard = false;
        this.showLoginSection = false;
        this.showSignupSection = false;
        this.patients = [];

        this.showNotification("Logout berhasil (local)", "success");
      }
    },

    handleNavigation(target) {
      switch (target) {
        case "patients":
          this.showDashboard = false;
          // Navigate to patients view
          break;
        case "add-patient":
          this.showDashboard = false;
          // Navigate to add patient form
          break;
        default:
          console.log("Navigation to:", target);
      }
    },
  },
};
</script>

<style>
/* Import Google Fonts */
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

:root {
  --primary-color: #862bc6;
  --primary-light: #a45ad4;
  --primary-dark: #6a1b9a;
  --secondary-color: #f5f5f5;
  --text-color: #333;
  --white: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Poppins", sans-serif;
  color: var(--text-color);
  line-height: 1.6;
  background-color: var(--secondary-color);
}

#app {
  font-family: "Poppins", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
}

header {
  background-color: var(--white);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  width: 100%;
  z-index: 1000;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
}

.klik-logo {
  text-decoration: none;
}

.logo img {
  height: 50px;
  margin-right: 10px;
}

.logo h1 {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 700;
}

.nav-links {
  display: flex;
  list-style: none;
}

.nav-links li {
  margin-left: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--primary-color);
}

.hero {
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--primary-light)
  );
  color: var(--white);
  padding: 8rem 5% 5rem;
  text-align: center;
}

.hero h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1rem;
  max-width: 1200px;
  text-align: justify;
  margin: 0 auto 2rem;
}

.btn {
  display: inline-block;
  background-color: var(--white);
  color: var(--primary-color);
  padding: 0.8rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn:hover {
  background-color: var(--primary-dark);
  color: var(--white);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background-color: var(--primary-dark);
  color: var(--white);
}

.btn-primary:hover {
  background-color: var(--white);
  color: var(--primary-color);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 5%;
}

section {
  padding: 5rem 0;
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title h2 {
  font-size: 2rem;
  color: var(--primary-color);
  position: relative;
  display: inline-block;
  padding-bottom: 0.5rem;
}

.section-title h2::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background-color: var(--primary-color);
}

.services {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.service-card {
  background-color: var(--white);
  border-radius: 10px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.service-card:hover {
  transform: translateY(-10px);
}

.service-card i {
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.service-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.patient-form {
  background-color: var(--white);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: inherit;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

footer {
  background-color: var(--primary-color);
  color: var(--white);
  padding: 3rem 0;
  text-align: center;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-logo {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  list-style: none;
  margin-bottom: 1.5rem;
}

.social-links li {
  margin: 0 1rem;
}

.social-links a {
  color: var(--white);
  font-size: 1.5rem;
  transition: color 0.3s;
}

.social-links a:hover {
  color: var(--secondary-color);
}

.copyright {
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Modal */
.modal {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: var(--white);
  padding: 2rem;
  border-radius: 10px;
  max-width: 500px;
  width: 90%;
  position: relative;
}

.close-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }

  .logo {
    margin-bottom: 1rem;
  }

  .nav-links {
    margin-top: 1rem;
  }

  .nav-links li {
    margin: 0 0.5rem;
  }

  .hero {
    padding-top: 10rem;
  }

  .hero h2 {
    font-size: 2rem;
  }
}

/* Patient List */
.patient-list {
  background-color: var(--white);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: var(--primary-light);
  color: var(--white);
}

tr:hover {
  background-color: #f5f5f5;
}

.action-buttons button {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn {
  background-color: #ffc107;
  color: #000;
}

.delete-btn {
  background-color: #dc3545;
  color: #fff;
}

.action-buttons button:hover {
  opacity: 0.8;
}
</style>
