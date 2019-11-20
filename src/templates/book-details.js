import React, { useContext } from 'react';
import { graphql } from 'gatsby';
import { FirebaseContext } from '../firebase';
import Book from '../components/book';
import Comments from '../components/comments';

// NB: Doing it this way because useStaticQuery didn't work with a $bookId param
export const query = graphql`
  query($bookId: String!) {
    book(id: { eq: $bookId }) {
      id
      title
      summary
      author {
        name
      }
      localImage {
        childImageSharp {
          fixed(width: 200) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  }
`;

// The result of the exported page query (above)
// will be made available in props.data
export default ({ data: { book } }) => {
  const { firebase } = useContext(FirebaseContext);

  return (
    <>
      <Book
        title={book.title}
        summary={book.summary}
        imageUrl={book.localImage.childImageSharp.fixed}
        author={book.author.name}
      />
      {firebase && <Comments bookId={book.id} firebase={firebase} />}
    </>
  );
};
