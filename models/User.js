const { DataTypes } = require('sequelize')// Define o tipo de dado de cada campo

const db = require('../database/connection')

//O método 'define' define a estrutura da tabela
//O ID é criado automaticamente pelo sequelize
const User = db.define('User', {
  //Nome do user
  name: {
    type: DataTypes.STRING,
    allowNull: false //Não aceita 'null'
  },
  //Profissão do user
  occupation: {
    type: DataTypes.STRING,
    required: true //Coloca que o campo não pode ser vazio/nulo
  },
  //Irá informar se o user se inscreveu no newsletter
  newsletter: {
    type: DataTypes.BOOLEAN
  }

})

module.exports = User
