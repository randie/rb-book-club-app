import React from 'react';

const BookDetails = ({ pageContext: book }) => (
  <pre>{JSON.stringify(book, null, 2)}</pre>
);

export default BookDetails;
