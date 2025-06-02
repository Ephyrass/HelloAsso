<template>
  <div>
    <nav class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <span class="logo-text">HelloAsso Events</span>
        </div>
      </div>
    </nav>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>

<script setup>
import '~/assets/css/variables.css';
import '~/assets/css/utilities.css';
import '~/assets/css/components/event-cards.css';
import '~/assets/css/components/badges.css';

</script>

<style>
/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: var(--color-light);
  color: var(--color-text);
  line-height: 1.6;
}

/* Navbar */
.navbar {
  background-color: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-sm);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 0.5px;
}

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--color-primary-dark);
}
</style>
