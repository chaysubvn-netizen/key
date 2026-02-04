'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

interface User {
    id: number;
    username: string;
    role: 'admin' | 'user';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<any>;
    logout: () => void;
    register: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Restore from localStorage promptly on mount
        const saved = localStorage.getItem('user');
        if (saved && saved !== 'undefined') {
            try {
                setUser(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
            }
        }

        const verifySession = async () => {
            try {
                const res = await apiRequest('get_user', {}, 'GET');
                if (res.status === 'success' && res.data.user) {
                    setUser(res.data.user);
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                } else if (res.status === 'error' && res.message.includes('not logged in')) {
                    // Only clear if the backend explicitly says the user is not logged in
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } catch (error) {
                console.error('Session verification failed:', error);
                // On network error, we keep the local state to avoid forced logout
            } finally {
                setLoading(false);
            }
        };
        verifySession();
    }, []);

    const login = async (credentials: any) => {
        const res = await apiRequest('login', credentials);
        if (res.status === 'success') {
            const userData = res.data.user;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return res;
        }
        return res;
    };

    const register = async (data: any) => {
        const res = await apiRequest('register', data);
        return res;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
