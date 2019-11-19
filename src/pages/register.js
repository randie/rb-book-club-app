import React, { useState } from 'react';
import { FirebaseContext, useAuth } from '../firebase';
import { Form, Input, Button } from '../components';

const Register = () => {
  const { firebase } = useAuth(FirebaseContext);
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  function handleInputChange(event) {
    event.persist();
    setFormValues(currentValues => ({
      ...currentValues,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    //firebase.register({ email, password, displayName: 'foobar' }).then(() => navigate('/')); // TODO: .catch()
  }

  const { email, password, confirmPassword } = formValues;

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
        minLength={4}
        onChange={handleInputChange}
      />
      <Input
        type="password"
        name="confirmPassword"
        value={confirmPassword}
        placeholder="Confirm Password"
        required
        minLength={4}
        onChange={handleInputChange}
      />
      <Button type="submit" block>
        Register
      </Button>

      {/* TODO: remove, for debugging only */}
      {(email || password || confirmPassword) && <pre>{JSON.stringify(formValues, null, 2)}</pre>}
    </Form>
  );
};

export default Register;
