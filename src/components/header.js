import React, { useContext } from 'react';
import { Link, navigate } from 'gatsby';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import firebase, { FirebaseContext } from '../firebase';

const LogoutLink = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Header = ({ siteTitle }) => {
  const { currentUser, isLoading } = useContext(FirebaseContext);

  function handleLogoutClick() {
    firebase.logout().then(() => navigate('/login'));
  }

  return (
    <header
      style={{
        background: `rebeccapurple`,
        marginBottom: `1.45rem`,
        color: 'white',
      }}
    >
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `1.45rem 1.0875rem`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              color: `white`,
              textDecoration: `none`,
            }}
          >
            {siteTitle}
          </Link>
        </h1>
        {isLoading ? null : (
          <>
            {!currentUser ? (
              <Link
                to="/login"
                style={{
                  color: `white`,
                  textDecoration: `none`,
                }}
              >
                Login
              </Link>
            ) : (
              <div>
                {`${currentUser.email} | `}
                <LogoutLink onClick={handleLogoutClick}>Logout</LogoutLink>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
