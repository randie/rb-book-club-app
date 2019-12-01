import React, { useState, useContext } from 'react';
import { navigate } from 'gatsby';
import { FirebaseContext } from '../firebase';
import { Form, Input, Button, Message } from '../components';

const Register = () => {
  const { firebase } = useContext(FirebaseContext);
  const [errorMessage, setErrorMessage] = useState('');
  const [formValues, setFormValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { username, email, password, confirmPassword } = formValues;

  function handleSubmit(event) {
    event.preventDefault();

    if (password === confirmPassword) {
      firebase
        .register({ username, email, password })
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

  function isDisabled() {
    return (
      !username || !email || !password || !confirmPassword || !!errorMessage
    );
  }

  async function checkUsername() {
    try {
      const usernameDoesNotExistCallable = firebase.functions.httpsCallable(
        'usernameDoesNotExist'
      );
      await usernameDoesNotExistCallable({ username });
    } catch (error) {
      setErrorMessage(`That username is already taken`);
    }
  }

  async function checkEmail() {
    console.log('>>>', 'register#checkEmail is not implemented yet');
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input
        type="username"
        name="username"
        value={username}
        placeholder="Username"
        required
        onChange={handleInputChange}
        onBlur={checkUsername}
      />
      <Input
        type="email"
        name="email"
        value={email}
        placeholder="Email"
        required
        onChange={handleInputChange}
        onBlur={checkEmail}
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
      <Button type="submit" block disabled={isDisabled()}>
        Register
      </Button>
      {errorMessage && <Message error>{`ERROR! ${errorMessage}`}</Message>}
    </Form>
  );
};

export default Register;
