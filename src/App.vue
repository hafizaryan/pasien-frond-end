<template>
  <div id="app">
    <!-- Header -->
    <header>
      <div class="navbar" data-aos="fade-down">
        <a href="/" class="klik-logo"
          ><div class="logo">
            <img src="@/assets/logo.png" alt="RS Syafira Logo" />
            <h1>RS Syafira</h1>
          </div>
        </a>

        <div
          class="hamburger"
          :class="{ active: mobileMenuOpen }"
          @click="toggleMobileMenu"
          data-aos="fade-left"
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav data-aos="fade-right">
          <ul class="nav-links" :class="{ active: mobileMenuOpen }">
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
              <a href="#logout" @click="handleLogout">
                Logout <i class="fas fa-sign-out-alt"></i
              ></a>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <!-- Dashboard Section -->
    <section v-if="showDashboard && isAuthenticated" data-aos="fade-up">
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
    <section
      id="login"
      v-if="showLoginSection && !isAuthenticated"
      data-aos="fade-in"
    >
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
      data-aos="fade-up"
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
        <a href="#register" class="btn" data-aos="zoom-in"
          >Daftar Berobat Sekarang</a
        >
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
      data-aos="fade-up"
    >
      <div class="container">
        <div class="section-title">
          <h2>Layanan Kami</h2>
        </div>
        <div class="services">
          <div class="service-card" data-aos="flip-left">
            <i class="fas fa-user-md"></i>
            <h3>Konsultasi Dokter</h3>
            <p>Konsultasi dengan dokter spesialis berpengalaman</p>
          </div>
          <div class="service-card" data-aos="flip-left">
            <i class="fas fa-ambulance"></i>
            <h3>Layanan Darurat</h3>
            <p>Pelayanan gawat darurat 24 jam</p>
          </div>
          <div class="service-card" data-aos="flip-left">
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
import Swal from "sweetalert2";

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
      mobileMenuOpen: false,
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

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".navbar") && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
    });
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
        this.closeMobileMenu();
      }
    },

    showMainContent() {
      if (!this.isAuthenticated) {
        this.showLoginSection = false;
        this.showSignupSection = false;
        this.showDashboard = false;
        this.closeMobileMenu();
      }
    },

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },

    closeMobileMenu() {
      this.mobileMenuOpen = false;
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
      const result = await Swal.fire({
        title: "Konfirmasi Logout",
        text: "Apakah Anda yakin ingin keluar dari sistem?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Logout",
        cancelButtonText: "Batal",
        reverseButtons: true,
      });

      if (!result.isConfirmed) {
        return;
      }

      // Show loading message
      Swal.fire({
        title: "Logging out...",
        text: "Sedang keluar dari sistem",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
        timer: 1500,
      });

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

        // Close mobile menu
        this.closeMobileMenu();

        // Show success message after loading
        setTimeout(async () => {
          await Swal.fire({
            title: "Berhasil!",
            text: "Anda telah keluar dari sistem",
            icon: "success",
            confirmButtonColor: "#28a745",
            timer: 2000,
            showConfirmButton: false,
          });
        }, 1500);

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

        // Close mobile menu
        this.closeMobileMenu();

        // Show success message for local logout
        setTimeout(async () => {
          await Swal.fire({
            title: "Berhasil!",
            text: "Anda telah keluar dari sistem",
            icon: "success",
            confirmButtonColor: "#28a745",
            timer: 2000,
            showConfirmButton: false,
          });
        }, 1500);
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
