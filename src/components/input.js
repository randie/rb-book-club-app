import styled from 'styled-components';

export const Input = styled.input`
  display: block;
  width: 100%;
  padding: 8px 10px;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  &:focus,
  &:active {
    border: 1px solid rebeccapurple;
  }
`;
