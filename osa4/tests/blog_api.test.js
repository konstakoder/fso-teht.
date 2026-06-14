const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
]

const getToken = async () => {
  await User.deleteMany({})
  await api
    .post('/api/users')
    .send({ username: 'testuser', name: 'Test User', password: 'salainen' })

  const response = await api
    .post('/api/login')
    .send({ username: 'testuser', password: 'salainen' })

  return response.body.token
}

beforeEach(async () => {
  await Blog.deleteMany({})
  for (const blog of initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct number of blogs is returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('blogs have id field instead of _id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert(blog.id !== undefined)
    assert(blog._id === undefined)
  })
})

describe('POST /api/blogs', () => {
  test('a valid blog can be added', async () => {
    const token = await getToken()

    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'Test Author',
      url: 'https://example.com',
      likes: 3,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(b => b.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert(titles.includes('async/await simplifies making async calls'))
  })

  test('if likes is missing, it defaults to 0', async () => {
    const token = await getToken()

    const newBlog = {
      title: 'Blog without likes',
      author: 'Test Author',
      url: 'https://example.com',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title is rejected with 400', async () => {
    const token = await getToken()

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ author: 'Test', url: 'https://example.com', likes: 5 })
      .expect(400)
  })

  test('blog without url is rejected with 400', async () => {
    const token = await getToken()

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'No url', author: 'Test', likes: 5 })
      .expect(400)
  })

  test('adding blog without token returns 401', async () => {
    const newBlog = {
      title: 'No token blog',
      author: 'Test Author',
      url: 'https://example.com',
      likes: 1,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })
})

describe('DELETE /api/blogs', () => {
  test('a blog can be deleted', async () => {
    const token = await getToken()

    const newBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'To be deleted', author: 'Test', url: 'https://example.com' })

    const blogToDelete = newBlog.body

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    const titles = blogsAtEnd.body.map(b => b.title)
    assert(!titles.includes('To be deleted'))
  })
})

describe('PUT /api/blogs', () => {
  test('likes of a blog can be updated', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedData = { ...blogToUpdate, likes: blogToUpdate.likes + 10 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
  })
})

after(async () => {
  await mongoose.connection.close()
})