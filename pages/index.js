import React, { Component } from 'react';
import Error from 'next/error';
import 'isomorphic-fetch'

import Layout from '../components/Layout';
import ChannelGrid from '../components/ChannelGrid'

import styles from '../styles/global.scss';

const BASE_URL = 'https://api.audioboom.com';

export default class extends Component {
  static async getInitialProps({ res }) {
    try {
      let req = await fetch(`${BASE_URL}/channels/recommended`);
      let { body: channels } = await req.json();
      return { channels, statusCode: 200 }
    } catch (err){
      res.statusCode = 503;
      return { channels: null, statusCode: 503 }
    }
  }

  render() {
    const { channels, statusCode } = this.props

    if(statusCode !== 200){
      return <Error statusCode={statusCode} />
    }

    return (
      <Layout title="Podcasts" >
        <div className={styles.content}>
          <ChannelGrid channels={ channels } />
        </div>
      </Layout>
    );
  }
}