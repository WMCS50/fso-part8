import { gql } from '@apollo/client'

export const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    author {
      name
    }
    published
    genres
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors  {
      name
      born
      bookCount
      id
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks($genre: String = null) {
    allBooks(
      genre: $genre
    ) {
        ...BookDetails
      }
  }
  ${BOOK_DETAILS}
`

export const USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export const ALL_GENRES = gql`
  query {
    allGenres
  }
`
/* export const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!)
{
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
      title
      published
      author {
        name
      }
      genres
  }
}
` */

export const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!)
{
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    published
    author {
      name
    }
    genres
  }
}
`;


export const UPDATE_AUTHOR = gql`
mutation updateAuthor($name: String!, $birthYear: Int!)
{
  editAuthor(
    name: $name,
    setBornTo: $birthYear
  ) {
    name
    born
    bookCount
    id
  }
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }  
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS}
`
export const LOGGED_USER = gql`
  subscription {
    loggedUser {
      username
      favoriteGenre
      id
    }
  }
`