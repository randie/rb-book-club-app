import React, { useState } from 'react';
import { navigate } from 'gatsby';
import Layout from '../components/layout';
import { FirebaseContext } from '../firebase';
import useCurrentUser from '../hooks/use-current-user';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { firebase } = useCurrentUser(FirebaseContext);

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
    <Layout>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">Login</button>
      </form>
    </Layout>
  );
};

export default Login;
