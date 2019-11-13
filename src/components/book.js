import React from 'react';
import styled from 'styled-components';

const BookContainer = styled.div`
  display: flex;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  & + div {
    margin-top: 0.5rem;
  }
  header {
    margin-bottom: 1.2rem;
  }
  h2 {
    margin-bottom: 0.4rem;
    & + div {
      font: 1.1rem Arial, Helvetica, sans-serif;
    }
  }
  img {
    display: block;
    max-width: 200px;
    max-height: 300px;
    margin-right: 1rem;
  }
`;

const Book = ({ title, summary, author, imageUrl, children }) => (
  <BookContainer>
    <img src={imageUrl} alt="book cover" />
    <div>
      <header>
        <h2>{title}</h2>
        <div>by {author}</div>
      </header>
      <p>{summary}</p>
      {children}
    </div>
  </BookContainer>
);

export default Book;
