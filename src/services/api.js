import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
    baseURL: 'http://192.168.0.141:3008',
    baseURL: 'http://10.0.2.2:3008', // Para Android Emulator
    timeout: 10000,
});

// Interceptor para adicionar token às requisições
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('@token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export default api;


