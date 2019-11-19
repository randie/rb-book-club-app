import styled from 'styled-components';

export const Button = styled.button`
  padding: 8px 16px;
  background-color: rebeccapurple;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: indigo;
  }
  ${props => props.block && 'display: block; width: 100%;'}
`;
