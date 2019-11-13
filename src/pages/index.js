import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Layout from '../components/layout';
import BookList from '../components/book-list';

export default () => {
  const data = useStaticQuery(graphql`
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
  `);

  return (
    <Layout>
      <BookList books={data.allBook.nodes} />
    </Layout>
  );
};
