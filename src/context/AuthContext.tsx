
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext({} as {
    userEmail: string | null;
    login: (email: string) => void;
    logout: () => void;
});

export function AuthProvider({ children }: { children: React.ReactNode }) {

    // Current logged in user
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // Logs user in & saves email 
    function login(email: string) {
        setUserEmail(email);
    }

    // Logs out user & removes email
    function logout() {
        setUserEmail(null);
    }

    const value = {
        userEmail,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    return context;

}
