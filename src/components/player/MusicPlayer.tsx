import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { useApp } from '../../context/AppContext';
import { formatTime } from '../../utils/songsData';
import './MusicPlayer.css';

const MusicPlayer: React.FC = () => {
  const {
    state,
    audioRef,
    togglePlayPause,
    nextSong,
    previousSong,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeatMode,
    updateCurrentTime,
    updateDuration,
  } = usePlayer();
  const { addToRecentlyPlayed } = useApp();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeSliderRef = useRef<HTMLInputElement>(null);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      updateCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      updateDuration(audio.duration);
    };

    const handleEnded = () => {
      if (state.currentSong) {
        addToRecentlyPlayed(state.currentSong);
      }

      if (state.repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextSong();
      }
    };

    const handlePlay = () => {
      // Add to recently played when song starts playing
      if (state.currentSong) {
        addToRecentlyPlayed(state.currentSong);
      }
    };

    const handlePause = () => {
      // Audio paused
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [state.repeatMode, state.currentSong, audioRef, nextSong, updateCurrentTime, updateDuration, addToRecentlyPlayed]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !state.duration) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clickRatio = (e.clientX - rect.left) / rect.width;
    const newTime = clickRatio * state.duration;
    seekTo(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
  };

  const handleRepeatClick = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'all', 'one'];
    const currentIndex = modes.indexOf(state.repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  const getRepeatIcon = () => {
    switch (state.repeatMode) {
      case 'one':
        return 'bi-repeat-1';
      case 'all':
        return 'bi-repeat';
      default:
        return 'bi-repeat';
    }
  };

  const progressPercentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;
  const volumePercentage = state.isMuted ? 0 : state.volume * 100;

  if (!state.currentSong) {
    return (
      <div className="music-player hidden">
        <audio ref={audioRef} />
      </div>
    );
  }

  return (
    <div className="music-player" role="region" aria-label="Trình phát nhạc">
      <audio ref={audioRef} />

      <div className="player-track-info">
        <img
          src={state.currentSong.coverPath || ''}
          alt={state.currentSong.title}
          className={state.currentSong.coverPath ? "track-image" : "track-image-placeholder"}
        />
        <div>
          <div className="player-title-container">
            {state.isPlaying && (
              <div className="now-playing-indicator" id="player-equalizer">
                <div className="equalizer-bar"></div>
                <div className="equalizer-bar"></div>
                <div className="equalizer-bar"></div>
                <div className="equalizer-bar"></div>
              </div>
            )}
            <div className="card-title">{state.currentSong.title}</div>
          </div>
          <div className="card-subtitle">{state.currentSong.artist}</div>
        </div>
      </div>

      <div className="player-buttons">
        <button
          className={`player-btn ${state.isShuffled ? 'active' : ''}`}
          onClick={toggleShuffle}
          aria-label="Xáo trộn"
          data-active={state.isShuffled}
        >
          <i className="bi bi-shuffle"></i>
        </button>

        <button
          className="player-btn"
          onClick={previousSong}
          aria-label="Bài trước"
        >
          <i className="bi bi-skip-start-fill"></i>
        </button>

        <button
          className="player-btn player-btn-main"
          onClick={togglePlayPause}
          aria-label={state.isPlaying ? 'Tạm dừng' : 'Phát'}
        >
          <i className={`bi ${state.isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`}></i>
        </button>

        <button
          className="player-btn"
          onClick={nextSong}
          aria-label="Bài tiếp theo"
        >
          <i className="bi bi-skip-end-fill"></i>
        </button>

        <button
          className={`player-btn ${state.repeatMode !== 'none' ? 'active' : ''}`}
          onClick={handleRepeatClick}
          aria-label="Lặp lại"
          data-active={state.repeatMode !== 'none'}
        >
          <i className={`bi ${getRepeatIcon()}`}></i>
        </button>
      </div>

      <div className="progress-container">
        <span className="time-display">{formatTime(state.currentTime)}</span>
        <div
          className="progress-bar"
          ref={progressBarRef}
          onClick={handleProgressClick}
        >
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <span className="time-display">{formatTime(state.duration)}</span>
      </div>

      <div className="player-extra-controls">
        <div className="player-volume">
          <button
            className="player-btn"
            onClick={toggleMute}
            aria-label="Âm lượng"
          >
            <i className={`bi ${state.isMuted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`}></i>
          </button>
          <input
            type="range"
            ref={volumeSliderRef}
            min="0"
            max="1"
            step="0.01"
            value={state.isMuted ? 0 : state.volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="volume-slider"
            aria-label="Điều chỉnh âm lượng"
          />
        </div>

        <button
          className="player-btn"
          aria-label="Danh sách phát"
        >
          <i className="bi bi-music-note-list"></i>
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
