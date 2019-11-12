import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';
import Book from '../components/book';

export const query = graphql`
  {
    allBook {
      nodes {
        id
        title
        author {
          name
        }
        summary
      }
    }
  }
`;

const Index = ({ data }) => (
  <Layout>
    {data.allBook.nodes.map(book => (
      <Book
        key={book.id}
        title={book.title}
        summary={book.summary}
        author={book.author.name}
      >
        <Link to={`/book-details/${book.id}`}>Join conversation</Link>
      </Book>
    ))}
  </Layout>
);

export default Index;
