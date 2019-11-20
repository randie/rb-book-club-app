import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const CommentsSection = styled.section`
  margin-top: 1rem;
  h3 {
    margin-bottom: 1rem;
  }
  ul {
    margin-left: 0;
    li {
      list-style-type: none;
      border-bottom: 1px solid #ddd;
      padding-bottom: 0.6rem;
    }
  }
`;

export default ({ firebase, bookId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.subscribeToComments(bookId, snapshot => {
      const c = [];
      snapshot.forEach(doc => {
        c.push({ id: doc.id, ...doc.data() });
      });
      setComments(c);
    });

    return () => unsubscribe();
  }, [firebase, bookId]);

  /* Sample comment data
  {
    id: "HTkjRbmTvggVB7ioIJZA",
    book: DocumentReference,
    date: Timestamp,
    text: "blah blah blah",
    username: "yoda"
  }
  */
  return (
    <CommentsSection>
      <h3>Comments</h3>
      <ul>
        {comments.map(({ id, username, date, text }) => {
          return (
            <li key={id}>
              <div>
                <strong>{username}</strong> {date && date.toDate().toLocaleString()}
              </div>
              <div>{text}</div>
            </li>
          );
        })}
      </ul>
    </CommentsSection>
  );
};
