import React, { Component } from 'react';
import Link from 'next/link';
import Error from 'next/error';
import 'isomorphic-fetch';

import Layout from '../components/Layout';
import ChannelGrid from '../components/ChannelGrid';
import PodcastList from '../components/PodcastList';

const BASE_API = 'https://api.audioboom.com';

export default class extends Component{
  static async getInitialProps({ query, res }){
    const idChannel = query.id;

    try {
      const [reqChannel, reqAudio, reqSeries] = await Promise.all([
        fetch(`${BASE_API}/channels/${idChannel}`),
        fetch(`${BASE_API}/channels/${idChannel}/audio_clips`),
        fetch(`${BASE_API}/channels/${idChannel}/child_channels`)
      ]);

      if( reqChannel.status >= 400 ) {
        res.statusCode = reqChannel.status;
        return { channel: null, audioClips: null, series: null, statusCode: reqChannel.status }
      }

      const { body: { channel } } = await reqChannel.json();
      const { body: { audio_clips } } = await reqAudio.json();
      const { body: { channels: series } } = await reqSeries.json();
  
      return { channel, audioClips: audio_clips, series, statusCode: 200 }
    } catch(err){
      res.statusCode = 503;

      return { channel: null, audioClips: null, series: null, statusCode: 503 }
    }
  }

  render(){
    const { channel, audioClips, series, statusCode } = this.props;

    if(statusCode !== 200){
      return <Error statusCode={statusCode} />
    }

    return(
      <Layout title={channel.title}>
        <div className="banner" style={{backgroundImage: `url(${channel.urls.banner_image.original})`}}>
        </div>

        <h1>{ channel.title }</h1>
        
        <h2>Series</h2>
        <ChannelGrid channels={series}/>

        <h2>Ultimos Podcasts</h2>
        <PodcastList clips={audioClips} />

        <style jsx>{`
          header {
            color: #fff;
            background: #8756ca;
            padding: 15px;
            text-align: center;
          }
          .banner {
            width: 100%;
            padding-bottom: 25%;
            background-position: 50% 50%;
            background-size: cover;
            background-color: #aaa;
          }
        `}</style>

        <style jsx global>{`
          body {
            margin: 0;
            font-family: system-ui;
            background: white;
          }
        `}</style>
      </Layout>
    )
  }
}