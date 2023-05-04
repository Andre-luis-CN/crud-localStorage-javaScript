// Banco de Dados LocalStorage
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem('db_client', JSON.stringify(dbClient))

// Create
const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    setLocalStorage(dbClient)
}

// Read
const readClient = () => getLocalStorage()

// Update
const updateClient = (index, client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

// Delete
const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)
}

// validaçoes
const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

// Limpar campos
const clearFields = () => {
    const field = document.querySelectorAll('.modal-field')
    field.forEach(field => field.value = '')
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}


// Save new Client
const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(client)
            updateTable()
            closeModal()
        } else {
            updateClient(index, client)
            updateTable()
            closeModal()
        }
    }
}

// Criar linhas
const createRow = (client, index) => {
    const rowClient = document.createElement('tr')
    rowClient.innerHTML = `
    <td>${client.nome}</td>
    <td>${client.email}</td>
    <td>${client.celular}</td>
    <td>${client.cidade}</td>
    <td>
        <button type="button" class="button green" id="edit-${index}" >Editar</button>
        <button type="button" class="button red" id="delete-${index}" >Excluir</button>
    </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(rowClient)
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(createRow)
}

updateTable()

// Button Editar
const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = (event.target.id.split('-'))
        if (action == 'edit') {
            editClient(index)
        } else {
            const client = readClient()[index]
            const reponse = confirm(`Deseja realmento excluir o cliente : ${client.nome}`)
            if (reponse) {
                deleteClient(index)
                updateTable()
            }
        }
    }
}

// Open and Close
const openModal = () => document.getElementById('modal').classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}
// Eventos 

document.getElementById('cadastrarCliente').addEventListener('click', openModal)

document.getElementById('modalClose').addEventListener('click', closeModal)

document.getElementById('cancelar').addEventListener('click', closeModal)

document.getElementById('salvar').addEventListener('click', saveClient)

document.querySelector('#tableClient>tbody').addEventListener('click', editDelete) 