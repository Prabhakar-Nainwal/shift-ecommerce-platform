import api from "../api/axios"

export const getProfile=()=>{
    return api.get("/users/me");
}
export const updateProfile = (formData) => api.patch("/user/me", formData);

export const getAddresses = () => {
    return api.get("/users/address");
};

export const updateAddresses = (addresses) => {
    return api.patch("/users/address", {
        addresses
    });
};

export const getUsers = ()=>{
    return api.get("/users")
}

export const addUser = (userData)=>{
    return api.post("/users",userData)
}
export const changePasswordRequest = (oldPassword, newPassword) => {
    return api.post("/users/change-password", { oldPassword, newPassword });
}

export const verifyChangePasswordOtp = (otp) => {
    return api.post("/users/verify-change-password-otp", { otp });
}