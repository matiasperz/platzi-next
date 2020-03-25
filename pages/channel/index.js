import React, { Component } from 'react';
import 'isomorphic-fetch';

import Error from '../_error';
import Layout from '../../components/Layout';
import ChannelGrid from '../../components/ChannelGrid';
import PodcastList from '../../components/PodcastList';
import PodcastPlayer from '../../components/PodcastPlayer';

import globalStyles from '../../styles/global.scss';
import styles from './styles.scss';

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
        { channel.urls.banner_image.original &&
          <div 
            className={styles.banner}
            style={{backgroundImage: `url(${channel.urls.banner_image.original})`}}>
          </div>
        }

        { openPodcast && 
          <div className={styles.modal}>
            <PodcastPlayer clip={openPodcast} onClose={this.onCloseModal} />
          </div>
        }
        
        <div className={globalStyles.content}>
          <h1>{ channel.title }</h1>
          
          <h2>Series</h2>
          <ChannelGrid channels={series}/>

          <h2>Ultimos Podcasts</h2>
          <PodcastList openPodcast={this.openPodcast} clips={audioClips} />
        </div>
      </Layout>
    )
  }
}