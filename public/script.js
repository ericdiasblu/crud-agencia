// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados iniciais
    carregarAgencias();
    carregarClientes();
    carregarContas();
    carregarAgenciasParaSelect();
    carregarClientesParaSelect();

    // Configurar navegação por abas
    setupTabNavigation();
    
    // Configurar botões de adicionar
    setupAddButtons();
    
    // Configurar botões de fechar formulários
    setupCloseFormButtons();
    
    // Configurar campos de busca
    setupSearchFields();

    // Event listeners para os formulários
    const formAgencia = document.getElementById('formAgencia');
    formAgencia.addEventListener('submit', async (e) => {
        e.preventDefault();
        // 'agenciaIdEdit' armazena o 'agencia_nome' para edição
        const idParaEditar = document.getElementById('agenciaIdEdit').value;
        const nome = document.getElementById('agenciaNome').value;
        const cidade = document.getElementById('agenciaCidade').value;
        const ativos = parseFloat(document.getElementById('agenciaAtivos').value);

        // O backend espera PascalCase no body, conforme definido nas suas rotas POST/PUT
        const data = { Agencia_Nome: nome, Agencia_Cidade: cidade, Ativos: ativos };

        try {
            if (idParaEditar) { // Editar
                // A rota PUT usa o 'nome' (Agencia_Nome) como parâmetro
                await fetch(`${API_BASE_URL}/agencias/${encodeURIComponent(idParaEditar)}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    // Body para PUT envia apenas os campos atualizáveis
                    body: JSON.stringify({ Agencia_Cidade: cidade, Ativos: ativos })
                });
            } else { // Criar
                await fetch(`${API_BASE_URL}/agencias`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            resetFormAgencia(); // Chamada unificada para resetar
            carregarAgencias();
            carregarAgenciasParaSelect();
            hideFormContainer('formAgenciaContainer');
        } catch (error) {
            console.error('Erro ao salvar agência:', error);
            alert('Erro ao salvar agência. Verifique o console para detalhes.');
        }
    });
    document.getElementById('cancelEditAgencia').addEventListener('click', () => {
        resetFormAgencia();
        hideFormContainer('formAgenciaContainer');
    });

    const formCliente = document.getElementById('formCliente');
    formCliente.addEventListener('submit', async (e) => {
        e.preventDefault();
        const idParaEditar = document.getElementById('clienteIdEdit').value; // cliente_nome para edição
        const nome = document.getElementById('clienteNome').value;
        const endereco = document.getElementById('clienteEndereco').value;
        const cidade = document.getElementById('clienteCidade').value;

        const data = { Cliente_Nome: nome, Cliente_Endereco: endereco, Cliente_Cidade: cidade };

        try {
            if (idParaEditar) { // Editar
                await fetch(`${API_BASE_URL}/clientes/${encodeURIComponent(idParaEditar)}`, {
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
            resetFormCliente();
            carregarClientes();
            carregarClientesParaSelect();
            hideFormContainer('formClienteContainer');
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            alert('Erro ao salvar cliente. Verifique o console para detalhes.');
        }
    });
    document.getElementById('cancelEditCliente').addEventListener('click', () => {
        resetFormCliente();
        hideFormContainer('formClienteContainer');
    });

    const formConta = document.getElementById('formConta');
    formConta.addEventListener('submit', async (e) => {
        e.preventDefault();
        const idParaEditar = document.getElementById('contaIdEdit').value; // conta_numero para edição
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
            if (idParaEditar) { // Editar Saldo da Conta
                await fetch(`${API_BASE_URL}/contas/${encodeURIComponent(idParaEditar)}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Saldo: saldo })
                });
            } else { // Criar
                await fetch(`${API_BASE_URL}/contas`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            }
            resetFormConta();
            carregarContas();
            hideFormContainer('formContaContainer');
        } catch (error) {
            console.error('Erro ao salvar conta:', error);
            alert('Erro ao salvar conta. Verifique o console para detalhes.');
        }
    });
    document.getElementById('cancelEditConta').addEventListener('click', () => {
        resetFormConta();
        hideFormContainer('formContaContainer');
    });
});

// ===== Funções novas para a interface ===== //
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Desativar todos os botões e seções
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.crud-section').forEach(section => section.classList.remove('active'));
            
            // Ativar o botão e seção clicados
            button.classList.add('active');
            const targetId = button.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

function setupAddButtons() {
    document.getElementById('addAgenciaBtn').addEventListener('click', () => {
        document.getElementById('formAgenciaTitle').textContent = 'Adicionar Agência';
        resetFormAgencia();
        showFormContainer('formAgenciaContainer');
    });
    
    document.getElementById('addClienteBtn').addEventListener('click', () => {
        document.getElementById('formClienteTitle').textContent = 'Adicionar Cliente';
        resetFormCliente();
        showFormContainer('formClienteContainer');
    });
    
    document.getElementById('addContaBtn').addEventListener('click', () => {
        document.getElementById('formContaTitle').textContent = 'Adicionar Conta';
        resetFormConta();
        showFormContainer('formContaContainer');
    });
}

function setupCloseFormButtons() {
    document.querySelectorAll('.close-form-btn').forEach(button => {
        button.addEventListener('click', () => {
            const formContainer = button.closest('.form-container');
            formContainer.classList.add('hidden');
        });
    });
}

function setupSearchFields() {
    document.getElementById('searchAgencias').addEventListener('input', function() {
        filterTable('tabelaAgencias', this.value);
    });
    
    document.getElementById('searchClientes').addEventListener('input', function() {
        filterTable('tabelaClientes', this.value);
    });
    
    document.getElementById('searchContas').addEventListener('input', function() {
        filterTable('tabelaContas', this.value);
    });
}

function filterTable(tableId, query) {
    const table = document.getElementById(tableId);
    const tr = table.getElementsByTagName('tr');
    const term = query.toLowerCase();
    
    // Começar no índice 1 para pular o cabeçalho
    for (let i = 1; i < tr.length; i++) {
        let found = false;
        const cells = tr[i].getElementsByTagName('td');
        
        for (let j = 0; j < cells.length - 1; j++) { // -1 para pular a coluna de ações
            const content = cells[j].textContent.toLowerCase();
            if (content.includes(term)) {
                found = true;
                break;
            }
        }
        
        tr[i].style.display = found ? '' : 'none';
    }
}

function showFormContainer(containerId) {
    document.getElementById(containerId).classList.remove('hidden');
}

function hideFormContainer(containerId) {
    document.getElementById(containerId).classList.add('hidden');
}

// ===== Funções para Agência ===== //
async function carregarAgencias() {
    try {
        const response = await fetch(`${API_BASE_URL}/agencias`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const agencias = await response.json();
        const tbody = document.getElementById('tabelaAgencias').querySelector('tbody');
        tbody.innerHTML = ''; // Limpa a tabela antes de adicionar novas linhas
        
        if (agencias.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="4" style="text-align: center;">Nenhuma agência cadastrada</td>';
            tbody.appendChild(tr);
            return;
        }
        
        agencias.forEach(ag => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ag.agencia_nome || 'N/A'}</td>
                <td>${ag.agencia_cidade || 'N/A'}</td>
                <td>R$ ${ag.ativos !== undefined ? ag.ativos.toFixed(2) : 'N/A'}</td>
                <td>
                    <button class="action-btn edit-btn" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" title="Deletar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            // Adiciona event listeners aos botões da linha atual
            tr.querySelector('.edit-btn').addEventListener('click', () => {
                document.getElementById('formAgenciaTitle').textContent = 'Editar Agência';
                editarAgencia(ag.agencia_nome, ag.agencia_cidade, ag.ativos);
                showFormContainer('formAgenciaContainer');
            });
            tr.querySelector('.delete-btn').addEventListener('click', () => {
                deletarAgencia(ag.agencia_nome);
            });
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar agências:', error);
        alert('Não foi possível carregar as agências.');
    }
}

function editarAgencia(nome, cidade, ativos) {
    document.getElementById('agenciaIdEdit').value = nome; // Armazena o nome original (chave)
    document.getElementById('agenciaNome').value = nome;
    document.getElementById('agenciaNome').disabled = true;
    document.getElementById('agenciaCidade').value = cidade;
    document.getElementById('agenciaAtivos').value = ativos;
}

async function deletarAgencia(nome) {
    if (confirm(`Tem certeza que deseja deletar a agência ${nome}? Isso pode afetar contas associadas.`)) {
        try {
            await fetch(`${API_BASE_URL}/agencias/${encodeURIComponent(nome)}`, { method: 'DELETE' });
            carregarAgencias();
            carregarAgenciasParaSelect();
            carregarContas();
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
}

// ===== Funções para Cliente ===== //
async function carregarClientes() {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const clientes = await response.json();
        const tbody = document.getElementById('tabelaClientes').querySelector('tbody');
        tbody.innerHTML = '';
        
        if (clientes.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="4" style="text-align: center;">Nenhum cliente cadastrado</td>';
            tbody.appendChild(tr);
            return;
        }
        
        clientes.forEach(cl => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cl.cliente_nome || 'N/A'}</td>
                <td>${cl.cliente_endereco || 'N/A'}</td>
                <td>${cl.cliente_cidade || 'N/A'}</td>
                <td>
                    <button class="action-btn edit-btn" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" title="Deletar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tr.querySelector('.edit-btn').addEventListener('click', () => {
                document.getElementById('formClienteTitle').textContent = 'Editar Cliente';
                editarCliente(cl.cliente_nome, cl.cliente_endereco, cl.cliente_cidade);
                showFormContainer('formClienteContainer');
            });
            tr.querySelector('.delete-btn').addEventListener('click', () => {
                deletarCliente(cl.cliente_nome);
            });
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
}

async function deletarCliente(nome) {
    if (confirm(`Tem certeza que deseja deletar o cliente ${nome}? Isso pode afetar contas associadas.`)) {
        try {
            await fetch(`${API_BASE_URL}/clientes/${encodeURIComponent(nome)}`, { method: 'DELETE' });
            carregarClientes();
            carregarClientesParaSelect();
            carregarContas();
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
}

// ===== Funções para Conta ===== //
async function carregarContas() {
    try {
        const response = await fetch(`${API_BASE_URL}/contas`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const contas = await response.json();
        const tbody = document.getElementById('tabelaContas').querySelector('tbody');
        tbody.innerHTML = '';
        
        if (contas.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = '<td colspan="5" style="text-align: center;">Nenhuma conta cadastrada</td>';
            tbody.appendChild(tr);
            return;
        }
        
        contas.forEach(c => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${c.conta_numero || 'N/A'}</td>
                <td>${c.agencia_nome || 'N/A'}</td>
                <td>${c.cliente_nome || 'N/A'}</td>
                <td>R$ ${c.saldo !== undefined ? c.saldo.toFixed(2) : 'N/A'}</td>
                <td>
                    <button class="action-btn edit-btn" title="Editar Saldo">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" title="Deletar">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tr.querySelector('.edit-btn').addEventListener('click', () => {
                document.getElementById('formContaTitle').textContent = 'Editar Conta';
                editarConta(c.conta_numero, c.agencia_nome, c.cliente_nome, c.saldo);
                showFormContainer('formContaContainer');
            });
            tr.querySelector('.delete-btn').addEventListener('click', () => {
                deletarConta(c.conta_numero);
            });
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
        const agencias = await response.json(); // snake_case
        const select = document.getElementById('contaAgenciaNome');
        const firstOption = select.options[0];
        select.innerHTML = '';
        select.appendChild(firstOption);

        agencias.forEach(ag => {
            const option = document.createElement('option');
            option.value = ag.agencia_nome; // Use snake_case
            option.textContent = ag.agencia_nome; // Use snake_case
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao carregar agências para select:', error);
    }
}

async function carregarClientesParaSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/clientes`);
        const clientes = await response.json(); // snake_case
        const select = document.getElementById('contaClienteNome');
        const firstOption = select.options[0];
        select.innerHTML = '';
        select.appendChild(firstOption);

        clientes.forEach(cl => {
            const option = document.createElement('option');
            option.value = cl.cliente_nome; // Use snake_case
            option.textContent = cl.cliente_nome; // Use snake_case
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
    document.getElementById('contaAgenciaNome').value = agenciaNome; // Valor é agencia_nome
    document.getElementById('contaAgenciaNome').disabled = true;
    document.getElementById('contaClienteNome').value = clienteNome; // Valor é cliente_nome
    document.getElementById('contaClienteNome').disabled = true;
    document.getElementById('contaSaldo').value = saldo;
}

async function deletarConta(numero) {
    if (confirm(`Tem certeza que deseja deletar a conta ${numero}?`)) {
        try {
            await fetch(`${API_BASE_URL}/contas/${encodeURIComponent(numero)}`, { method: 'DELETE' });
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
}