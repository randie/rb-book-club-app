import React, { useState, useContext } from 'react';
import { navigate } from 'gatsby';
import { FirebaseContext } from '../firebase';
import { Form, Input, Button } from '../components';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { firebase } = useContext(FirebaseContext);

  function handleEmailChange(event) {
    event.persist();
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    event.persist();
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    firebase.login({ email, password }).then(() => navigate('/')); // TODO: .catch()
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      <Button type="submit" block>
        Login
      </Button>
    </Form>
  );
};

export default Login;
