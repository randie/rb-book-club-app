import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import BookList from '../components/book-list';

export default () => {
  const data = useStaticQuery(graphql`
    {
      allBook {
        nodes {
          id
          title
          summary
          localImage {
            childImageSharp {
              fixed(width: 200) {
                ...GatsbyImageSharpFixed
              }
            }
          }
          author {
            name
          }
        }
      }
    }
  `);

  return <BookList books={data.allBook.nodes} />;
};
