import api from '../api/axios'

export const getProducts = () => {
  return api.get("/products")
}

export const getProduct = (id) => {
  return api.get(`/products/${id}`)
}

export const addProduct = (productData) => {
  return api.post('/products', productData)
}

export const updateProduct = (id, productData) => {
  return api.patch(`/products/${id}`, productData)
}

export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`)
}