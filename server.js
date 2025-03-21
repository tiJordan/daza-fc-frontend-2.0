const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Testar conexão com o banco
db.getConnection((err, connection) => {
    if (err) throw err;
    console.log('Conectado ao MySQL!');
    connection.release();
});

// Rota básica de teste
app.get('/', (req, res) => {
    res.send('API DAZA FC!');
});

// Rotas para Jogadores
app.get('/players', (req, res) => {
    db.query('SELECT * FROM players', (err, results) => {
        if (err) res.status(500).send(err);
        else res.json(results);
    });
});

// Rotas de Autenticação
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Verificar se usuário existe
        const [user] = await db.promise().query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (user.length > 0) {
            return res.status(400).json({ message: 'Usuário já existe' });
        }

        // Criptografar senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Criar novo usuário
        const [result] = await db.promise().query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Verificar usuário
        const [user] = await db.promise().query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (user.length === 0) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        // Verificar senha
        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Credenciais inválidas' });
        }

        // Gerar token JWT
        const token = jwt.sign(
            { id: user[0].id, username: user[0].username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).send(error);
    }
});




app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.DB_PORT}`);
});