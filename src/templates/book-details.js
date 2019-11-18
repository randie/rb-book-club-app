import React from 'react';
import { graphql } from 'gatsby';
import Book from '../components/book';

// NB: Doing it this way because useStaticQuery didn't work with a $bookId param
export const query = graphql`
  query($bookId: String!) {
    book(id: { eq: $bookId }) {
      title
      summary
      author {
        name
      }
      localImage {
        childImageSharp {
          fixed(width: 200) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  }
`;

// The result of the exported page query (above)
// will be available in props.data
export default ({ data: { book } }) => (
  <Book
    title={book.title}
    summary={book.summary}
    imageUrl={book.localImage.childImageSharp.fixed}
    author={book.author.name}
  />
);
