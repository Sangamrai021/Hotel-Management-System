import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const getStoredUser = () => {
        try {
            const user = localStorage.getItem("user");
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    };

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(getStoredUser());
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

    const login = (newToken, userData) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);