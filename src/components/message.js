import styled from 'styled-components';

export const Message = styled.div`
  color: ${props => (props.error ? 'red' : props.success ? 'green' : '#666')};
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;
