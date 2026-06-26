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