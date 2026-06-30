import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser, verifyOtpUser, forgotPasswordRequest, verifyForgotPasswordOtp } from "../services/authServices"; // Updated imports
import { getProfile, updateProfile, changePasswordRequest, verifyChangePasswordOtp } from "../services/userServices"; // Updated imports

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
        return response;
    };

    const verifyOtp = async (otpData) => {
        const response = await verifyOtpUser(otpData);
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

    const handleForgotPassword = async (email) => {
        return await forgotPasswordRequest(email);
    };

    const handleVerifyForgotPassword = async (email, otp, newPassword) => {
        return await verifyForgotPasswordOtp({ email, otp, newPassword });
    };

    const handleChangePassword = async (oldPassword, newPassword) => {
        return await changePasswordRequest(oldPassword, newPassword);
    };

    const handleVerifyChangePassword = async (otp) => {
        return await verifyChangePasswordOtp(otp);
    };

    const updateProfileDetails = async (formData) => {
        const response = await updateProfile(formData);
        await fetchUser(); 
        return response;
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
                verifyOtp,
                logout,
                fetchUser,
                handleForgotPassword,
                handleVerifyForgotPassword,
                handleChangePassword,
                handleVerifyChangePassword,
                updateProfile: updateProfileDetails 
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}