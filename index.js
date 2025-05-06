// index.js (Backend - Servidor Node.js)
const express = require('express');
const mysql = require('mysql2/promise'); // Usando a versão com Promises
const cors = require('cors');

const app = express();
const PORT = 3000; // Porta para o backend rodar

app.use(cors()); // Permite requisições de diferentes origens (nosso frontend)
app.use(express.json()); // Para parsear o corpo das requisições como JSON
app.use(express.static('public')); // Servir arquivos estáticos da pasta 'public'

// Configuração da conexão com o banco de dados
const dbConfig = {
    host: 'localhost', // ou o IP do seu servidor MySQL
    user: 'eric',      // seu usuário do MySQL
    password: '155', // sua senha do MySQL
    database: 'agencia'
};

let pool; // Pool de conexões

async function initializeDbPool() {
    try {
        pool = mysql.createPool(dbConfig);
        console.log('Conectado ao banco de dados MySQL!');
        // Teste de conexão opcional
        const [rows] = await pool.query('SELECT 1');
        console.log('Query de teste bem-sucedida:', rows);
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        process.exit(1); // Sai da aplicação se não conseguir conectar
    }
}

initializeDbPool();

// --- ROTAS PARA AGENCIA ---
app.get('/api/agencias', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM agencia');
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar agências:", error);
        res.status(500).json({ error: 'Erro ao buscar agências', details: error.message });
    }
});

app.post('/api/agencias', async (req, res) => {
    const { Agencia_Nome, Agencia_Cidade, Ativos } = req.body;
    if (!Agencia_Nome || !Agencia_Cidade || Ativos === undefined) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios para agência.' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO Agencia (Agencia_Nome, Agencia_Cidade, Ativos) VALUES (?, ?, ?)',
            [Agencia_Nome, Agencia_Cidade, Ativos]
        );
        res.status(201).json({ id: result.insertId, Agencia_Nome, Agencia_Cidade, Ativos });
    } catch (error) {
        console.error("Erro ao criar agência:", error);
        res.status(500).json({ error: 'Erro ao criar agência', details: error.message });
    }
});

app.put('/api/agencias/:nome', async (req, res) => {
    const { nome } = req.params;
    const { Agencia_Cidade, Ativos } = req.body;
    if (!Agencia_Cidade || Ativos === undefined) {
        return res.status(400).json({ error: 'Cidade e Ativos são obrigatórios para atualizar agência.' });
    }
    try {
        const [result] = await pool.query(
            'UPDATE Agencia SET Agencia_Cidade = ?, Ativos = ? WHERE Agencia_Nome = ?',
            [Agencia_Cidade, Ativos, nome]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Agência não encontrada.' });
        }
        res.json({ message: 'Agência atualizada com sucesso.' });
    } catch (error) {
        console.error("Erro ao atualizar agência:", error);
        res.status(500).json({ error: 'Erro ao atualizar agência', details: error.message });
    }
});

app.delete('/api/agencias/:nome', async (req, res) => {
    const { nome } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM Agencia WHERE Agencia_Nome = ?', [nome]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Agência não encontrada.' });
        }
        res.json({ message: 'Agência deletada com sucesso.' });
    } catch (error) {
        console.error("Erro ao deletar agência:", error);
        res.status(500).json({ error: 'Erro ao deletar agência', details: error.message });
    }
});


// --- ROTAS PARA CLIENTE ---
app.get('/api/clientes', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Cliente');
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        res.status(500).json({ error: 'Erro ao buscar clientes', details: error.message });
    }
});

app.post('/api/clientes', async (req, res) => {
    const { Cliente_Nome, Cliente_Endereco, Cliente_Cidade } = req.body;
    if (!Cliente_Nome || !Cliente_Endereco || !Cliente_Cidade) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios para cliente.' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO Cliente (Cliente_Nome, Cliente_Endereco, Cliente_Cidade) VALUES (?, ?, ?)',
            [Cliente_Nome, Cliente_Endereco, Cliente_Cidade]
        );
        res.status(201).json({ id: result.insertId, Cliente_Nome, Cliente_Endereco, Cliente_Cidade });
    } catch (error) {
        console.error("Erro ao criar cliente:", error);
        res.status(500).json({ error: 'Erro ao criar cliente', details: error.message });
    }
});

app.put('/api/clientes/:nome', async (req, res) => {
    const { nome } = req.params;
    const { Cliente_Endereco, Cliente_Cidade } = req.body;
     if (!Cliente_Endereco || !Cliente_Cidade) {
        return res.status(400).json({ error: 'Endereço e Cidade são obrigatórios para atualizar cliente.' });
    }
    try {
        const [result] = await pool.query(
            'UPDATE Cliente SET Cliente_Endereco = ?, Cliente_Cidade = ? WHERE Cliente_Nome = ?',
            [Cliente_Endereco, Cliente_Cidade, nome]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }
        res.json({ message: 'Cliente atualizado com sucesso.' });
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        res.status(500).json({ error: 'Erro ao atualizar cliente', details: error.message });
    }
});

app.delete('/api/clientes/:nome', async (req, res) => {
    const { nome } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM Cliente WHERE Cliente_Nome = ?', [nome]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }
        res.json({ message: 'Cliente deletado com sucesso.' });
    } catch (error) {
        console.error("Erro ao deletar cliente:", error);
        res.status(500).json({ error: 'Erro ao deletar cliente', details: error.message });
    }
});


// --- ROTAS PARA CONTA ---
app.get('/api/contas', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Conta');
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar contas:", error);
        res.status(500).json({ error: 'Erro ao buscar contas', details: error.message });
    }
});

app.post('/api/contas', async (req, res) => {
    const { Conta_Numero, Agencia_Nome, Cliente_Nome, Saldo } = req.body;
    if (!Conta_Numero || !Agencia_Nome || !Cliente_Nome || Saldo === undefined) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios para conta.' });
    }
    try {
        // Verificar se Agência e Cliente existem
        const [agencias] = await pool.query('SELECT 1 FROM Agencia WHERE Agencia_Nome = ?', [Agencia_Nome]);
        if (agencias.length === 0) return res.status(400).json({ error: 'Agência não encontrada.' });

        const [clientes] = await pool.query('SELECT 1 FROM Cliente WHERE Cliente_Nome = ?', [Cliente_Nome]);
        if (clientes.length === 0) return res.status(400).json({ error: 'Cliente não encontrado.' });

        const [result] = await pool.query(
            'INSERT INTO Conta (Conta_Numero, Agencia_Nome, Cliente_Nome, Saldo) VALUES (?, ?, ?, ?)',
            [Conta_Numero, Agencia_Nome, Cliente_Nome, Saldo]
        );
        res.status(201).json({ id: result.insertId, Conta_Numero, Agencia_Nome, Cliente_Nome, Saldo });
    } catch (error) {
        console.error("Erro ao criar conta:", error);
        res.status(500).json({ error: 'Erro ao criar conta', details: error.message });
    }
});

app.put('/api/contas/:numero', async (req, res) => {
    const { numero } = req.params;
    const { Agencia_Nome, Cliente_Nome, Saldo } = req.body; // Não permitir alterar Agência e Cliente aqui, apenas Saldo

    if (Saldo === undefined) {
        return res.status(400).json({ error: 'Saldo é obrigatório para atualizar conta.' });
    }
    // Poderia adicionar validação se Agencia_Nome e Cliente_Nome existem se fosse permitido alterá-los
    // Mas para simplificar, vamos focar em atualizar apenas o saldo
    // Se precisar alterar agência/cliente, o ideal seria deletar e recriar a conta ou ter uma lógica mais complexa.

    try {
        const [result] = await pool.query(
            'UPDATE Conta SET Saldo = ? WHERE Conta_Numero = ?',
            [Saldo, numero]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Conta não encontrada.' });
        }
        res.json({ message: 'Saldo da conta atualizado com sucesso.' });
    } catch (error) {
        console.error("Erro ao atualizar conta:", error);
        res.status(500).json({ error: 'Erro ao atualizar conta', details: error.message });
    }
});

app.delete('/api/contas/:numero', async (req, res) => {
    const { numero } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM Conta WHERE Conta_Numero = ?', [numero]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Conta não encontrada.' });
        }
        res.json({ message: 'Conta deletada com sucesso.' });
    } catch (error) {
        console.error("Erro ao deletar conta:", error);
        res.status(500).json({ error: 'Erro ao deletar conta', details: error.message });
    }
});


// Rota para servir o index.html principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
    console.log(`Frontend deve estar acessível em http://localhost:${PORT}`);
});