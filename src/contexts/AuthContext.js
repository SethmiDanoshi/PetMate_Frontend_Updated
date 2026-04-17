import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    //? check for token
    useEffect(()=>{
        const token = sessionStorage.getItem('token');
        if(token){
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (response, route) => {
        sessionStorage.setItem('uid', response.id);
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('fullName', response.fullName);
        sessionStorage.setItem('email', response.email);
        sessionStorage.setItem('role', response.role);
        setIsAuthenticated(true);

        setUser({
            uid : sessionStorage.getItem('uid'),
            token: sessionStorage.getItem('token'),
            fullName :sessionStorage.getItem('fullName'),
            email : sessionStorage.getItem('email'),
            role : sessionStorage.getItem('role'),
        });
        navigate(route);
    };

    const logout = () => {
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/SignIn');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
  }