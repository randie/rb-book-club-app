import React, { useState, useContext } from 'react';
import { navigate } from 'gatsby';
import { FirebaseContext } from '../firebase';
import { Form, Input, Button, Message } from '../components';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { firebase } = useContext(FirebaseContext);

  function handleEmailChange(event) {
    event.persist();
    setEmail(event.target.value);
    setErrorMessage('');
  }

  function handlePasswordChange(event) {
    event.persist();
    setPassword(event.target.value);
    setErrorMessage('');
  }

  function handleSubmit(event) {
    event.preventDefault();
    firebase
      .login({ email, password })
      .then(() => navigate('/'))
      .catch(error => setErrorMessage(error.message));
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input type="email" placeholder="Email" value={email} onChange={handleEmailChange} required />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
        required
      />
      <Button type="submit" block>
        Login
      </Button>
      {errorMessage && <Message error>{`ERROR! ${errorMessage}`}</Message>}
    </Form>
  );
};

export default Login;
