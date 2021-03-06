exports.createPages = async ({ actions, graphql, reporter }) => {
  const result = await graphql(`
    {
      allBook {
        nodes {
          id
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic('ERROR! Failed to retrieve books data', result.errors);
  }

  const books = result.data.allBook.nodes;

  books.forEach(book =>
    actions.createPage({
      path: `/book-details/${book.id}`,
      component: require.resolve('./src/templates/book-details.js'),
      context: { bookId: book.id },
    })
  );
};
