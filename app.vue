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
    <NuxtPage/>
  </div>
</template>

<style>
/* Reset et styles de base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: #f9f9f9;
  color: #333;
  line-height: 1.6;
}

/* Navbar */
.navbar {
  background-color: #2A9D8F;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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


/* Styles pour les liens */
a {
  color: #2A9D8F;
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: #1e7a70;
}

</style>

