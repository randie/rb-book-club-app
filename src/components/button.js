import styled from 'styled-components';

export const Button = styled.button`
  padding: 8px 16px;
  background-color: rebeccapurple;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: indigo;
  }
  &[disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }
  ${props => props.block && 'display: block; width: 100%;'}
`;
