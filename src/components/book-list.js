import React from 'react';
import { Link } from 'gatsby';
import Book from './book';
import styled from 'styled-components';

const LinkButton = styled.div`
  text-align: right;
  font-family: Arial, Helvetica, sans-serif;
  a {
    background: rebeccapurple;
    color: white;
    padding: 0.5rem 0.8rem;
    border-radius: 8px;
    text-decoration: none;
    &:hover {
      background: indigo;
    }
  }
`;

const BookList = ({ books }) => (
  <>
    {books.map(book => (
      <Book
        key={book.id}
        title={book.title}
        summary={book.summary}
        imageUrl={book.localImage.publicURL}
        author={book.author.name}
      >
        <LinkButton>
          <Link to={`/book-details/${book.id}`}>Join conversation</Link>
        </LinkButton>
      </Book>
    ))}
  </>
);

export default BookList;
