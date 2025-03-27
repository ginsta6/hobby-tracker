<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const toggleNavbar = () => {
  isOpen.value = !isOpen.value
}

const closeNavbar = () => {
  isOpen.value = false
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light-green">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/" @click="closeNavbar">BimBam</router-link>
      <button
        class="navbar-toggler"
        type="button"
        @click="toggleNavbar"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: isOpen }" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/" @click="closeNavbar">Tracker</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/manage-habits" @click="closeNavbar"
              >Habit Management</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: var(--white);
  box-shadow: var(--shadow-sm);
  padding: 0.5rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.container-fluid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
}

.navbar-brand {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

.navbar-brand:hover {
  color: var(--primary-dark);
}

.navbar-collapse {
  display: flex;
  flex-basis: auto;
  align-items: center;
}

.navbar-nav {
  display: flex;
  gap: 1.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 0.25rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link:hover::after {
  width: 100%;
}

.navbar-toggler {
  display: none;
  background: none;
  border: none;
  color: var(--text-primary);
  font-size: 1.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition: color 0.3s ease;
}

.navbar-toggler:hover {
  color: var(--primary-color);
}

@media (max-width: 991px) {
  .navbar-toggler {
    display: block;
  }

  .navbar-collapse {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--white);
    padding: 1rem;
    box-shadow: var(--shadow-md);
  }

  .navbar-collapse.show {
    display: flex;
  }

  .navbar-nav {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.5rem 0;
    width: 100%;
  }
}
</style>
