const listHelper = require('../utils/list_helper')

describe('Dummy', () => {
  test('dummy returns number one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})


describe('Total Likes', () => {
  const allBlogPosts = [
    {
      'title': 'How to learn REACT, Node and Express quickly',
      'author': 'Carlos Massa',
      'url': 'learnstuffquickly.com',
      'likes': 10000,
      'id': '6466e7d682fc5e5891f77498'
    },
    {
      'title': 'The best City Pop albums of all time',
      'author': 'Shingo Tashukina',
      'url': 'musicfornerds.com',
      'likes': 1197,
      'id': '6466e913b3e2d8b7778e72b7'
    },
    {
      'title': 'Places to go when in São Paulo',
      'author': 'Léo Pereira',
      'url': 'travelbyyourself.com',
      'likes': 963,
      'id': '6466f3eb7fae5ac9e93ac5b5'
    },
    {
      'title': 'Greatest philosophers from Greece',
      'author': 'Joly Uminaki',
      'url': 'thinking.com/greatest-philosophers',
      'likes': 9633,
      'id': '646a69d3f66553384b85c9f6'
    },
    {
      'title': 'Greatest philosophers from China',
      'author': 'Joly Uminaki',
      'url': 'thinking.com/greatest-philosophers/china',
      'likes': 5833,
      'id': '646d17f9f0b8bd38768b64c9'
    }
  ]

  const oneBlogPost = [{
    'title': 'How to learn REACT, Node and Express quickly',
    'author': 'Carlos Massa',
    'url': 'learnstuffquickly.com',
    'likes': 10000,
    'id': '6466e7d682fc5e5891f77498'
  }]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog equals the like of that', () => {
    const result = listHelper.totalLikes(oneBlogPost)
    expect(result).toBe(10000)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(allBlogPosts)
    expect(result).toBe(27626)
  })
})

describe('Find the', () => {
  const allBlogPosts = [
    {
      'title': 'How to learn REACT, Node and Express quickly',
      'author': 'Carlos Massa',
      'url': 'learnstuffquickly.com',
      'likes': 10000,
      'id': '6466e7d682fc5e5891f77498'
    },
    {
      'title': 'The best City Pop albums of all time',
      'author': 'Shingo Tashukina',
      'url': 'musicfornerds.com',
      'likes': 1197,
      'id': '6466e913b3e2d8b7778e72b7'
    },
    {
      'title': 'Places to go when in São Paulo',
      'author': 'Léo Pereira',
      'url': 'travelbyyourself.com',
      'likes': 963,
      'id': '6466f3eb7fae5ac9e93ac5b5'
    },
    {
      'title': 'Greatest philosophers from Greece',
      'author': 'Joly Uminaki',
      'url': 'thinking.com/greatest-philosophers',
      'likes': 9633,
      'id': '646a69d3f66553384b85c9f6'
    },
    {
      'title': 'Greatest philosophers from China',
      'author': 'Joly Uminaki',
      'url': 'thinking.com/greatest-philosophers/china',
      'likes': 5833,
      'id': '646d17f9f0b8bd38768b64c9'
    }
  ]

  test('blog post with most likes', () => {
    const result = listHelper.favoriteBlog(allBlogPosts)
    expect(result).toEqual({
      'title': 'How to learn REACT, Node and Express quickly',
      'author': 'Carlos Massa',
      'likes': 10000,
    })
  })

  test('author with most blog posts', () => {
    const result = listHelper.mostBlogs(allBlogPosts)
    expect(result).toEqual({
      'author': 'Joly Uminaki',
      'blogs': 2,
    })
  })

  test('author with most likes', () => {
    const result = listHelper.mostLikes(allBlogPosts)
    expect(result).toEqual({
      'author': 'Joly Uminaki',
      'likes': 15466
    })
  })
})