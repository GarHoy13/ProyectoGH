import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3001'
})

const makeService = (endpoint) => ({
  getAll: () => api.get(`/${endpoint}`),
  getById: (id) => api.get(`/${endpoint}/${id}`),
  create: (data) => api.post(`/${endpoint}`, data),
  update: (id, data) => api.put(`/${endpoint}/${id}`, data),
  remove: (id) => api.delete(`/${endpoint}/${id}`)
})

export const proveedoresService = makeService('proveedores')
export const categoriasService = makeService('categorias')
export const productosService = makeService('productos')
export const ventasService = makeService('ventas')
