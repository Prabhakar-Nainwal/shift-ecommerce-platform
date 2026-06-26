import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser, } from "../services/authServices";
import { getProfile } from "../services/userServices";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await getProfile();
            setUser(response.data);

        } catch (error) {

            if (error.response?.status === 401) {
                setUser(null);
            } else {
                console.error(error);
            }

        } finally {
            setLoading(false);
        }
    };

    const login = async (formData) => {
        const response = await loginUser(formData);

        await fetchUser();

        return response;
    };

    const register = async (formData) => {
        const response = await registerUser(formData);

        await fetchUser();

        return response;
    };

    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: !!user,
                login,
                register,
                logout,
                fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}