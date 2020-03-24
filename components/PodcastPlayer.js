import React from 'react';

const PodcastPlayer = ({ clip, onClose }) => {
  const { title, urls, channel, duration } = clip;

  return (
    <div className="clip">
      <nav>
        { onClose ?
          <a onClick={onClose}>&lt; Volver</a>
          :
          <Link href={`/channel?id=${channel.id}`}>
            <a className='close'>&lt; Volver</a>
          </Link>
        }
      </nav>

      <picture>
        <div style={{ backgroundImage: `url(${urls.image || channel.urls.logo_image.original})` }}></div>
      </picture>

      <div className="player">
        <h3>{title}</h3>
        <h6>{channel.title}</h6>
        <audio controls autoPlay={true}>
          <source src={urls.high_mp3} type='audio/mpeg' />
        </audio>
      </div>

      <style jsx>{`
        nav {
          background: none;
        }
        nav a {
          display: inline-block;
          padding: 15px;
          color: white;
          cursor: pointer;
          text-decoration: none;
        }
        .clip {
          display: flex;
          height: 100%;
          flex-direction: column;
          background: #8756ca;
          color: white;
        }
        picture {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1 1;
          flex-direction: column;
          width: auto;
          padding: 10%;
        }
        picture div {
          width: 100%;
          height: 100%;
          background-position: 50% 50%;
          background-size: contain;
          background-repeat: no-repeat;
        }
        .player {
          padding: 30px;
          background: rgba(0,0,0,0.3);
          text-align: center;
        }
        h3 {
          margin: 0;
        }
        h6 {
          margin: 0;
          margin-top: 1em;
        }
        audio {
          margin-top: 2em;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default PodcastPlayer;