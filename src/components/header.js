import React, { useContext } from 'react';
import { Link, navigate } from 'gatsby';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FirebaseContext } from '../firebase';

const HeaderContainer = styled.header`
  background: rebeccapurple;
  margin-bottom: 1.45rem;
  color: white;
`;

const HeaderContent = styled.div`
  margin: 0 auto;
  max-width: 960px;
  padding: 1.45rem 1.0875rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  a {
    color: white;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  > h1 {
    margin: 0;
    > a:hover {
      text-decoration: none;
    }
  }
  > div {
    text-align: right;
  }
`;

const LogoutLink = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.span`
  margin: 0 0.4rem;
  &::before {
    content: '|';
  }
`;

const Header = ({ siteTitle }) => {
  const { firebase, currentUser, isLoading } = useContext(FirebaseContext);

  function handleLogoutClick() {
    firebase.logout().then(() => navigate('/login'));
  }

  return (
    <HeaderContainer>
      <HeaderContent>
        <h1>
          <Link to="/">{siteTitle}</Link>
        </h1>
        {isLoading ? null : (
          <div>
            {!currentUser ? (
              <>
                <Link to="/login">Login</Link>
                <Divider />
                <Link to="/register">Register</Link>
              </>
            ) : (
              <>
                <div>{`${currentUser.displayName || currentUser.email}`}</div>
                <LogoutLink onClick={handleLogoutClick}>Logout</LogoutLink>
              </>
            )}
          </div>
        )}
      </HeaderContent>
    </HeaderContainer>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
