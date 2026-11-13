const protocolo = 'http://'
const baseURL = 'localhost:3000'

async function obterFilmes() {
    const filmesEndPoint = '/filmes'
    const URLCompleta = `${protocolo}${baseURL}${filmesEndPoint}`
    const filmes = (await axios.get(URLCompleta)).data
    //console.log(filmes)    
    let tabela = document.querySelector('.filmes')
    let corpoTabela = tabela.getElementsByTagName('tbody')[0]
    for (let filme of filmes) {
        let linha = corpoTabela.insertRow(0)
        let celulaTitulo = linha.insertCell(0)
        let celulaSinopse = linha.insertCell(1)
        celulaTitulo.innerHTML = filme.titulo
        celulaSinopse.innerHTML = filme.sinopse
    }
}

async function cadastrarFilme() {
    const filmesEndPoint = '/filmes'
    const URLCompleta = `${protocolo}${baseURL}${filmesEndPoint}`
    let tituloInput = document.querySelector('#tituloInput')
    let sinopseInput = document.querySelector('#sinopseInput')
    let titulo = tituloInput.value
    let sinopse = sinopseInput.value
    if (sinopse && titulo) {
        tituloInput.value = ""
        sinopseInput.value = ""
        const filmes = (await axios.post(URLCompleta, { titulo, sinopse })).data
        let tabela = document.querySelector('.filmes')
        let corpoTabela = tabela.getElementsByTagName('tbody')[0]
        corpoTabela.innerHTML = ""
        for (let filme of filmes) {
            let linha = corpoTabela.insertRow(0)
            let celulaTitulo = linha.insertCell(0)
            let celulaSinopse = linha.insertCell(1)
            celulaTitulo.innerHTML = filme.titulo
            celulaSinopse.innerHTML = filme.sinopse
        }
    }
    else {
        exibeAlerta('.alert-cadastro-filme', "Preencha todos os campos", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
}
async function cadastrarUsuario() {
    let usuarioCadastroInput = document.querySelector('#usuarioCadastroInput')
    let passwordCadastroInput = document.querySelector('#passwordCadastroInput')
    let usuarioCadastro = usuarioCadastroInput.value
    let passwordCadastro = passwordCadastroInput.value
    if (usuarioCadastro && passwordCadastro) {
        try {
            const cadastroEndpoint = '/signup'
            const URLCompleta = `${protocolo}${baseURL}${cadastroEndpoint}`
            usuarioCadastroInput.value = ""
            passwordCadastroInput.value = ""
            await axios.post(URLCompleta, { login: usuarioCadastro, password: passwordCadastro })
            exibeAlerta('.alert-modal-cadastro', "Usuário cadastrado com sucesso", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
            escondeModal('#modalCadastro', 2000)
        }
        catch (e) {
            exibeAlerta('.alert-modal-cadastro', "Falha no cadastro do usuário", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
            escondeModal('#modalCadastro', 2000)
        }
    }
    else {
        exibeAlerta('.alert-modal-cadastro', "Preencha todos os campos", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
}
function exibeAlerta(seletor, innerHTML, classesToAdd, classesToRemove, timeout) {
    let alert = document.querySelector(seletor)
    alert.innerHTML = innerHTML
    alert.classList.add(...classesToAdd)
    alert.classList.remove(...classesToRemove)
    setTimeout(() => {
        alert.classList.add('d-none')
        alert.classList.remove('show')
    }, timeout)
}
function escondeModal(seletor, timeout) {
    setTimeout(() => {
        let modal = bootstrap.Modal.getInstance(document.querySelector(seletor))
        modal.hide()
    }, timeout)
}

async function fazerLogin() {
    let usuarioLoginInput = document.querySelector('#usuarioLoginInput')
    let passwordLoginInput = document.querySelector('#passwordLoginInput')
    let usuarioLogin = usuarioLoginInput.value
    let passwordLogin = passwordLoginInput.value
    if (usuarioLogin && passwordLogin) {
        try {
            const loginEndpoint = '/login'
            const URLCompleta = `${protocolo}${baseURL}${loginEndpoint}`
            usuarioLoginInput.value = ''
            passwordLoginInput.value = ''
            const response = await axios.post(URLCompleta, { login: usuarioLogin, password: passwordLogin })
            localStorage.setItem('token', response.data.token)
            exibeAlerta('.alert-modal-login', "Login realizado com sucesso!", ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
            escondeModal('#modalLogin', 2000)
            prepararPagina()
        }
        catch (e) {
            exibeAlerta('.alert-modal-login', "Falha ao realizar login", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
        }
    }
    else {
        exibeAlerta('.alert-modal-login', "Preencha todos os campos", ['show', 'alert-danger'], ['d-none', 'alert-success'], 2000)
    }
}
function prepararPagina() {
    const token = localStorage.getItem('token')
    const loginLink = document.querySelector('#loginLink')
    const novoUsuarioLink = document.querySelector('#novoUsuarioLink')
    const cadastrarFilmeButton = document.querySelector('#cadastrarFilmeButton')

    if (token) {
        loginLink.innerHTML = "Logout"
        novoUsuarioLink.classList.add('d-none')
        cadastrarFilmeButton.disabled = false
    }
    else {
        loginLink.innerHTML = "Login"
        novoUsuarioLink.classList.remove('d-none')
        cadastrarFilmeButton.disabled = true
    }
}

function tratarLoginLogout() {
    const token = localStorage.getItem('token')
    if (token) {
        fazerLogout()
    }
    else {
        const modalLogin = bootstrap.Modal.getOrCreateInstance(
            document.querySelector('#modalLogin')
        )
        modalLogin.show()
    }
}
function fazerLogout() {
    localStorage.removeItem('token')
    prepararPagina()
    exibeAlerta('.alert-filme', 'Logout realizado com sucesso!', ['show', 'alert-success'], ['d-none', 'alert-danger'], 2000)
}