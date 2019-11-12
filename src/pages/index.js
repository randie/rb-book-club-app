import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import BookList from '../components/book-list';

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
    <BookList books={data.allBook.nodes} />
  </Layout>
);

export default Index;
