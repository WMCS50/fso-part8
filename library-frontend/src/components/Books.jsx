import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_GENRES, ALL_BOOKS } from '../queries'
import BookList from './BookList'

const Books = () => {
  const [genre, setGenre] = useState()
  const genresResult = useQuery(ALL_GENRES)
  const booksResult = useQuery(ALL_BOOKS)
  const filteredBooksResult = useQuery(ALL_BOOKS, { variables: {genre} })
  
  if (genresResult.loading || booksResult.loading || filteredBooksResult.loading)  {
    return <div>loading...</div>
  }

  const genres = genresResult.data.allGenres
  const filteredBooks = filteredBooksResult.data.allBooks
  
  return (
    <div>
      <h2>filter by genre</h2>
      <div>
        {genres.map(genre => (
          <button 
            key={genre} onClick={() => setGenre(genre)}>{genre}
          </button>
        ))}
        <button onClick={()=> setGenre('')}>all genres</button>
      </div>
      <BookList books={filteredBooks} />
    </div>
  )
}
export default Books