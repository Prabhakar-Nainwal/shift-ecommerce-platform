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

export const getAllOrders = () => {
    return api.get("/orders/admin");
};

export const updateOrderStatus = (id, status) => {
    return api.patch(`/orders/admin/${id}/status`, {status});
};