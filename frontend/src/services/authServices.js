import api from "../api/axios"

export const loginUser = (formData) => {
    return api.post("/auth/login", formData )
}
export const registerUser = (formData) => {
    return api.post("/auth/register", formData)
}

export const logoutUser =()=>{
    return api.post("/auth/logout")
} 