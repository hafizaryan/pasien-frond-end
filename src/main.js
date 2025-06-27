import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles.css'
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init({
  duration: 1000, // Animation duration in milliseconds
  easing: 'ease-in-out', // Easing function for animations
  once: true, // Whether animation should happen only once
  mirror: false, // Whether elements should animate out while scrolling past them
});

createApp(App).mount('#app')
