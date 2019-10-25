exports.createPages = async ({ actions, graphql, reporter }) => {
  const result = await graphql(`
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

  if (result.errors) {
    reporter.panic('ERROR! Failed to retrieve books data', result.errors);
  }

  const books = result.data.allBook.nodes;

  books.forEach(book => {
    actions.createPage({
      path: `/book/${book.id}`,
      component: require.resolve('./src/templates/book-details.js'),
      context: book,
    });
  });
};
