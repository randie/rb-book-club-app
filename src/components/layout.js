import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import firebase, { FirebaseContext } from '../firebase';
import useCurrentUser from '../hooks/use-current-user';

import Header from './header';
import '../styles/layout.css';

const Layout = ({ children }) => {
  const { currentUser, isLoading } = useCurrentUser();

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <FirebaseContext.Provider value={{ firebase, currentUser, isLoading }}>
      <Header siteTitle={data.site.siteMetadata.title} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: 960,
          padding: `0px 1.0875rem 1.45rem`,
          paddingTop: 0,
        }}
      >
        <main>{children}</main>
      </div>
    </FirebaseContext.Provider>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
