<template>
  <div v-if="notifications.length > 0" class="notification-container">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="['notification', `notification-${notification.type}`]"
    >
      <div class="notification-content">
        <i :class="getIcon(notification.type)"></i>
        <span>{{ notification.message }}</span>
      </div>
      <button
        class="notification-close"
        @click="removeNotification(notification.id)"
      >
        &times;
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotificationCenter",
  data() {
    return {
      notifications: [],
    };
  },
  methods: {
    addNotification(message, type = "info", duration = 5000) {
      const id = Date.now() + Math.random();
      const notification = {
        id,
        message,
        type,
      };

      this.notifications.push(notification);

      if (duration > 0) {
        setTimeout(() => {
          this.removeNotification(id);
        }, duration);
      }
    },

    removeNotification(id) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    },

    getIcon(type) {
      switch (type) {
        case "success":
          return "fas fa-check-circle";
        case "error":
          return "fas fa-exclamation-circle";
        case "warning":
          return "fas fa-exclamation-triangle";
        default:
          return "fas fa-info-circle";
      }
    },

    // Public methods for external components
    success(message, duration) {
      this.addNotification(message, "success", duration);
    },

    error(message, duration) {
      this.addNotification(message, "error", duration);
    },

    warning(message, duration) {
      this.addNotification(message, "warning", duration);
    },

    info(message, duration) {
      this.addNotification(message, "info", duration);
    },
  },
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--white);
  border-left: 4px solid;
  border-radius: 5px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}

.notification-success {
  border-left-color: #28a745;
  background-color: #d4edda;
  color: #155724;
}

.notification-error {
  border-left-color: #dc3545;
  background-color: #f8d7da;
  color: #721c24;
}

.notification-warning {
  border-left-color: #ffc107;
  background-color: #fff3cd;
  color: #856404;
}

.notification-info {
  border-left-color: #17a2b8;
  background-color: #d1ecf1;
  color: #0c5460;
}

.notification-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.notification-content i {
  margin-right: 0.5rem;
  font-size: 1.1rem;
}

.notification-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  margin-left: 1rem;
}

.notification-close:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .notification-container {
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>
