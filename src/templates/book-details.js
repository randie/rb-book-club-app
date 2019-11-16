import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
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

export default ({ data: { book } }) => (
  <Layout>
    <Book
      title={book.title}
      summary={book.summary}
      imageUrl={book.localImage.childImageSharp.fixed}
      author={book.author.name}
    />
  </Layout>
);
