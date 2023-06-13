const Blog = require('../models/blog')
const User = require('../models/user')

const blogPosts = [
  {
    title: 'Best songs by The Beatles',
    author: 'João Silva',
    url: 'joaosilva.com.br/best-beatles',
    likes: 15
  },
  {
    title: 'Best songs by The Kinks',
    author: 'João Silva',
    url: 'joaosilva.com.br/best-kinks',
    likes: 11
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const blogUsers = [
  {
    username: 'johncena',
    name: 'John Cena',
    password: 'tatarata'
  },
  {
    username: 'leandro',
    name: 'Leandro Cruz',
    password: '123456'
  }
]

const userInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = { blogPosts, blogsInDb, blogUsers, userInDb }