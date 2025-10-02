
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, getAuthToken } from '../services/api';

interface User {
    id: number;
    email: string;
}

const AuthContext = createContext({} as {
    user: User | null;
    userEmail: string | null;
    isAuthenticated: boolean;
    login: (email: string) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // Check if user is authenticated on app load
    const checkAuth = async () => {
        const token = getAuthToken();
        if (!token) {
            setUser(null);
            setIsAuthenticated(false);
            return;
        }

        try {
            const response = await authAPI.verifyToken();
            if (response.valid && response.user) {
                setUser(response.user);
                setIsAuthenticated(true);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Auth verification failed:', error);
            logout();
        }
    };

    // Check auth on component mount
    useEffect(() => {
        checkAuth();
    }, []);

    // Logs user in & saves email 
    function login(email: string) {
        // This will be called after successful API login
        setUser({ id: 0, email }); // ID will be set properly by checkAuth
        setIsAuthenticated(true);
        checkAuth(); // Get full user data
    }

    // Logs out user & removes email
    function logout() {
        authAPI.logout();
        setUser(null);
        setIsAuthenticated(false);
    }

    const value = {
        user,
        userEmail: user?.email || null,
        isAuthenticated,
        login,
        logout,
        checkAuth,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    return context;

}
