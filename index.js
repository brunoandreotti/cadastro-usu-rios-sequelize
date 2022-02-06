//Para remover itens relacionados utilizaremos o mesmo processo de remoção de itens
//Criaremos um formulário que nevia o id do item
//E uma rota para receber estas informações e executar a remoção utilizando o método 'destroy'

const express = require('express')
const exphbs = require('express-handlebars')
const conn = require('./database/connection.js')

//Importa o model para poder usar os métodos dele
const User = require('./models/User')
const Address = require('./models/Address')

const app = express()

//Ler e mandar JSON na req e na res
app.use(
  express.urlencoded({
    extended: true
  })
)
app.use(express.json())

//Definir a view engine como handlebars
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//Especifica a caminho dos arquivos estáticos
app.use(express.static('public'))

// ======= Routes =====

// Rota deve exibir a formulário de cadastro de usuário
app.get('/users/create', (req, res) => {
  res.render('adduser')
})

//Rota deve criar o usuário no banco de dados com os dados recebidos no body da req
//É interessante colocar como função assíncrona para esperar criar o dados no banco de dados para dpeois continuar com o código
app.post('/users/create', async (req, res) => {
  const name = req.body.name
  const occupation = req.body.occupation
  let newsletter = req.body.newsletter

  //Quando a checkbox está checada ela retorna 'on'
  if (newsletter === 'on') {
    newsletter = true
  } else {
    newsletter = false
  }

  //Método cria dados na tabela
  //Ele cria os dados de acordo com o que veio do body da req
  await User.create({ name, occupation, newsletter })

  res.redirect('/')
})

//Rota deve retornar as informações do usuário filtrando baseado no ID
app.get('/users/:id', async (req, res) => {
  const id = req.params.id

  const user = await User.findOne({ raw: true, where: { id: id } })

  res.render('userview', { user })
})

//Rota deve deletar um user no banco baseado no ID
app.post('/users/delete/:id', async (req, res) => {
  const id = req.params.id

  await User.destroy({ where: { id: id } })

  res.redirect('/')
})

//Rota retorna os dados de um usuário baseado no ID
app.get('/users/edit/:id', async (req, res) => {
  const id = req.params.id

  //Na pesquisa irá incluir o resultado da tabela relacionada
  const user = await User.findOne({ include: Address, where: { id } })

  //console.log(user.get({plain: true}))

  //user.get({plain: true}) pega as informações e formata para aparecer somente as informações do user e do address
  res.render('useredit', { user: user.get({plain: true}) })
})

//Rota deve atualizar os dados do usuário baseado no ID
app.post('/users/update', async (req, res) => {
  const id = req.body.id
  const name = req.body.name
  const occupation = req.body.occupation
  let newsletter = req.body.newsletter

  if (newsletter === 'on') {
    newsletter = true
  } else {
    newsletter = false
  }

  const userData = {
    id,
    name,
    occupation,
    newsletter
  }

  await User.update(userData, { where: { id } })

  res.redirect('/')
})

//Rota deve adicionar um endereço a um usuário
app.post('/address/create', async (req, res) => {
  const UserId = req.body.UserId
  const rua = req.body.rua
  const numero = req.body.numero
  const cidade = req.body.cidade

  const address = {
    UserId,
    street: rua,
    number: numero,
    city: cidade
  }

  await Address.create(address)

  res.redirect(`/users/edit/${UserId}`)
})

app.post('/address/delete', async (req, res) => {
  const UserId = req.body.UserId
  const id = req.body.id

  //Deleta o endereço com o id vendo do body
  await Address.destroy({ where: { id }})

  res.redirect(`/users/edit/${UserId}`)
})

app.get('/', async (req, res) => {
  //espera fazer a pesquisa no banco de dados
  //O atributo raw: true retorna somente um array com os dados em forma de objeto, sem o raw o método retorna outras informações
  const users = await User.findAll({ raw: true })

  res.render('home', { users })
})

//O método sync sincroniza/cria todos os models no banco de dados
//O servidor só iniciará se esse sincrofização for feita com sucesso
conn
  // .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Servidor rodando!')
    })
  })
  .catch(err => console.log('Erro na sync', err))
