import React from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 40%;
  margin: 0 auto;
  font-family: Arial, Helvetica, sans-serif;

  h2 {
    text-align: center;
    color: #666;
  }
`;

export const Form = ({ title, onSubmit, children }) => {
  return (
    <FormContainer>
      {title && <h2>{title}</h2>}
      <form onSubmit={onSubmit}>{children}</form>
    </FormContainer>
  );
};
