import React from 'react';
import Layout from '../components/layout';
import Book from '../components/book';

const BookDetails = ({ pageContext: book }) => {
  return (
    <Layout>
      <Book
        title={book.title}
        summary={book.summary}
        imageUrl={book.imageUrl}
        author={book.author.name}
      />
    </Layout>
  );
};

export default BookDetails;
