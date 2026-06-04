<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar />
  <main>
    <RouterView />
  </main>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --primary:       #1B2B4B;
  --primary-light: #243558;
  --accent:        #2E7D6F;
  --accent-light:  #E6F2F0;
  --accent-hover:  #256659;
  --bg:            #F5F6FA;
  --white:         #FFFFFF;
  --text:          #1A202C;
  --text-muted:    #718096;
  --border:        #E2E8F0;
  --danger:        #C53030;
  --danger-bg:     #FFF5F5;
  --danger-light:  #FEE2E2;
  --warning:       #92400E;
  --warning-bg:    #FFFBEB;
  --radius:        8px;
  --shadow-sm:     0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md:     0 4px 12px rgba(0,0,0,0.09);
  --shadow-lg:     0 8px 30px rgba(0,0,0,0.13);
  --transition:    0.2s ease;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  font-size: 14px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

main {
  padding: 32px 28px;
  max-width: 1280px;
  margin: 0 auto;
}
</style>
