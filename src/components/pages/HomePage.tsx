import React, { useState } from 'react';
import Header from '../common/Header';
import MusicCard from '../common/MusicCard';
import MusicPlayer from '../player/MusicPlayer';
import { usePlayer } from '../../context/PlayerContext';
import { useAuth } from '../../context/AuthContext';
import { songsData } from '../../utils/songsData';
import { Song } from '../../types';
import './HomePage.css';

const HomePage: React.FC = () => {
  const { state: playerState } = usePlayer();
  const { state: authState } = useAuth();
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearchResults = (results: Song[]) => {
    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  };

  const clearSearch = () => {
    setSearchResults([]);
    setShowSearchResults(false);
  };

  // Shuffle songs for different sections
  const trendingSongs = songsData.slice(0, 6);
  const notableArtistsSongs = [...songsData].reverse().slice(0, 6);

  return (
    <div className="home-page">
      <Header 
        isAuthenticated={authState.isAuthenticated}
        onSearchResults={handleSearchResults}
      />
      
      <main className="main-content">
        {showSearchResults ? (
          <section className="content-section search-results-section">
            <div className="section-header">
              <h2>Kết quả tìm kiếm</h2>
              <button 
                className="clear-search-btn"
                onClick={clearSearch}
                aria-label="Xóa kết quả tìm kiếm"
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            {searchResults.length > 0 ? (
              <div className="music-grid-wrapper">
                <div className="music-grid">
                  {searchResults.map((song) => (
                    <MusicCard
                      key={song.id}
                      song={song}
                      isPlaying={playerState.currentSong?.id === song.id && playerState.isPlaying}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="search-no-results">
                <div className="search-no-results-icon-container">
                  <i className="bi bi-search search-no-results-icon"></i>
                </div>
                <h3 className="search-no-results-title">Không tìm thấy kết quả</h3>
                <p className="search-no-results-message">
                  Không có bài hát nào khớp với từ khóa tìm kiếm
                </p>
                <p className="search-no-results-hint">
                  Thử tìm kiếm với từ khóa khác hoặc kiểm tra chính tả
                </p>
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="content-section">
              <h2>Xu hướng thể loại</h2>
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
            </section>

            <section className="content-section">
              <h2>Nghệ sĩ nổi bật</h2>
              <div className="music-grid-wrapper">
                <div className="music-grid">
                  {notableArtistsSongs.map((song) => (
                    <MusicCard
                      key={song.id}
                      song={song}
                      isPlaying={playerState.currentSong?.id === song.id && playerState.isPlaying}
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <MusicPlayer />
    </div>
  );
};

export default HomePage;
