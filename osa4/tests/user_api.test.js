const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  await api
    .post('/api/users')
    .send({ username: 'root', name: 'Root User', password: 'sekret' })
})

describe('POST /api/users', () => {
  test('a valid user can be created', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes('mluukkai'))
  })

  test('username must be unique', async () => {
    const usersAtStart = await User.find({})

    const duplicateUser = {
      username: 'root',
      name: 'Another Root',
      password: 'password',
    }

    const response = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)

    assert(response.body.error.includes('unique'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('username shorter than 3 chars is rejected', async () => {
    const usersAtStart = await User.find({})

    const shortUsername = {
      username: 'ab',
      name: 'Short User',
      password: 'validpassword',
    }

    const response = await api
      .post('/api/users')
      .send(shortUsername)
      .expect(400)

    assert(response.body.error.includes('3 characters'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('password shorter than 3 chars is rejected', async () => {
    const usersAtStart = await User.find({})

    const shortPassword = {
      username: 'validuser',
      name: 'Valid User',
      password: 'ab',
    }

    const response = await api
      .post('/api/users')
      .send(shortPassword)
      .expect(400)

    assert(response.body.error.includes('3 characters'))

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('missing username is rejected', async () => {
    const noUsername = {
      name: 'No Username',
      password: 'validpassword',
    }

    const response = await api
      .post('/api/users')
      .send(noUsername)
      .expect(400)

    assert(response.body.error)
  })

  test('missing password is rejected', async () => {
    const noPassword = {
      username: 'validuser',
      name: 'No Password',
    }

    const response = await api
      .post('/api/users')
      .send(noPassword)
      .expect(400)

    assert(response.body.error)
  })
})

after(async () => {
  await mongoose.connection.close()
})