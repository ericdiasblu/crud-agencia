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
        const [rows] = await pool.query('SELECT 1');
        console.log('Query de teste bem-sucedida:', rows);
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        process.exit(1);
    }
}

initializeDbPool();

// --- ROTAS PARA AGENCIA ---
app.get('/api/agencias', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM agencia'); // Retorna agencia_nome, agencia_cidade, ativos
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar agências:", error);
        res.status(500).json({ error: 'Erro ao buscar agências', details: error.message });
    }
});

app.post('/api/agencias', async (req, res) => {
    // O frontend envia: { Agencia_Nome, Agencia_Cidade, Ativos }
    const { Agencia_Nome, Agencia_Cidade, Ativos } = req.body;
    if (!Agencia_Nome || !Agencia_Cidade || Ativos === undefined) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios para agência.' });
    }
    try {
        const [result] = await pool.query(
            // Use os nomes corretos das colunas do banco (snake_case)
            'INSERT INTO agencia (agencia_nome, agencia_cidade, ativos) VALUES (?, ?, ?)',
            [Agencia_Nome, Agencia_Cidade, Ativos] // Valores podem vir como estão
        );
        // Responda com os nomes que o frontend espera ou, idealmente, com os nomes do banco
        // Se o frontend for ajustado para snake_case, esta resposta também deveria ser
        res.status(201).json({
            id: result.insertId, // id é genérico
            agencia_nome: Agencia_Nome, // Enviando snake_case
            agencia_cidade: Agencia_Cidade,
            ativos: Ativos
        });
    } catch (error) {
        console.error("Erro ao criar agência:", error);
        res.status(500).json({ error: 'Erro ao criar agência', details: error.message });
    }
});

app.put('/api/agencias/:nome', async (req, res) => {
    const { nome } = req.params; // Este 'nome' é o Agencia_Nome da URL
    const { Agencia_Cidade, Ativos } = req.body; // Frontend envia Agencia_Cidade, Ativos
    if (!Agencia_Cidade || Ativos === undefined) {
        return res.status(400).json({ error: 'Cidade e Ativos são obrigatórios para atualizar agência.' });
    }
    try {
        const [result] = await pool.query(
            // Use os nomes corretos das colunas do banco (snake_case)
            'UPDATE agencia SET agencia_cidade = ?, ativos = ? WHERE agencia_nome = ?',
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
        // Use o nome correto da coluna
        const [result] = await pool.query('DELETE FROM agencia WHERE agencia_nome = ?', [nome]);
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
        const [rows] = await pool.query('SELECT * FROM cliente'); // Retorna cliente_nome, etc.
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
            'INSERT INTO cliente (cliente_nome, cliente_endereco, cliente_cidade) VALUES (?, ?, ?)',
            [Cliente_Nome, Cliente_Endereco, Cliente_Cidade]
        );
        res.status(201).json({ // Enviar snake_case para consistência, se o frontend for ajustado
            id: result.insertId,
            cliente_nome: Cliente_Nome,
            cliente_endereco: Cliente_Endereco,
            cliente_cidade: Cliente_Cidade
        });
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
            'UPDATE cliente SET cliente_endereco = ?, cliente_cidade = ? WHERE cliente_nome = ?',
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
        const [result] = await pool.query('DELETE FROM cliente WHERE cliente_nome = ?', [nome]);
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
        // Ajuste a query para usar os nomes corretos das colunas se for necessário fazer joins explícitos
        // SELECT * FROM conta; é suficiente se os nomes das colunas já estiverem como você espera.
        const [rows] = await pool.query('SELECT conta_numero, agencia_nome, cliente_nome, saldo FROM conta');
        res.json(rows);
    } catch (error) {
        console.error("Erro ao buscar contas:", error);
        res.status(500).json({ error: 'Erro ao buscar contas', details: error.message });
    }
});

app.post('/api/contas', async (req, res) => {
    // Frontend envia: Conta_Numero, Agencia_Nome, Cliente_Nome, Saldo
    const { Conta_Numero, Agencia_Nome, Cliente_Nome, Saldo } = req.body;
    if (!Conta_Numero || !Agencia_Nome || !Cliente_Nome || Saldo === undefined) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios para conta.' });
    }
    try {
        // Verificar se Agência e Cliente existem (usando os nomes corretos das colunas)
        const [agencias] = await pool.query('SELECT 1 FROM agencia WHERE agencia_nome = ?', [Agencia_Nome]);
        if (agencias.length === 0) return res.status(400).json({ error: 'Agência não encontrada.' });

        const [clientes] = await pool.query('SELECT 1 FROM cliente WHERE cliente_nome = ?', [Cliente_Nome]);
        if (clientes.length === 0) return res.status(400).json({ error: 'Cliente não encontrado.' });

        const [result] = await pool.query(
            // Usar nomes de colunas snake_case
            'INSERT INTO conta (conta_numero, agencia_nome, cliente_nome, saldo) VALUES (?, ?, ?, ?)',
            [Conta_Numero, Agencia_Nome, Cliente_Nome, Saldo]
        );
        res.status(201).json({ // Enviar snake_case para consistência
            id: result.insertId, // Ou talvez use conta_numero como id principal
            conta_numero: Conta_Numero,
            agencia_nome: Agencia_Nome,
            cliente_nome: Cliente_Nome,
            saldo: Saldo
        });
    } catch (error) {
        console.error("Erro ao criar conta:", error);
        res.status(500).json({ error: 'Erro ao criar conta', details: error.message });
    }
});

app.put('/api/contas/:numero', async (req, res) => {
    const { numero } = req.params; // Este é o Conta_Numero
    const { Saldo } = req.body;

    if (Saldo === undefined) {
        return res.status(400).json({ error: 'Saldo é obrigatório para atualizar conta.' });
    }
    try {
        const [result] = await pool.query(
            // Usar nomes de colunas snake_case
            'UPDATE conta SET saldo = ? WHERE conta_numero = ?',
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
        // Usar nome de coluna snake_case
        const [result] = await pool.query('DELETE FROM conta WHERE conta_numero = ?', [numero]);
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