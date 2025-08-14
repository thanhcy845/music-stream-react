import React, { useMemo } from 'react';
import MusicCard from '../../common/MusicCard';
import { usePlayer } from '../../../context/PlayerContext';
import { useAuth } from '../../../context/AuthContext';
import { songsData, getRandomSongs } from '../../../utils/songsData';

const HomeSection: React.FC = () => {
  const { state: playerState } = usePlayer();
  const { state: authState } = useAuth();

  // Memoize the song arrays to prevent re-shuffling on re-renders
  const trendingSongs = useMemo(() => songsData.slice(0, 6), []);
  const recommendedSongs = useMemo(() => getRandomSongs(6), []);
  const newReleases = useMemo(() => [...songsData].reverse().slice(0, 6), []);

  return (
    <div className="home-section">
      <div className="section-header">
        <h2>Chào mừng trở lại, {authState.user?.firstName}!</h2>
        <p className="section-subtitle">Khám phá âm nhạc yêu thích của bạn</p>
      </div>

      <div className="music-section">
        <h3>Trending</h3>
        <div className="music-grid-wrapper">
          <div className="music-grid">
            {trendingSongs.map((song) => (
              <MusicCard
                key={song.id}
                song={song}
                isPlaying={playerState.currentSong?.id === song.id && playerState.isPlaying}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="music-section">
        <h3>Dành cho bạn</h3>
        <div className="music-grid-wrapper">
          <div className="music-grid">
            {recommendedSongs.map((song) => (
              <MusicCard
                key={song.id}
                song={song}
                isPlaying={playerState.currentSong?.id === song.id && playerState.isPlaying}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="music-section">
        <h3>Mới phát hành</h3>
        <div className="music-grid-wrapper">
          <div className="music-grid">
            {newReleases.map((song) => (
              <MusicCard
                key={song.id}
                song={song}
                isPlaying={playerState.currentSong?.id === song.id && playerState.isPlaying}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeSection;
