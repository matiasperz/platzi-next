import React from 'react';

import styles from './styles.scss';

const PodcastPlayer = ({ clip, onClose }) => {
  const { title, urls, channel, duration } = clip;

  return (
    <div className={`${styles.clip} ${styles.playing}`}>
      <nav>
        { onClose ?
          <a onClick={onClose}>X</a>
          :
          <Link href={`/channel?id=${channel.id}`}>
            <a className='close'>&lt; Volver</a>
          </Link>
        }
      </nav>

      <picture>
        <div style={{ backgroundImage: `url(${urls.image || channel.urls.logo_image.original})` }}></div>
      </picture>

      <div className={styles.player}>
        <h3>{title}</h3>
        <h6>{channel.title}</h6>
        <audio controls autoPlay={true}>
          <source src={urls.high_mp3} type='audio/mpeg' />
        </audio>
      </div>
    </div>
  );
};

export default PodcastPlayer;