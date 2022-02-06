const { Sequelize } = require('sequelize')


const dbURL = 'DRIVER://USER:PASSWORD@kHOST/DBNAME'


const sequelizeConnection = new Sequelize(dbURL)



//Testando a conexão
// try {
//   sequelize.authenticate()
//   console.log('Conectado com sucesso!')

// } catch(err) {
//   console.log('Não foi possível conectar no banco', err)
// }


module.exports = sequelizeConnection