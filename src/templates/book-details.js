import React from 'react';
import Layout from '../components/layout';

const BookDetails = ({ pageContext: book }) => (
  <Layout>
    <pre>{JSON.stringify(book, null, 2)}</pre>
  </Layout>
);

export default BookDetails;
