import React from 'react';
import MusicCard from '../../common/MusicCard';
import { useApp } from '../../../context/AppContext';
import { usePlayer } from '../../../context/PlayerContext';

const LibrarySection: React.FC = () => {
  const { state: appState } = useApp();
  const { state: playerState } = usePlayer();

  return (
    <div className="library-section">
      <div className="section-header">
        <h2>Thư viện</h2>
        <p className="section-subtitle">Quản lý bộ sưu tập âm nhạc của bạn</p>
      </div>

      <div className="library-content">
        <div className="library-tab-content">
          <div className="library-tab-header">
            <h3>Bài hát yêu thích</h3>
            <span className="library-count">{appState.library.likedSongs.length} bài hát</span>
          </div>
          
          {appState.library.likedSongs.length > 0 ? (
            <div className="music-grid-wrapper">
              <div className="music-grid">
                {appState.library.likedSongs.map((song) => (
                  <MusicCard
                    key={song.id}
                    song={song}
                    isPlaying={playerState.currentSong?.id === song.id && playerState.isPlaying}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="library-empty">
              <div className="library-empty-icon">
                <i className="bi bi-heart"></i>
              </div>
              <h3>Bạn chưa có bài hát yêu thích nào</h3>
              <p>Nhấn vào biểu tượng trái tim để thêm bài hát vào danh sách yêu thích</p>
            </div>
          )}
        </div>

        <div className="library-tab-content">
          <div className="library-tab-header">
            <h3>Nghe gần đây</h3>
            <span className="library-count">{appState.library.recentlyPlayed.length} bài hát</span>
          </div>
          
          {appState.library.recentlyPlayed.length > 0 ? (
            <div className="recent-tracks-grid">
              {appState.library.recentlyPlayed.slice(0, 10).map((song) => (
                <MusicCard
                  key={`recent-${song.id}`}
                  song={song}
                  isPlaying={playerState.currentSong?.id === song.id && playerState.isPlaying}
                />
              ))}
            </div>
          ) : (
            <div className="library-empty">
              <div className="library-empty-icon">
                <i className="bi bi-clock-history"></i>
              </div>
              <h3>Chưa có lịch sử nghe</h3>
              <p>Bắt đầu nghe nhạc để xem lịch sử của bạn</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibrarySection;
