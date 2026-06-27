import api from "../api/axios"

export const getProfile=()=>{
    return api.get("/users/me");
}

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