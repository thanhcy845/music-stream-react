import React from 'react';
import { Song } from '../../types';
import { usePlayer } from '../../context/PlayerContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import './MusicCard.css';

interface MusicCardProps {
  song: Song;
  isPlaying?: boolean;
  showLikeButton?: boolean;
  showQueueButton?: boolean;
}

const MusicCard: React.FC<MusicCardProps> = ({ 
  song, 
  isPlaying = false, 
  showLikeButton = true, 
  showQueueButton = true 
}) => {
  const { playSong, addToQueue } = usePlayer();
  const { addToLikedSongs, removeFromLikedSongs, state: appState, showNotification } = useApp();
  const { state: authState } = useAuth();

  const isLiked = appState.library.likedSongs.some(s => s.id === song.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSong(song);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!authState.isAuthenticated) {
      showNotification('Bạn cần đăng nhập để sử dụng tính năng này', 'warning');
      return;
    }

    if (isLiked) {
      removeFromLikedSongs(song.id);
    } else {
      addToLikedSongs(song);
    }
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
    showNotification(`Đã thêm "${song.title}" vào hàng đợi`, 'success');
  };

  const handleCardClick = () => {
    playSong(song);
  };

  return (
    <div 
      className={`music-card ${isPlaying ? 'now-playing' : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      aria-label={`Phát ${song.title} bởi ${song.artist}`}
    >
      <div className="card-image-container">
        <img 
          src={song.coverPath} 
          alt={`Album cover for ${song.title}`}
          className="card-image"
          loading="lazy"
        />
        <div className="card-overlay">
          <div className="overlay-buttons">
            <button 
              className="play-button"
              onClick={handlePlay}
              aria-label={`Phát ${song.title}`}
            >
              {isPlaying ? (
                <i className="bi bi-pause-fill"></i>
              ) : (
                <i className="bi bi-play-fill"></i>
              )}
            </button>
            <div className="secondary-buttons">
              {showLikeButton && (
                <button 
                  className={`secondary-button like-button ${isLiked ? 'liked' : ''}`}
                  onClick={handleLike}
                  aria-label={isLiked ? 'Bỏ thích' : 'Thích'}
                  title={isLiked ? 'Bỏ thích' : 'Thích'}
                >
                  <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                </button>
              )}
              {showQueueButton && (
                <button 
                  className="secondary-button queue-button"
                  onClick={handleAddToQueue}
                  aria-label="Thêm vào hàng đợi"
                  title="Thêm vào hàng đợi"
                >
                  <i className="bi bi-plus"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        {isPlaying && (
          <div className="now-playing-indicator">
            <div className="equalizer-bar"></div>
            <div className="equalizer-bar"></div>
            <div className="equalizer-bar"></div>
            <div className="equalizer-bar"></div>
          </div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title" title={song.title}>
          {song.title}
        </h3>
        <p className="card-subtitle" title={song.artist}>
          {song.artist}
        </p>
        {song.duration && (
          <span className="card-duration">{song.duration}</span>
        )}
      </div>
    </div>
  );
};

export default MusicCard;
