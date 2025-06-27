<template>
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
          <td colspan="6" style="text-align: center; padding: 2rem">
            Belum ada data pasien
          </td>
        </tr>
        <tr v-for="patient in patients" :key="patient.id">
          <td>{{ patients.indexOf(patient) + 1 }}</td>
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
              <i class="fas fa-edit"></i> Edit
            </button>
            <button
              class="delete-btn"
              @click="deletePatient(patient.id)"
              :disabled="isDeleting"
            >
              <i class="fas fa-trash"></i> Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { patientService } from "@/services/apiService";

export default {
  name: "PatientTable",
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
    };
  },
  methods: {
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
          this.$emit(
            "show-notification",
            "Data pasien berhasil dihapus!",
            "success"
          );
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
