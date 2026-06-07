const _ = require('lodash') 

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}


const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  })
}


const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const blogCounts = _.countBy(blogs, 'author')

  const authorsArray = _.map(blogCounts, (blogsCount, authorName) => ({
    author: authorName,
    blogs: blogsCount
  }))

  return _.maxBy(authorsArray, 'blogs')
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const groupedByAuthor = _.groupBy(blogs, 'author')

  const authorsLikesArray = _.map(groupedByAuthor, (authorBlogs, authorName) => ({
    author: authorName,
    likes: totalLikes(authorBlogs)
  }))

  return _.maxBy(authorsLikesArray, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
