import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    useEffect(() => {
        const loadStorageData = async () => {
            // const token = await AsyncStorage.getItem('@token');
            await AsyncStorage.removeItem('@token');
            if (token) {
                api.defaults.headers['x-auth-token'] = token;
                setUser({ token });
            }
            setLoading(false);
        };
        loadStorageData();
    }, []);

    const signIn = async (username, password) => {
        try {
            const response = await api.post('/api/auth/login', { username, password });
            await AsyncStorage.setItem('@token', response.data.token);
            api.defaults.headers['x-auth-token'] = response.data.token;
            setUser({ token: response.data.token });
            return true;
        } catch (error) {
            console.error('Login error:', error.response?.data);
            return false;
        }
    };

    const signOut = async () => {
        await AsyncStorage.removeItem('@token');
        delete api.defaults.headers['x-auth-token'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};