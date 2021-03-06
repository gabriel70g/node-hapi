'use strict'

const Boom = require('boom')
const users = require('../models/index').users

async function createUser(req, h) {
  let result
  try {
    result = await users.create(req.payload)
  } catch (error) {
    console.error(error)
    return h.view('register', {
      title: 'Registro',
      error: 'Error creando el usuario'
    })
  }
  return h.view('register', {
    title: 'Registro',
    success: 'Usuario creado exitosamente'
  })
}

function logout(req, h) {
  return h.redirect('/login').unstate('user')
}

async function validateUser(req, h) {
  let result
  try {
    result = await users.validateUser(req.payload)
    if (!result) {
      return h.view('register', {
        title: 'Login',
        error: 'Email y/o contraseña incorrecta'
      })
    }
  } catch (error) {
    console.error(error)
    
    return h.view('register', {
      title: 'Login',
      error: 'roblemas validando el usuario'
    })
  }

  return h.redirect('/').state('user', {
    name: result.name,
    email: result.email
  })
}

function failValidation(req, h, err) {
  return Boom.badRequest('Falló la validación', req.payload)
}

module.exports = {
  createUser: createUser,
  failValidation: failValidation,
  logout: logout,
  validateUser: validateUser
}
