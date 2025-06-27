<template>
  <div class="dashboard">
    <!-- Dashboard Header -->
    <div class="dashboard-header">
      <div class="container">
        <div class="header-content">
          <div class="welcome-section">
            <h1>Dashboard Rumah Sakit Syafira</h1>
            <p>Selamat datang</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Patient Table Section -->
    <section class="patient-section">
      <div class="container">
        <div class="patient-list">
          <LoadingSpinner v-if="isLoading" message="Memuat data pasien..." />
          <table v-else id="patientsTable">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIK</th>
                <th>Alamat</th>
                <th>Telepon</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="patients.length === 0">
                <td colspan="7" style="text-align: center; padding: 2rem">
                  Belum ada data pasien
                </td>
              </tr>
              <tr
                v-for="(patient, index) in [...patients].reverse()"
                :key="patient.id"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ patient.name }}</td>
                <td>{{ patient.nik }}</td>
                <td>{{ patient.address }}</td>
                <td>{{ patient.phone }}</td>
                <td class="action-buttons">
                  <button
                    class="edit-btn"
                    @click="editPatient(patient)"
                    :disabled="isDeleting"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    class="delete-btn"
                    @click="deletePatient(patient.id)"
                    :disabled="isDeleting"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { patientService } from "@/services/apiService";

export default {
  name: "DashboardMain",
  components: {
    LoadingSpinner,
  },
  props: {
    patients: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isLoading: false,
      isDeleting: false,
      pollingInterval: null, // Tambahkan properti untuk interval polling
    };
  },
  mounted() {
    this.startPolling(); // Mulai polling saat komponen dimuat
  },
  beforeUnmount() {
    this.stopPolling(); // Hentikan polling saat komponen dihancurkan
  },
  methods: {
    startPolling() {
      this.pollingInterval = setInterval(() => {
        this.refreshData(false); // Panggil metode refreshData tanpa notifikasi
      }, 5000); // Polling setiap 5 detik
    },
    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval);
        this.pollingInterval = null;
      }
    },
    async refreshData(showNotification = true) {
      this.isLoading = true;
      try {
        this.$emit("refresh-data");
        if (showNotification) {
          this.$emit(
            "show-notification",
            "Data berhasil diperbarui",
            "success"
          );
        }
      } catch (error) {
        if (showNotification) {
          this.$emit("show-notification", "Gagal memperbarui data", "error");
        }
      } finally {
        this.isLoading = false;
      }
    },

    logout() {
      this.$emit("logout");
    },

    editPatient(patient) {
      this.$emit("edit-patient", patient);
    },

    async deletePatient(patientId) {
      if (!confirm("Apakah Anda yakin ingin menghapus data pasien ini?")) {
        return;
      }

      this.isDeleting = true;

      try {
        const response = await patientService.deletePatient(patientId);

        if (response.success) {
          this.$emit("patient-deleted", patientId);
        } else {
          this.$emit(
            "show-notification",
            "Gagal menghapus data pasien: " + response.message,
            "error"
          );
        }
      } catch (error) {
        console.error("Error:", error);
        this.$emit(
          "show-notification",
          "Terjadi kesalahan saat menghapus data pasien",
          "error"
        );
      } finally {
        this.isDeleting = false;
      }
    },
  },
};
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: var(--secondary-color);
}

.dashboard-header {
  background: linear-gradient(
    135deg,
    var(--primary-color),
    var(--primary-light)
  );
  color: var(--white);
  padding: 2rem 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.welcome-section h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.welcome-section p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.header-actions .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.patient-section {
  padding: 2rem 0;
}

.patient-list {
  background-color: var(--white);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

#patientsTable {
  width: 100%;
  border-collapse: collapse;
}

#patientsTable th {
  background-color: var(--primary-color);
  color: var(--white);
  padding: 1rem;
  text-align: left;
  font-weight: 600;
}

#patientsTable td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

#patientsTable tr:hover {
  background-color: #f8f9fa;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: #007bff;
  color: white;
}

.edit-btn:hover {
  background-color: #0056b3;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

.edit-btn:disabled,
.delete-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .action-buttons {
    flex-direction: column;
  }

  #patientsTable {
    font-size: 0.9rem;
  }

  #patientsTable th,
  #patientsTable td {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .dashboard-header {
    padding: 1.5rem 0;
  }

  .welcome-section h1 {
    font-size: 1.5rem;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .header-actions .btn {
    width: 100%;
    justify-content: center;
  }

  #patientsTable {
    font-size: 0.8rem;
  }
}
</style>
