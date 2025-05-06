// public/script.js
const API_BASE_URL = 'http://localhost:3000/api'; // URL do nosso backend

document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados iniciais
    carregarAgencias();
    carregarClientes();
    carregarContas();
    carregarAgenciasParaSelect(); // Para o formulário de Contas
    carregarClientesParaSelect(); // Para o formulário de Contas

    // Formulário Agência
    const formAgencia = document.getElementById('formAgencia');
    formAgencia.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('agenciaIdEdit').value;
        const nome = document.getElementById('agenciaNome').value;
        const cidade = document.getElementById('agenciaCidade').value;
        const ativos = parseFloat(document.getElementById('agenciaAtivos').value);

        const data = { Agencia_Nome: nome, Agencia_Cidade: cidade, Ativos: ativos };

        try {
            if (id) { // Editar
                await fetch(`${API_BASE_URL}/agencias/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Agencia_Cidade: cidade, Ativos: ativos }) // Nome não pode ser alterado na edição
                });
            } else { // Criar
                await fetch(`${API_BASE_URL}/agencias`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            formAgencia.reset();
            document.getElementById('agenciaIdEdit').value = '';
            document.getElementById('agenciaNome').disabled = false;
            document.getElementById('cancelEditAgencia').style.display = 'none';
            carregarAgencias();
            carregarAgenciasParaSelect();
        } catch (error) {
            console.error('Erro ao salvar agência:', error);
            alert('Erro ao salvar agência. Verifique o console para detalhes.');
        }
    });
    document.getElementById('cancelEditAgencia').addEventListener('click', () => resetFormAgencia());


    // Formulário Cliente
    const formCliente = document.getElementById('formCliente');
    formCliente.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('clienteIdEdit').value;
        const nome = document.getElementById('clienteNome').value;
        const endereco = document.getElementById('clienteEndereco').value;
        const cidade = document.getElementById('clienteCidade').value;

        const data = { Cliente_Nome: nome, Cliente_Endereco: endereco, Cliente_Cidade: cidade };

        try {
            if (id) { // Editar
                await fetch(`${API_BASE_URL}/clientes/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Cliente_Endereco: endereco, Cliente_Cidade: cidade })
                });
            } else { // Criar
                await fetch(`${API_BASE_URL}/clientes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            formCliente.reset();
            document.getElementById('clienteIdEdit').value = '';
            document.getElementById('clienteNome').disabled = false;
            document.getElementById('cancelEditCliente').style.display = 'none';
            carregarClientes();
            carregarClientesParaSelect();
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            alert('Erro ao salvar cliente. Verifique o console para detalhes.');
        }
    });
    document.getElementById('cancelEditCliente').addEventListener('click', () => resetFormCliente());

    // Formulário Conta
    const formConta = document.getElementById('formConta');
    formConta.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('contaIdEdit').value; // Conta_Numero para edição
        const numero = document.getElementById('contaNumero').value;
        const agenciaNome = document.getElementById('contaAgenciaNome').value;
        const clienteNome = document.getElementById('contaClienteNome').value;
        const saldo = parseFloat(document.getElementById('contaSaldo').value);

        const data = {
            Conta_Numero: numero,
            Agencia_Nome: agenciaNome,
            Cliente_Nome: clienteNome,
            Saldo: saldo
        };

        try {
            if (id) { // Editar Saldo da Conta
                await fetch(`${API_BASE_URL}/contas/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Saldo: saldo }) // Apenas o saldo é editável aqui
                });
            } else { // Criar
                await fetch(`${API_BASE_URL}/contas`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            formConta.reset();
            document.getElementById('contaIdEdit').value = '';
            document.getElementById('contaNumero').disabled = false;
            document.getElementById('contaAgenciaNome').disabled = false;
            document.getElementById('contaClienteNome').disabled = false;
            document.getElementById('cancelEditConta').style.display = 'none';
            carregarContas();
        } catch (error) {
            console.error('Erro ao salvar conta:', error);
            alert('Erro ao salvar conta. Verifique o console para detalhes.');
        }
    });
    document.getElementById('cancelEditConta').addEventListener('click', () => resetFormConta());

});

// --- Funções para Agência ---
async function carregarAgencias() {
    try {
        const response = await fetch(`${API_BASE_URL}/agencias`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const agencias = await response.json();
        const tbody = document.getElementById('tabelaAgencias').querySelector('tbody');
        tbody.innerHTML = '';
        agencias.forEach(ag => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ag.Agencia_Nome}</td>
                <td>${ag.Agencia_Cidade}</td>
                <td>${ag.Ativos}</td>
                <td>
                    <button class="edit-btn" onclick="editarAgencia('${ag.Agencia_Nome}', '${ag.Agencia_Cidade}', ${ag.Ativos})">Editar</button>
                    <button class="delete-btn" onclick="deletarAgencia('${ag.Agencia_Nome}')">Deletar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar agências:', error);
        alert('Não foi possível carregar as agências.');
    }
}

function editarAgencia(nome, cidade, ativos) {
    document.getElementById('agenciaIdEdit').value = nome;
    document.getElementById('agenciaNome').value = nome;
    document.getElementById('agenciaNome').disabled = true; // Chave primária não editável
    document.getElementById('agenciaCidade').value = cidade;
    document.getElementById('agenciaAtivos').value = ativos;
    document.getElementById('cancelEditAgencia').style.display = 'inline-block';
    document.getElementById('formAgencia').scrollIntoView();
}

async function deletarAgencia(nome) {
    if (confirm(`Tem certeza que deseja deletar a agência ${nome}? Isso pode afetar contas associadas.`)) {
        try {
            await fetch(`${API_BASE_URL}/agencias/${nome}`, { method: 'DELETE' });
            carregarAgencias();
            carregarAgenciasParaSelect(); // Atualiza o select de contas
            carregarContas(); // Recarrega contas, pois podem ter sido afetadas
        } catch (error) {
            console.error('Erro ao deletar agência:', error);
            alert('Erro ao deletar agência. Verifique se há contas vinculadas.');
        }
    }
}
function resetFormAgencia() {
    document.getElementById('formAgencia').reset();
    document.getElementById('agenciaIdEdit').value = '';
    document.getElementById('agenciaNome').disabled = false;
    document.getElementById('cancelEditAgencia').style.display = 'none';
}

// --- Funções para Cliente ---
async function carregarClientes() {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const clientes = await response.json();
        const tbody = document.getElementById('tabelaClientes').querySelector('tbody');
        tbody.innerHTML = '';
        clientes.forEach(cl => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cl.Cliente_Nome}</td>
                <td>${cl.Cliente_Endereco}</td>
                <td>${cl.Cliente_Cidade}</td>
                <td>
                    <button class="edit-btn" onclick="editarCliente('${cl.Cliente_Nome}', '${cl.Cliente_Endereco}', '${cl.Cliente_Cidade}')">Editar</button>
                    <button class="delete-btn" onclick="deletarCliente('${cl.Cliente_Nome}')">Deletar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        alert('Não foi possível carregar os clientes.');
    }
}

function editarCliente(nome, endereco, cidade) {
    document.getElementById('clienteIdEdit').value = nome;
    document.getElementById('clienteNome').value = nome;
    document.getElementById('clienteNome').disabled = true;
    document.getElementById('clienteEndereco').value = endereco;
    document.getElementById('clienteCidade').value = cidade;
    document.getElementById('cancelEditCliente').style.display = 'inline-block';
    document.getElementById('formCliente').scrollIntoView();
}

async function deletarCliente(nome) {
    if (confirm(`Tem certeza que deseja deletar o cliente ${nome}? Isso pode afetar contas associadas.`)) {
        try {
            await fetch(`${API_BASE_URL}/clientes/${nome}`, { method: 'DELETE' });
            carregarClientes();
            carregarClientesParaSelect(); // Atualiza o select de contas
            carregarContas(); // Recarrega contas
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            alert('Erro ao deletar cliente. Verifique se há contas vinculadas.');
        }
    }
}

function resetFormCliente() {
    document.getElementById('formCliente').reset();
    document.getElementById('clienteIdEdit').value = '';
    document.getElementById('clienteNome').disabled = false;
    document.getElementById('cancelEditCliente').style.display = 'none';
}


// --- Funções para Conta ---
async function carregarContas() {
    try {
        const response = await fetch(`${API_BASE_URL}/contas`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const contas = await response.json();
        const tbody = document.getElementById('tabelaContas').querySelector('tbody');
        tbody.innerHTML = '';
        contas.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.Conta_Numero}</td>
                <td>${c.Agencia_Nome}</td>
                <td>${c.Cliente_Nome}</td>
                <td>${c.Saldo}</td>
                <td>
                    <button class="edit-btn" onclick="editarConta('${c.Conta_Numero}', '${c.Agencia_Nome}', '${c.Cliente_Nome}', ${c.Saldo})">Editar Saldo</button>
                    <button class="delete-btn" onclick="deletarConta('${c.Conta_Numero}')">Deletar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar contas:', error);
        alert('Não foi possível carregar as contas.');
    }
}

async function carregarAgenciasParaSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/agencias`);
        const agencias = await response.json();
        const select = document.getElementById('contaAgenciaNome');
        // Guarda a opção "Selecione" e limpa o resto
        const firstOption = select.options[0];
        select.innerHTML = '';
        select.appendChild(firstOption);

        agencias.forEach(ag => {
            const option = document.createElement('option');
            option.value = ag.Agencia_Nome;
            option.textContent = ag.Agencia_Nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar agências para select:', error);
    }
}

async function carregarClientesParaSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`);
        const clientes = await response.json();
        const select = document.getElementById('contaClienteNome');
        const firstOption = select.options[0];
        select.innerHTML = '';
        select.appendChild(firstOption);

        clientes.forEach(cl => {
            const option = document.createElement('option');
            option.value = cl.Cliente_Nome;
            option.textContent = cl.Cliente_Nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar clientes para select:', error);
    }
}

function editarConta(numero, agenciaNome, clienteNome, saldo) {
    document.getElementById('contaIdEdit').value = numero;
    document.getElementById('contaNumero').value = numero;
    document.getElementById('contaNumero').disabled = true;
    document.getElementById('contaAgenciaNome').value = agenciaNome;
    document.getElementById('contaAgenciaNome').disabled = true; // Não permitir alterar chave estrangeira na edição simples
    document.getElementById('contaClienteNome').value = clienteNome;
    document.getElementById('contaClienteNome').disabled = true; // Não permitir alterar chave estrangeira na edição simples
    document.getElementById('contaSaldo').value = saldo;
    document.getElementById('cancelEditConta').style.display = 'inline-block';
    document.getElementById('formConta').scrollIntoView();
}

async function deletarConta(numero) {
    if (confirm(`Tem certeza que deseja deletar a conta ${numero}?`)) {
        try {
            await fetch(`${API_BASE_URL}/contas/${numero}`, { method: 'DELETE' });
            carregarContas();
        } catch (error) {
            console.error('Erro ao deletar conta:', error);
            alert('Erro ao deletar conta.');
        }
    }
}

function resetFormConta() {
    document.getElementById('formConta').reset();
    document.getElementById('contaIdEdit').value = '';
    document.getElementById('contaNumero').disabled = false;
    document.getElementById('contaAgenciaNome').disabled = false;
    document.getElementById('contaClienteNome').disabled = false;
    document.getElementById('cancelEditConta').style.display = 'none';
}