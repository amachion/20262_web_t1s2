const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")
const app = express()
app.use(express.json())
app.use(cors())

const Filme = mongoose.model ("Filme", mongoose.Schema({
    titulo: {type: String},
    sinopse: {type: String}
}))

const usuarioSchema = mongooseSchema ({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const usuario = mongoose.model("Usuario", usuarioSchema)

async function conectarMongo () {
    await mongoose.connect(`mongodb+srv://andreiamachion_db_user:mongo123@cluster0.d7majmq.mongodb.net/`)
}

// let filmes = [
//     {
//         titulo: "Matrix",
//         sinopse: "O jovem programador Thomas Anderson é atormentado por estranhos pesadelos em que está sempre conectado por cabos a um imenso sistema de computadores do futuro. À medida que o sonho se repete, ele começa a desconfiar da realidade. Thomas conhece os misteriosos Morpheus e Trinity e descobre que é vítima de um sistema inteligente e artificial chamado Matrix, que manipula a mente das pessoas e cria a ilusão de um mundo real enquanto usa os cérebros e corpos dos indivíduos para produzir energia.",
//     },
//     {
//         titulo: "Matrix Reloaded",
//         sinopse: "Após derrotar as máquinas em seu combate inicial, Neo ainda vive na Nabucodonosor ao lado de Morpheus, Trinity e Link, o novo tripulante da nave. As máquinas estão realizando uma grande ofensiva contra Zion, onde 250 mil delas escavam rumo à cidade e podem alcançá-la em poucos dias. A Nabucodonosor é convocada para retorlocalhost:nar a Zion e participar da reunião que definirá o contra-ataque para salvar a humanidade da extinção. Entretanto, um recado enviado pelo Oráculo faz com que Neo retorne à Matrix.",
//     },
//     {
//         titulo: "Vingadores: Doutor Destino",
//         sinopse: "Os Vingadores unem forças com o Quarteto Fantástico, os Thunderbolts e os outros super-heróis mais poderosos da Terra para salvar o multiverso do maligno Doutor Apocalypse.",
//     },
// ]

//get: http://localhost:3000/oi
app.get('/oi', (req, res) => {
    res.send('oi')
})

//get: http://localhost:3000/filmes
app.get('/filmes', async (req, res) => {
    const filmes = await Filme.find()
    res.json(filmes)
})

//post: http://3000/filmes
app.post('/filmes', async (req, res) => {
    const titulo = req.body.titulo
    const sinopse = req.body.sinopse
    //const filme = {titulo: titulo, sinopse: sinopse}
    const filme = new Filme({titulo: titulo, sinopse: sinopse})
    await filme.save()
    //filmes.push(filme)
    const filmes = await Filme.find()
    res.json(filmes)
})
//post: http://localhost:3000/signup
app.post('/signup', async (req, res) =>  {
    const login = req.body.login
    const password = req.body.password
    const usuario = new Usuario({
        login: login,
        password: password
    })
    const respostaMongo = await usuario.save()
    console.log(respostaMongo)
    res.end()
})

app.listen(3000, async () => {
    try {
        await conectarMongo()
        console.log("server up & running & connection ok")
    }
    catch (e) {
        console.log ("erro: ", e)
    }
})