import api from "../api/axios"

export const createPaymentSession = (orderId) => {
    return api.post("/payments/create-session", { orderId })
}

export const verifyPayment = (cfOrderId) => {
    return api.post("/payments/verify", { cfOrderId })
}
