import api from "../api/axios"

export const loginUser = (formData) => {
    return api.post("/auth/login", formData )
}
export const registerUser = (formData) => {
    return api.post("/auth/register", formData)
}
export const verifyOtpUser = (otpData) => {
    return api.post("/auth/verify-otp", otpData);
}
export const logoutUser =()=>{
    return api.post("/auth/logout")
}

export const forgotPasswordRequest = (email) => {
    return api.post("/auth/forgot-password", { email });
}

export const verifyForgotPasswordOtp = (resetData) => {
    return api.post("/auth/verify-forgot-password-otp", resetData); // expects { email, otp, newPassword }
}