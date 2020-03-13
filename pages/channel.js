import React, { Component } from 'react';
import 'isomorphic-fetch';

const BASE_API = 'https://api.audioboom.com';

export default class extends React.Component{
  static async getInitialProps({ query }){
      const idChannel = query.id;

      const [reqChannel, reqAudio, reqSeries] = await Promise.all([
        fetch(`${BASE_API}/channels/${idChannel}`),
        fetch(`${BASE_API}/channels/${idChannel}/audio_clips`),
        fetch(`${BASE_API}/channels/${idChannel}/child_channels`)
      ]);

      const { body: { channel } } = await reqChannel.json();
      const { body: { audio_clips } } = await reqAudio.json();
      const { body: { channels: series } } = await reqSeries.json();

      return { channel, audioClips: audio_clips, series }
  }

  render(){
    const { channel, audioClips, series } = this.props;
    return(
      <div>
        <header>Podcasts</header>
        <h1>{ channel.title }</h1>

        <h2>Ultimos Podcasts</h2>
        { audioClips.map((clip)=>(
          <div>{ clip.title }</div>
        )) }
        
        <h2>Series</h2>
        { series.map((serie)=>(
          <div>{ serie.title }</div>
        )) }
        
        <style jsx>{`
          header {
            color: #fff;
            background: #8756ca;
            padding: 15px;
            text-align: center;
          }
          .channels {
            display: grid;
            grid-gap: 15px;
            padding: 15px;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          }
          a.channel {
            display: block;
            margin-bottom: 0.5em;
            color: #333;
            text-decoration: none;
          }
          .channel img {
            border-radius: 3px;
            box-shadow: 0px 2px 6px rgba(0,0,0,0.15);
            width: 100%;
          }
          h1 {
            font-weight: 600;
            padding 15px;
          }
          h2 {
            padding: 5px;
            font-size: 0.9em;
            font-weight: 600;
            margin: 0;
            text-align: center;
          }
        `}</style>

        <style jsx global>{`
          body {
            margin: 0;
            font-family: system-ui;
            background: white;
          }
        `}</style>
      </div>
    )
  }
}