<template>
  <nav class="navbar">
    <!-- Brand -->
    <RouterLink to="/dashboard" class="brand">
      <svg class="brand-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M10.5 2h3v8.5H22v3h-8.5V22h-3v-8.5H2v-3h8.5z"/>
      </svg>
      <span class="brand-name">GH Comercializadora</span>
    </RouterLink>

    <!-- Navigation links -->
    <ul class="nav-links">
      <li>
        <RouterLink to="/dashboard" class="nav-link">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zM4 14h6v6H4v-6zm10 0h6v6h-6v-6z"/>
          </svg>
          Dashboard
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/proveedores" class="nav-link">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          Proveedores
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/categorias" class="nav-link">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M21.41 11.58l-9-9A2 2 0 0011 2H4a2 2 0 00-2 2v7a2 2 0 00.59 1.42l9 9A2 2 0 0013 22a2 2 0 001.41-.59l7-7A2 2 0 0022 13a2 2 0 00-.59-1.42zM5.5 7A1.5 1.5 0 114 5.5 1.5 1.5 0 015.5 7z"/>
          </svg>
          Categorías
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/productos" class="nav-link">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20 2H4a2 2 0 00-2 2v3a2 2 0 001 1.72V20a2 2 0 002 2h14a2 2 0 002-2V8.72A2 2 0 0022 7V4a2 2 0 00-2-2zm-5 12H9v-2h6v2zm3-8H6V4h12v2z"/>
          </svg>
          Productos
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/ventas" class="nav-link">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM3 2H1v2h2l3.6 8.59L5.25 15A2 2 0 007 18h12v-2H7.42a.25.25 0 01-.25-.29l.03-.12.9-1.59H19a2 2 0 001.75-1.03l3.58-6.49A1 1 0 0023.4 5H5.21L4.27 3H3z"/>
          </svg>
          Ventas
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--primary);
  padding: 0 32px;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: white;
  flex-shrink: 0;
}

.brand-icon {
  width: 26px;
  height: 26px;
  color: #4DC9BC;
  flex-shrink: 0;
}

.brand-name {
  font-size: 0.97rem;
  font-weight: 700;
  letter-spacing: 0.2px;
  color: white;
  white-space: nowrap;
}

/* Nav links */
.nav-links {
  list-style: none;
  display: flex;
  gap: 2px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 7px;
  color: rgba(255, 255, 255, 0.62);
  text-decoration: none;
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 0.855rem;
  font-weight: 500;
  transition: background var(--transition), color var(--transition);
  white-space: nowrap;
}

.nav-link svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  transition: color var(--transition);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.95);
}

.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.14);
  color: white;
  font-weight: 600;
}

.nav-link.router-link-active svg {
  color: #4DC9BC;
}
</style>
