const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) {
    return 0
  }
  const postLikes = blogs.map(blog => blog.likes)
  const totalPostLikes = postLikes.reduce((prev, cur) => prev + cur, 0)
  return totalPostLikes
}

const favoriteBlog = (blogs) => {
  const blogsLikes = blogs.map(blog => blog.likes)
  const mostLikes = Math.max(...blogsLikes)
  const favorite = blogs.find(blog => blog.likes === mostLikes)

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  const grouped =
    _(blogs)
      .groupBy('author')
      .map((objs, key) => ({
        'author': key,
        'blogs': Math.max(Object.values(_.countBy(objs, 'author')))
      }))
      .value()

  const count = grouped.map(blog => blog.blogs)
  const mostPubli = Math.max(...count)
  const result = grouped.find(blog => blog.blogs === mostPubli )

  return result
}

const mostLikes = (blogs) => {
  const grouped =
  _(blogs)
    .groupBy('author')
    .map((objs, key) => ({
      'author': key,
      'likes': _.sumBy(objs, 'likes')
    }))
    .value()

  const count = grouped.map(blog => blog.likes)
  const mostLiked = Math.max(...count)
  const result = grouped.find(blog => blog.likes === mostLiked)

  return result
}


module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }