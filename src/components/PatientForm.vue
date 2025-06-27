<template>
  <div class="patient-form">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Nama Lengkap</label>
        <input
          type="text"
          id="name"
          v-model="form.name"
          required
          :disabled="isLoading"
        />
      </div>
      <div class="form-group">
        <label for="nik">NIK</label>
        <input
          type="text"
          id="nik"
          v-model="form.nik"
          required
          :disabled="isLoading"
          @input="filterNumeric('nik')"
        />
        <small v-if="errors.nik" class="text-danger">{{ errors.nik }}</small>
      </div>
      <div class="form-group">
        <label for="address">Alamat</label>
        <textarea
          id="address"
          v-model="form.address"
          required
          :disabled="isLoading"
        ></textarea>
      </div>
      <div class="form-group">
        <label for="phone">Nomor Telepon</label>
        <input
          type="tel"
          id="phone"
          v-model="form.phone"
          required
          :disabled="isLoading"
          @input="filterNumeric('phone')"
        />
        <small v-if="errors.phone" class="text-danger">{{
          errors.phone
        }}</small>
      </div>
      <button type="submit" class="btn btn-primary" :disabled="isLoading">
        {{ isLoading ? "Menyimpan..." : "Daftar" }}
      </button>
    </form>
  </div>
</template>

<script>
import { patientService } from "@/services/apiService";

export default {
  name: "PatientForm",
  data() {
    return {
      isLoading: false,
      form: {
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
  methods: {
    filterNumeric(field) {
      this.form[field] = this.form[field].replace(/\D/g, ""); // Hanya angka
    },

    validateForm() {
      let isValid = true;

      // Validasi NIK - harus tepat 16 digit
      if (this.form.nik.length !== 16) {
        this.errors.nik = "NIK harus terdiri dari 16 angka.";
        isValid = false;
      } else {
        this.errors.nik = "";
      }

      // Validasi Phone - minimal 11 digit dan maksimal 13 digit
      if (this.form.phone.length < 11 || this.form.phone.length > 13) {
        this.errors.phone =
          "Nomor telepon harus terdiri dari 11 hingga 13 angka.";
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
        const response = await patientService.createPatient(this.form);

        if (response.success) {
          this.$emit("patient-added", response.data);
          this.$emit(
            "show-notification",
            "Data Pasien berhasil didaftarkan!",
            "success"
          );
          this.resetForm();
        } else {
          this.handleError(response);
        }
      } catch (error) {
        console.error("Error:", error);
        this.$emit(
          "show-notification",
          "Terjadi kesalahan saat mendaftarkan pasien",
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
          "Gagal mendaftarkan pasien: " + response.message,
          "error"
        );
      }
    },

    resetForm() {
      this.form = {
        name: "",
        nik: "",
        address: "",
        phone: "",
      };
      this.errors = {
        nik: "",
        phone: "",
      };
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
