const { DataTypes } = require('sequelize')
const db = require('../database/connection')

const User = require('./User')

const Adress = db.define('Address', {
  street: {
    type: DataTypes.STRING,
    required: true
  },
  number: {
    type: DataTypes.STRING,
    required: true
  },
  city: {
    type: DataTypes.STRING,
    requied: true
  }
})

//Define que um usuário tem vários endereços
User.hasMany(Adress)

//Define que um Address pertence a um User
Adress.belongsTo(User)

module.exports = Adress
