import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router'
import NProgress from 'nprogress';

import styles from './styles.scss';

Router.onRouteChangeStart = (url) => {
  NProgress.start()
}
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

const Layout = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <header className={styles.header}>
        <Link href="/">
          <a>{ title }</a>
        </Link>
      </header>
      
      {children}
    </>
  );
};
  
export default Layout;