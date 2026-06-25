import api from '../api/axios'

export const getProducts = () => {
  return api.get("/products")
}

export const getProduct = (id) => {
  return api.get(`/product/${id}`)
}

export const addProduct = (productData) => {
  return api.post('/products', productData)
}
