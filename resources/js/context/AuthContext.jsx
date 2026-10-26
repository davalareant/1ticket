import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('1tiket_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            api.me()
                .then((res) => {
                    setUser(res.user);
                })
                .catch(() => {
                    localStorage.removeItem('1tiket_token');
                    setToken(null);
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const res = await api.login({ email, password });
        localStorage.setItem('1tiket_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res;
    };

    const register = async (userData) => {
        const res = await api.register(userData);
        localStorage.setItem('1tiket_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res;
    };

    const logout = async () => {
        try {
            await api.logout();
        } catch (e) {
            // ignore error on logout
        } finally {
            localStorage.removeItem('1tiket_token');
            setToken(null);
            setUser(null);
        }
    };

    const loginAsDemo = async () => {
        return login('demo@1tiket.test', 'password');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                loading,
                login,
                register,
                logout,
                loginAsDemo,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
