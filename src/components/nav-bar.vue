<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

const toggleNavbar = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light-green">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">MyBrand</a>
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
            <router-link class="nav-link" to="/">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.bg-light-green {
  background-color: #d4edda !important; /* Light green */
}

.navbar-brand {
  font-weight: bold;
}

.nav-link {
  transition: color 0.3s;
}

.nav-link:hover {
  color: #155724; /* Darker green */
}
</style>
