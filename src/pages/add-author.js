import React, { useContext, useState } from 'react';
import { FirebaseContext } from '../firebase';
import { Form, Input, Button, Message } from '../components';

const AddAuthor = () => {
  const [authorName, setAuthorName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { firebase } = useContext(FirebaseContext);

  const handleInputChange = event => {
    event.persist();
    setAuthorName(event.target.value);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const addAuthor = event => {
    event.preventDefault();
    firebase
      .addAuthor(authorName)
      .then(() => {
        setSuccessMessage(`Author ${authorName} successfully added`);
        setAuthorName('');
      })
      .catch(error => {
        setErrorMessage(error.message);
      });
  };

  return (
    <Form onSubmit={addAuthor} title="Add a new author">
      <Input placeholder="Author's name" value={authorName} onChange={handleInputChange} />
      <Button type="submit" block disabled={!authorName}>
        Submit
      </Button>
      {successMessage && <Message success>{successMessage}</Message>}
      {errorMessage && <Message error>{`ERROR! ${errorMessage}`}</Message>}
    </Form>
  );
};

export default AddAuthor;
