import React, { useState, useContext } from 'react';
import { navigate } from 'gatsby';
import { FirebaseContext } from '../firebase';
import { Form, Input, Button, Message } from '../components';

const Register = () => {
  const { firebase } = useContext(FirebaseContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { email, password, confirmPassword } = formValues;

  function handleSubmit(event) {
    event.preventDefault();

    if (password === confirmPassword) {
      const username = email.substring(0, email.indexOf('@')); // TODO: add username input field to form
      //const displayName = username.charAt(0).toUpperCase() + username.slice(1);
      firebase
        .register({ email, password, username })
        .then(() => navigate('/'))
        .catch(error => setErrorMessage(error.message));
    } else {
      setErrorMessage("Passwords don't match.");
    }
  }

  function handleInputChange(event) {
    event.persist();
    setFormValues(currentValues => ({
      ...currentValues,
      [event.target.name]: event.target.value,
    }));
    setErrorMessage('');
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="email"
        name="email"
        value={email}
        placeholder="Email"
        required
        onChange={handleInputChange}
      />
      <Input
        type="password"
        name="password"
        value={password}
        placeholder="Password"
        required
        minLength={6}
        onChange={handleInputChange}
      />
      <Input
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        placeholder="Confirm Password"
        required
        minLength={6}
        onChange={handleInputChange}
      />
      <Button type="submit" block>
        Register
      </Button>
      {errorMessage && <Message error>{`ERROR! ${errorMessage}`}</Message>}
    </Form>
  );
};

export default Register;
