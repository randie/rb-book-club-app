import React from 'react';
import styled from 'styled-components';

const BookContainer = styled.section`
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  & + section {
    margin-top: 0.5rem;
  }
  h2 {
    small {
      font-weight: normal;
      font-size: 1rem;
      margin-left: 0.5rem;
    }
  }
`;

const Book = ({ title, summary, author, imageUrl, children }) => (
  <BookContainer>
    <img src={imageUrl} alt="book cover" />
    <h2>
      {title}
      <small>by {author}</small>
    </h2>
    <p>{summary}</p>
    {children}
  </BookContainer>
);

export default Book;
