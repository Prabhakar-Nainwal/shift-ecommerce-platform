import api from '../api/axios'

export const getProducts = (search, category, page) => {
  return api.get(`/products/shop?search=${search}&category=${category}&page=${page}&lmit=12`)
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

export const getNewProducts = () => {
  return api.get("/products/new")
}
export const getBestDeals = () => {
  return api.get("/products/best-deals")
}
export const deleteProduct = (id) => {
  return api.delete(`/products/${id}`)
}