import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import BookList from './BookList'

const Recommend = ({user}) => {
  const genre = user.data.me.favoriteGenre
  console.log('genre', genre)

  const filteredBooksResult = useQuery(ALL_BOOKS, { variables: { genre } })
  if (filteredBooksResult.loading){
    return <div>loading...</div>
  }

  console.log('filteredBooks', filteredBooksResult)
  const filteredBooks = filteredBooksResult.data.allBooks
  

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{genre}</b> </p>
      <BookList books={filteredBooks} />
    </div>
  )
}

export default Recommend