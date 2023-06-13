const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')
// const User = require('../models/user')
// const jwt = require( 'jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blog = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blog)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const blogData = request.body
  const user = request.user

  if (!blogData.title || !blogData.url) {
    return response.status(400).end()
  }

  const blogPost = new Blog({
    title: blogData.title,
    author: blogData.author,
    url: blogData.url,
    likes: blogData.likes || 0,
    user: user.id
  })

  // Saving blog
  const saved = await blogPost.save()

  // Saving blog's id on user
  user.blogs = user.blogs.concat(saved.id)
  await user.save()

  response.status(201).json(saved)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  }

  return response.status(401).json({ error: 'Token Invalid' })
})


blogsRouter.put('/:id', async (request, response) => {
  const newData = request.body
  const currentData = await Blog.findById(request.params.id)

  const blog = {
    title: newData.title || currentData.title,
    author: newData.author || currentData.author,
    url: newData.url || currentData.url,
    likes: newData.likes || currentData.likes
  }

  const updated = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).json(updated)
})


module.exports = blogsRouter