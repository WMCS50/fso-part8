import { GraphQLError } from 'graphql'
import { PubSub } from 'graphql-subscriptions'
import Author from './models/author.js'
import Book from './models/book.js'
import User from './models/user.js'
import jwt from 'jsonwebtoken'

const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    
    authorCount: async () => Author.collection.countDocuments(),
    
    allBooks: async (root, args) => {
      const author = await Author.findOne({name: args.author })
      
      if (args.author && args.genre) {
        return await 
          Book.find({ author: author.id, genres: { $in: args.genre }})
          .populate('author')
      } else if (args.author) {
        return await Book.find({ author: author.id }).populate('author')
      } else if (args.genre) {
        return await Book.find({ genres: { $in: args.genre }}).populate('author')
      } else {
        return await Book.find({}).populate('author')
      }
    },
    
    allAuthors: async () => {
      const authors = await Author.find({})
      return authors.map((a) => {
        return {
          id: a._id,
          name: a.name,
          born: a.born,
          bookCount: a.books.length
        };
      });
    },

    me: async (root, args, context) => {
      return context.currentUser
    },

    allGenres: async () => {
      const books = await Book.find({})
      const allGenres = books.flatMap(b => b.genres)
      return allGenres.filter((value, index) => allGenres.indexOf(value) === index)
    }

  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('User must be logged in to add book', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
      }  
      
      const book = new Book({ ...args, author: author._id })
      try {
        author.books = author.books.concat(book._id)   
        await book.save()
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving new book failed', {
          extentions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          }
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book.populate('author') })
      
      return book.populate('author')
      
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      
      if (!currentUser) {
        throw new GraphQLError('User must be logged in to edit author', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Not able to save changes', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.setBornTo,
            error
          }
        })
      }
      return author
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }
      
      pubsub.publish('LOGGED_USER', { loggedUser: user })
      
      console.log(jwt.sign(userForToken, process.env.JWT_SECRET))
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET)}
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
    loggedUser: {
      subscribe: () => pubsub.asyncIterator('LOGGED_USER')
    }
  }
}
export default resolvers