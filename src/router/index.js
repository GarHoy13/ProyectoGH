import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import ProveedoresView from '../views/ProveedoresView.vue'
import CategoriasView from '../views/CategoriasView.vue'
import ProductosView from '../views/ProductosView.vue'
import VentasView from '../views/VentasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: DashboardView },
    { path: '/proveedores', component: ProveedoresView },
    { path: '/categorias', component: CategoriasView },
    { path: '/productos', component: ProductosView },
    { path: '/ventas', component: VentasView }
  ]
})

export default router
