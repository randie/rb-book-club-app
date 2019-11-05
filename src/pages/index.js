import React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../components/layout';

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

const IndexPage = ({ data }) => (
  <Layout>
    {data.allBook.nodes.map(book => (
      <div key={book.id}>
        <h2>
          {book.title} - <small>{book.author.name}</small>
        </h2>
        <div>{book.summary}</div>
        <Link to={`/book-details/${book.id}`}>Join conversation</Link>
      </div>
    ))}
  </Layout>
);

export default IndexPage;
