<template>
  <div v-if="show" class="modal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <span class="close-modal" @click="closeModal">&times;</span>
      <h2>Edit Data Pasien</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="editName">Nama Lengkap</label>
          <input
            type="text"
            id="editName"
            v-model="form.name"          
            required
            :disabled="isLoading"
          />
        </div>
        <div class="form-group">
          <label for="editNik">NIK</label>
          <input
            type="text"
            id="editNik"
            v-model="form.nik"
            maxlength="16"
            required
            :disabled="isLoading"
            @input="filterNumeric('nik')"
          />
          <small v-if="errors.nik" class="text-danger">{{ errors.nik }}</small>
        </div>
        <div class="form-group">
          <label for="editAddress">Alamat</label>
          <textarea
            id="editAddress"
            v-model="form.address"
            required
            :disabled="isLoading"
          ></textarea>
        </div>
        <div class="form-group">
          <label for="editPhone">Nomor Telepon</label>
          <input
            type="tel"
            id="editPhone"
            v-model="form.phone"
            minlength="11"
            maxlength="13"
            required
            :disabled="isLoading"
            @input="filterNumeric('phone')"
          />
          <small v-if="errors.phone" class="text-danger">{{
            errors.phone
          }}</small>
        </div>
        <button type="submit" class="btn btn-primary" :disabled="isLoading">
          {{ isLoading ? "Menyimpan..." : "Update" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { patientService } from "@/services/apiService";

export default {
  name: "EditPatientModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    patient: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isLoading: false,
      form: {
        id: "",
        name: "",
        nik: "",
        address: "",
        phone: "",
      },
      errors: {
        nik: "",
        phone: "",
      },
    };
  },
  watch: {
    patient: {
      handler(newPatient) {
        if (newPatient && newPatient.id) {
          this.form = { ...newPatient };
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    filterNumeric(field) {
      this.form[field] = this.form[field].replace(/\D/g, ""); // Hanya angka
    },

    validateForm() {
      let isValid = true;

      // Validasi NIK - format dasar saja (minimal 16 digit)
      if (this.form.nik.length < 16) {
        this.errors.nik = "NIK minimal 16 angka.";
        isValid = false;
      } else {
        this.errors.nik = "";
      }

      // Validasi Phone - format dasar saja (minimal 10 digit)
      if (this.form.phone.length < 10) {
        this.errors.phone = "Nomor telepon minimal 10 angka.";
        isValid = false;
      } else {
        this.errors.phone = "";
      }

      return isValid;
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.isLoading = true;

      try {
        const response = await patientService.updatePatient(
          this.form.id,
          this.form
        );

        if (response.success) {
          this.$emit("patient-updated", response.data);
          this.$emit(
            "show-notification",
            "Data pasien berhasil diperbarui!",
            "success"
          );
          this.closeModal();
        } else {
          this.handleError(response);
        }
      } catch (error) {
        console.error("Error:", error);
        this.$emit(
          "show-notification",
          "Terjadi kesalahan saat memperbarui data pasien",
          "error"
        );
      } finally {
        this.isLoading = false;
      }
    },

    handleError(response) {
      if (response.errors) {
        let errorMessages = "";
        for (const field in response.errors) {
          errorMessages += `${field}: ${response.errors[field].join(", ")}\n`;
        }
        this.$emit(
          "show-notification",
          "Validasi gagal:\n" + errorMessages,
          "error"
        );
      } else {
        this.$emit(
          "show-notification",
          "Gagal memperbarui data pasien: " + response.message,
          "error"
        );
      }
    },

    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.text-danger {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-group {
  margin-bottom: 1.5rem;
}
</style>
