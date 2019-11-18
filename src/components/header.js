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
  > h1 {
    margin: 0;
    > a:hover {
      text-decoration: none;
    }
  }
  a {
    color: white;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LogoutLink = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
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
          <>
            {!currentUser ? (
              <Link to="/login">Login</Link>
            ) : (
              <div>
                {`${currentUser.email} | `}
                <LogoutLink onClick={handleLogoutClick}>Logout</LogoutLink>
              </div>
            )}
          </>
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
