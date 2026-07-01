import api from "../api/axios"

export const createOrder = (cartData) => {
    return api.post("/orders", cartData )
}

export const getMyOrders = (page = 1, year = '') => {
    return api.get(`/orders?page=${page}&year=${year}`)
}

export const getOrderById = (id) => {
    return api.get(`/orders/${id}`)
}

export const cancelOrder = (id) => {
    return api.patch(`/orders/${id}/cancel`)

}

export const getAllOrders = (search,page) => {
    return api.get(`/orders/admin?search=${search}&page=${page}&limit=20`);
};

export const updateOrderStatus = (id, status) => {
    return api.patch(`/orders/admin/${id}/status`, {status});
};