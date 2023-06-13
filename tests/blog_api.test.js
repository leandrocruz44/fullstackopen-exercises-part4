const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const jwt = require('jsonwebtoken')


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogPost = new Blog(helper.blogPosts[0])
  await blogPost.save()
  blogPost = new Blog(helper.blogPosts[1])
  await blogPost.save()
})

describe('Get/Post a blog', () => {
  let validToken
  let user

  beforeEach(async () => {
    const login = {
      username: 'leandro',
      password: '123456'
    }

    const loginResponse = await api
      .post('/api/login')
      .send(login)

    validToken = loginResponse.body.token.toString()
    const decodedToken = jwt.verify(validToken, process.env.SECRET)
    user = await User.findById(decodedToken.id)
  })

  test('returns the correct amount of blog posts in the JSON format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('verifies that the unique identifier property of the blog posts is named id', async () => {
    const blogs = await api.get('/api/blogs')
    expect(blogs.body[0].id).toBeDefined()
  })

  test('verifies making an HTTP POST request successfully creates a new blog post', async () => {
    const newBlogPost = {
      title: 'Best songs by The Who',
      author: 'Paulo Pessoa',
      url: 'paulopeople.com/best-songs/the-who',
      likes: 14,
      id: user.id
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(newBlogPost)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const dbEntries = await helper.blogsInDb()
    expect(dbEntries.length).toBe(helper.blogPosts.length + 1)

    const blogPostContent = dbEntries.map(blog => blog.title)
    expect(blogPostContent).toContain('Best songs by The Who')
  })

  test('verifies that if the likes property is missing, it will default to the value 0', async () => {
    const newBlogPost = {
      title: 'Best songs by The Who',
      author: 'Paulo Pessoa',
      url: 'paulopeople.com/best-songs/thewho',
    }

    await api
      .post('/api/blogs')
      .send(newBlogPost)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const dbEntries = await helper.blogsInDb()
    if (newBlogPost.likes === undefined) {
      expect(dbEntries[dbEntries.length - 1].likes).toBe(0)
    }
  })

  test('verify that if the title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request', async () => {
    const newBlogPost = {
      author: 'Paulo Pessoa',
      url: 'paulopeople.com/best-songs/the-who',
      likes: 14
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(newBlogPost)
      .expect(400)

    const dbEntries = await helper.blogsInDb()
    expect(dbEntries).toHaveLength(helper.blogPosts.length)
  })

  test('adding a blog fails with status code 401 if a token is not provided', async () => {
    const newBlogPost = {
      title: 'Best songs by The Who',
      author: 'Paulo Pessoa',
      url: 'paulopeople.com/best-songs/the-who',
      likes: 14,
      id: user.id
    }

    await api
      .post('/api/blogs')
      .send(newBlogPost)
      .expect(401)
  })
})

describe('delete a blog', () => {
  test('if id is valid, succeeds status code 204', async () => {
    // Login to get the token
    let validToken
    let user

    const login = {
      username: 'leandro',
      password: '123456'
    }

    const loginResponse = await api
      .post('/api/login')
      .send(login)

    validToken = loginResponse.body.token.toString()
    const decodedToken = jwt.verify(validToken, process.env.SECRET)
    user = await User.findById(decodedToken.id)

    //Creating the entry
    const entry = {
      'title': 'Do Leme ao Pontal',
      'author': 'Tim Maia',
      'url': 'musicabrasileira.com.br/tim-maia/do-leme-ao-pontal',
      'likes': 200,
      'user': `${user.id}`
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${validToken}`)
      .send(entry)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Deleting the entry
    const dbEntries = await helper.blogsInDb()
    const blogToDelete = dbEntries[dbEntries.length - 1]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${validToken}`)
      .expect(204)

    const dbEntriesNow = await helper.blogsInDb()
    expect(dbEntriesNow).toHaveLength(dbEntries.length - 1)

    const contents = dbEntriesNow.map(blog => blog.title)
    expect(contents).not.toContain('Do Leme ao Pontal')
  })
})

describe('update a blog', () => {
  test('if the id is valid', async () => {
    const updatedNote = {
      likes: 100
    }

    const dbEntries = await helper.blogsInDb()
    const blogToUpdate = dbEntries[0]

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedNote)
      .expect(200)

    const dbEntriesNow = await helper.blogsInDb()
    const contents = dbEntriesNow.map(blog => blog.likes)
    expect(contents).toContain(updatedNote.likes)
  })
})

describe('testing users', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    let user = helper.blogUsers[0]
    await api.post('/api/users').send(user)
    user = helper.blogUsers[1]
    await api.post('/api/users').send(user)
  })

  test('check if user information is as required', async () => {
    const newUser = {
      username: 'example',
      name: 'Example Jones',
      password: '1234'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const userEntries = await helper.userInDb()
    expect(userEntries.length).toBe(helper.blogUsers.length + 1)

    const content = userEntries.map(user => user.username)
    expect(content).toContain('example')
  })

  test('throws 400 status code (bad request) if user information is not as required', async () => {
    const newUser = {
      username: 'Mo',
      name: 'Mo Salah',
      password: '1234'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})