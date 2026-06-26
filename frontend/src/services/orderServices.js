import api from "../api/axios"

export const createOrder = (cartData) => {
    return api.post("/orders", cartData )
}


export const getMyOrders = () => {
    return api.get("/orders")
}


export const getOrderById = (id) => {
    return api.get(`/orders/${id}`)
}


export const cancelOrder = (id) => {
    return api.patch(`/orders/${id}/cancel`)

}

