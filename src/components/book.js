import React from 'react';
import styled from 'styled-components';

const BookContainer = styled.section`
  display: flex;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  & + section {
    margin-top: 0.5rem;
  }
  h2 {
    small {
      font-weight: normal;
      font-size: 1.2rem;
    }
  }
  img {
    display: block;
    max-width: 200px;
    & + div {
      margin-left: 1rem;
    }
  }
`;

const Book = ({ title, summary, author, imageUrl, children }) => (
  <BookContainer>
    <img src={imageUrl} alt="book cover" />
    <div>
      <h2>
        {title}
        <br />
        <small>{author}</small>
      </h2>
      <p>{summary}</p>
      {children}
    </div>
  </BookContainer>
);

export default Book;
