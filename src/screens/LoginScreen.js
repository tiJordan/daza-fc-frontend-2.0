import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { signIn } = useAuth();

    const handleLogin = async () => {
        const success = await signIn(username, password);
        if (success) {
            navigation.navigate('Home');
        } else {
            Alert.alert('Erro', 'Credenciais inválidas');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login DAZA FC</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome de usuário"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Button title="Entrar" onPress={handleLogin} />

            <Button
                title="Criar nova conta"
                onPress={() => navigation.navigate('Register')}
                color="gray"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        borderRadius: 5
    }
});