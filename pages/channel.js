import React, { Component } from 'react';
import Error from './_error';
import 'isomorphic-fetch';

import Layout from '../components/Layout';
import ChannelGrid from '../components/ChannelGrid';
import PodcastList from '../components/PodcastList';
import PodcastPlayer from '../components/PodcastPlayer';

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

  constructor(props){
    super(props);
    this.state = {
      openPodcast: null
    }
  }

  openPodcast = (event, podcast) => {
    event.preventDefault();
    this.setState({
      openPodcast: podcast
    });
  }

  onCloseModal = (event) => {
    event.preventDefault();
    this.setState({
      openPodcast: null
    });
  }

  render(){
    const { channel, audioClips, series, statusCode } = this.props;
    const { openPodcast } = this.state;

    if(statusCode !== 200){
      return <Error statusCode={statusCode} />
    }

    return(
      <Layout title={channel.title}>
        <div className="banner" style={{backgroundImage: `url(${channel.urls.banner_image.original})`}}>
        </div>

        { openPodcast && 
          <div className="modal">
            <PodcastPlayer clip={openPodcast} onClose={this.onCloseModal} />
          </div>
        }
        
        <h1>{ channel.title }</h1>
        
        <h2>Series</h2>
        <ChannelGrid channels={series}/>

        <h2>Ultimos Podcasts</h2>
        <PodcastList openPodcast={this.openPodcast} clips={audioClips} />

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
          h1 {
            font-weight: 600;
            padding: 15px;
          }
          h2 {
            padding: 15px;
            font-size: 1.2em;
            font-weight: 600;
            margin: 0;
          }
          .modal{
            position: fixed;
            right: 0;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 999999;
          }
        `}</style>
      </Layout>
    )
  }
}