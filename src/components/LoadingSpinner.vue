<template>
  <div class="loading-spinner">
    <div class="spinner"></div>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: "LoadingSpinner",
  props: {
    message: {
      type: String,
      default: "Loading...",
    },
  },
};
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-spinner p {
  color: var(--primary-color);
  font-weight: 500;
}
</style>
