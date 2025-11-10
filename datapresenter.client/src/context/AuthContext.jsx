/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) setUser(JSON.parse(savedUser));
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { token, username, email } = response.data;
            localStorage.setItem('token', token);
            const userData = { username, email };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'B³¹d logowania' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { token, username, email } = response.data;
            localStorage.setItem('token', token);
            const user = { username, email };
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'B³¹d rejestracji' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const changePassword = async (passwords) => {
        try {
            await authAPI.changePassword(passwords);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'B³¹d zmiany has³a' };
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        changePassword,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
