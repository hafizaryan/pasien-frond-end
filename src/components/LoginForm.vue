<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-header">
        <div class="login-logo">
          <h1>RS Syafira</h1>
        </div>
        <h2>Masuk ke Akun Anda</h2>
        <p>Selamat datang kembali! Silakan masuk untuk melanjutkan.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <label for="email">Email atau Username</label>
          <input
            type="text"
            id="email"
            v-model="form.email"
            required
            :disabled="isLoading"
            placeholder="Masukkan email atau username"
            autocomplete="username"
          />
          <span v-if="errors.email" class="error-message">{{
            errors.email
          }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              required
              :disabled="isLoading"
              placeholder="Masukkan password"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="password-toggle"
              @click="togglePassword"
              :disabled="isLoading"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span v-if="errors.password" class="error-message">{{
            errors.password
          }}</span>
        </div>

        <button
          type="submit"
          class="btn btn-primary login-btn"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? "Sedang masuk..." : "Masuk" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { authService } from "@/services/apiService";

export default {
  name: "LoginForm",
  data() {
    return {
      isLoading: false,
      showPassword: false,
      form: {
        email: "",
        password: "",
        rememberMe: false,
      },
      errors: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.errors = { email: "", password: "" };

      // Validasi email
      if (!this.form.email.trim()) {
        this.errors.email = "Email atau username wajib diisi";
        isValid = false;
      } else if (this.form.email.includes("@")) {
        // Jika berisi @, validasi sebagai email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.form.email)) {
          this.errors.email = "Format email tidak valid";
          isValid = false;
        }
      }

      // Validasi password
      if (!this.form.password) {
        this.errors.password = "Password wajib diisi";
        isValid = false;
      } else if (this.form.password.length < 6) {
        this.errors.password = "Password minimal 6 karakter";
        isValid = false;
      }

      return isValid;
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.isLoading = true;

      try {
        const loginData = {
          email: this.form.email,
          password: this.form.password,
        };

        const response = await authService.login(loginData);

        if (response.success) {
          // Emit event untuk parent component dengan struktur response yang benar
          this.$emit("login-success", response);

          // Reset form
          this.resetForm();
        } else {
          this.$emit(
            "show-notification",
            response.message || "Login gagal",
            "error"
          );
          this.errors.password = "Email atau password salah";
        }
      } catch (error) {
        console.error("Login error:", error);

        let errorMessage = "Terjadi kesalahan saat login";

        if (error.response) {
          switch (error.response.status) {
            case 401:
              errorMessage = "Email atau password salah";
              this.errors.password = "Email atau password salah";
              break;
            case 422:
              errorMessage = "Data yang dimasukkan tidak valid";
              if (error.response.data.errors) {
                // Handle validation errors from API
                const apiErrors = error.response.data.errors;
                if (apiErrors.email) {
                  this.errors.email = apiErrors.email[0];
                }
                if (apiErrors.password) {
                  this.errors.password = apiErrors.password[0];
                }
              }
              break;
            case 429:
              errorMessage = "Terlalu banyak percobaan login. Coba lagi nanti.";
              break;
            case 500:
              errorMessage = "Server sedang bermasalah. Coba lagi nanti.";
              break;
            default:
              errorMessage = error.response.data?.message || errorMessage;
          }
        } else if (error.code === "NETWORK_ERROR") {
          errorMessage = "Tidak dapat terhubung ke server";
        }

        this.$emit("show-notification", errorMessage, "error");
      } finally {
        this.isLoading = false;
      }
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    handleForgotPassword() {
      this.$emit(
        "show-notification",
        "Fitur lupa password akan segera hadir.",
        "info"
      );
    },

    handleGoogleLogin() {
      this.$emit(
        "show-notification",
        "Login dengan Google akan segera hadir.",
        "info"
      );
    },

    goToSignup() {
      this.$emit("go-to-signup");
    },

    resetForm() {
      this.form = {
        email: "",
        password: "",
        rememberMe: false,
      };
      this.errors = { email: "", password: "" };
      this.showPassword = false;
    },
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg);
}

.login-form {
  background-color: var(--white);
  border-radius: 15px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 450px;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.login-form::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    var(--primary-color),
    var(--primary-light)
  );
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-logo h1 {
  color: var(--primary-color);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-header h2 {
  color: var(--text-color);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: #666;
  font-size: 0.95rem;
}

.form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color);
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #fafbfc;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  background-color: var(--white);
  box-shadow: 0 0 0 3px rgba(134, 43, 198, 0.1);
}

.form-group input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.7;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: var(--primary-color);
}

.password-toggle:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding-left: 1.5rem;
}

.remember-me input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  width: 0;
  height: 0;
}

.checkmark {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 18px;
  width: 18px;
  background-color: #eee;
  border-radius: 3px;
  transition: all 0.3s;
}

.remember-me input:checked ~ .checkmark {
  background-color: var(--primary-color);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 3px;
  width: 5px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.remember-me input:checked ~ .checkmark:after {
  display: block;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff40;
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #e1e5e9;
}

.divider span {
  background-color: var(--white);
  padding: 0 1rem;
  color: #666;
  font-size: 0.9rem;
}

.social-login {
  margin-bottom: 1.5rem;
}

.btn-social {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  background-color: var(--white);
  color: var(--text-color);
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-social:hover {
  border-color: #db4437;
  background-color: #db4437;
  color: var(--white);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(219, 68, 55, 0.2);
}

.btn-social i {
  font-size: 1.1rem;
}

.signup-link {
  text-align: center;
  font-size: 0.95rem;
}

.signup-link p {
  color: #666;
  margin: 0;
}

.signup-link a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-link a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.error-message {
  color: #dc3545;
  font-size: 0.85rem;
  margin-top: 0.25rem;
  display: block;
}

/* Responsive */
@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }

  .login-form {
    padding: 2rem 1.5rem;
  }

  .login-header h2 {
    font-size: 1.3rem;
  }

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}

@media (max-width: 380px) {
  .login-form {
    padding: 1.5rem 1rem;
  }

  .login-header {
    margin-bottom: 2rem;
  }
}
</style>
