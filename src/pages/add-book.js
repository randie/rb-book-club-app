import React, { useContext, useEffect, useState } from 'react';
import { FirebaseContext } from '../firebase';
import { Form, Input, Button, Message } from '../components';

let fileReader;
if (typeof window === 'object') {
  fileReader = new FileReader();
}

const AddBook = () => {
  const { firebase } = useContext(FirebaseContext);
  const [authors, setAuthors] = useState([]);
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // it takes some time to load a firebase instance and we might
    // not have one yet at this point so check if it exists first
    if (firebase) {
      firebase.getAuthors().then(snapshot => {
        const availableAuthors = [];
        // NB: this is firebase's forEeach() not Array.prototype.forEach()
        snapshot.forEach(doc => {
          availableAuthors.push({ id: doc.id, ...doc.data() });
        });
        setAuthors(availableAuthors);
      });
    }
  }, [firebase]);

  useEffect(() => {
    fileReader.addEventListener('load', () => {
      setImage(fileReader.result);
    });
  }, []);

  const handleTitleChange = event => {
    event.persist();
    setTitle(event.target.value);
  };

  const handleAuthorChange = event => {
    event.persist();
    setAuthorId(event.target.value);
  };

  const handleSummaryChange = event => {
    event.persist();
    setSummary(event.target.value);
  };

  const handleImageChange = event => {
    event.persist();
    fileReader.readAsDataURL(event.target.files[0]);
  };

  const addBook = event => {
    event.preventDefault();
    console.log('>>>', { title, authorId, summary, image });
  };

  return (
    <>
      <Form onSubmit={addBook} title="Add a new book">
        <label htmlFor="title">Book title</label>
        <Input id="title" placeholder="Title" value={title} onChange={handleTitleChange} />

        <label htmlFor="author-id">Author</label>
        <select id="author-id" value={authorId} onChange={handleAuthorChange}>
          {authors.map(a => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <label htmlFor="summary">Summary</label>
        <Input id="summary" placeholder="Summary" value={summary} onChange={handleSummaryChange} />

        <label htmlFor="book-cover-image">Book cover image</label>
        <Input id="book-cover-image" type="file" onChange={handleImageChange} />

        <Button type="submit" block disabled={!title || !authorId || !summary || !image}>
          Submit
        </Button>

        {successMessage && <Message success>{successMessage}</Message>}
        {errorMessage && <Message error>{`ERROR! ${errorMessage}`}</Message>}
      </Form>
    </>
  );
};

export default AddBook;
