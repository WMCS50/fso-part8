//struggled with 8.25, but i think i'll just have to submit and look at the
//solutions
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import Recommend from './components/Recommend'
import NewBook from './components/NewBook'
import Notify from './components/Notify'
import LoginForm from './components/LoginForm'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import { USER, BOOK_ADDED, ALL_BOOKS, LOGGED_USER } from './queries'

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    console.log('ab', allBooks)
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  
  const client = useApolloClient()
  
  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      console.log('added_book', addedBook)
      alert(`${addedBook.title} added`)
      try {
        updateCache(client.cache, {query: ALL_BOOKS}, addedBook);
      } catch(error) {
        console.log(error);
      }
    }
  })

//ended up not using
/*   useSubscription(LOGGED_USER, {
    onData: ({ data }) => {
      console.log('logged in data', data)
      const user = data.data.loggedUser;
      const username = user.username;
      const favoriteGenre = user.favoriteGenre;
      client.cache.updateQuery({ query: USER }, ({ me }) => {
        return {
          me: { username, favoriteGenre }
        }
      })
    }
  })
 */

  const user = useQuery(USER)
  console.log('user', user)
  if (user.loading){
    return <div>loading...</div>
  }
  
  const logout = () => {
    navigate('/')
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <Notify errorMessage={errorMessage} />
      </div>

      <div>
        <Link to='/'></Link>
        <Link to='/authors'>
          <button>authors</button>
        </Link>
        <Link to='/books'>
          <button>books</button>
        </Link>
        { !token ? (
            <Link to='/login'>
              <button>login</button>
            </Link> 
          ) : (
            <>
              <Link to='/add'>
                <button>add book</button>
              </Link>
              <Link to='/recommend'>
                <button>recommend</button>
              </Link>
              <button onClick={logout}>logout</button>
              </>
              )
        }
      </div>

      <Routes>
        <Route path='/' element={<Authors />} />
        <Route path='/authors' element={<Authors setError={notify} token={token}/>} />
        <Route path='/books' element={<Books />} />
        <Route path='/recommend' element={<Recommend user={user}/>} />
        <Route path='login' element={<LoginForm setToken={setToken} setError={notify}/> } />
        <Route path='/add' element={<NewBook setError={notify} />} />
      </Routes>
    </div>
  )
}

export default App
