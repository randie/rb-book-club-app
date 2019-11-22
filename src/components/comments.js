import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Input } from './input';
import { Button } from './button';

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

const CommentForm = styled.form`
  display: flex;
  margin-bottom: 1rem;
  ${Input} {
    margin: 0 0.4rem 0 0;
  }
`;

export default ({ firebase, bookId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    const unsubscribe = firebase.subscribeToComments(bookId, snapshot => {
      const snapshotComments = [];

      // NB: this is firestore's forEeach() not Array.prototype.forEach()
      snapshot.forEach(doc => {
        snapshotComments.push({ id: doc.id, ...doc.data() });
      });

      setComments(snapshotComments);
    });

    return () => unsubscribe();
  }, [firebase, bookId]);

  function handleInputChange(event) {
    event.persist();
    setCommentText(event.target.value);
  }

  function handleCommentSubmit(event) {
    event.preventDefault();
    firebase.postComment(bookId, commentText).then(() => setCommentText(''));
  }

  /* Sample comment data
  {
    id: "HTkjRbmTvggVB7ioIJZA",
    book: DocumentReference,
    dateCreated: Timestamp,
    text: "blah blah blah",
    username: "yoda"
  }
  */
  return (
    <CommentsSection>
      <h3>Comments</h3>
      <CommentForm onSubmit={handleCommentSubmit}>
        <Input
          type="text"
          placeholder="Write your comment here"
          value={commentText}
          onChange={handleInputChange}
        />
        <Button type="submit">Post Comment</Button>
      </CommentForm>
      <ul>
        {comments.map(({ id, username, dateCreated, text }) => {
          return (
            <li key={id}>
              <div>
                <strong>{username}</strong>{' '}
                {dateCreated.toDate().toLocaleString()}
              </div>
              <div>{text}</div>
            </li>
          );
        })}
      </ul>
    </CommentsSection>
  );
};
