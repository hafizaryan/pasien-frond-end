<template>
  <div id="app">
    <!-- Header -->
    <header>
      <div class="navbar">
        <div class="logo">
          <h1>RS Syafira</h1>
        </div>
        <nav>
          <ul class="nav-links">
            <li><a href="#home">Beranda</a></li>
            <li><a href="#services">Layanan</a></li>
            <li><a href="#patients">Data Pasien</a></li>
            <li><a href="#register">Daftar</a></li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="home">
      <div class="container">
        <h2>Selamat Datang di RS Syafira</h2>
        <p>
          Memberikan pelayanan kesehatan terbaik dengan teknologi modern dan
          tenaga medis profesional
        </p>
        <a href="#register" class="btn">Daftar Sekarang</a>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services">
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
            <h3>Laboratorium</h3>
            <p>Pemeriksaan laboratorium lengkap</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Patient Registration Section -->
    <section id="register">
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

    <!-- Patient List Section -->
    <section id="patients">
      <div class="container">
        <div class="section-title">
          <h2>Data Pasien</h2>
        </div>
        <PatientTable
          :patients="patients"
          @edit-patient="onEditPatient"
          @patient-deleted="onPatientDeleted"
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
          <div class="footer-logo">RS Syafira</div>
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
import PatientTable from "@/components/PatientTable.vue";
import EditPatientModal from "@/components/EditPatientModal.vue";
import NotificationCenter from "@/components/NotificationCenter.vue";
import { patientService } from "@/services/apiService";

export default {
  name: "App",
  components: {
    PatientForm,
    PatientTable,
    EditPatientModal,
    NotificationCenter,
  },
  data() {
    return {
      patients: [],
      showEditModal: false,
      selectedPatient: {},
    };
  },
  mounted() {
    this.loadPatients();
    this.initSmoothScrolling();
  },
  methods: {
    async loadPatients() {
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
        this.$refs.notifications.error(
          "Terjadi kesalahan saat memuat data pasien"
        );
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
  font-size: 1.2rem;
  max-width: 800px;
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
