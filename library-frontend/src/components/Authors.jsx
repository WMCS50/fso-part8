import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const Authors = ({ setError, token }) => {
  const result = useQuery(ALL_AUTHORS)

  const [name, setName] = useState('')
  const [birthYear, setBirthYear] = useState('')
    
  const [ updateAuthor ] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    onError: (error) => {
      const messages = error.graphQLErrors.map(e => e.message).join('\n')
      setError(messages)
    }
  })

  if (result.loading)  {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors
  
  const submit = async (event) => {
    event.preventDefault()
 
    updateAuthor({ variables: { name, birthYear: parseInt(birthYear, 10) }})
    
    setName('')    
    setBirthYear('')
  }
if (token) {
  console.log('logged in')
}
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      { !token ? (
          '' 
        ) : (
            <>
              <h2>Set birthyear</h2>
              <form onSubmit={submit}>
                <div>
                  <span>name</span>
                    <select value={name}
                    onChange={({ target }) => setName(target.value)}>
                      <option value=''>Select Author</option>
                      {authors.map((a) => (
                        <option key={a.id} value={a.name}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                </div>
                <div>
                  <span>born</span>
                  <input
                    value={birthYear}
                    onChange={({ target }) => setBirthYear(target.value)}
                  />
                  <br></br>
                  <button type="submit">
                    update author
                  </button>
                </div>
              </form>
            </>
          )
      }

        


    </div>
  )
}

export default Authors