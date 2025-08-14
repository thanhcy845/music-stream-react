import React, { useMemo } from 'react';
import MusicCard from '../../common/MusicCard';
import { usePlayer } from '../../../context/PlayerContext';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { songsData, getRandomSongs } from '../../../utils/songsData';

const FeedSection: React.FC = () => {
  const { state: playerState } = usePlayer();
  const { state: authState } = useAuth();
  const { state: appState } = useApp();

  // Generate feed content based on user activity and preferences
  const recentActivity = appState.library.recentlyPlayed.slice(0, 3);

  // Memoize random song arrays to prevent re-shuffling on re-renders
  const recommendedBasedOnHistory = useMemo(() => getRandomSongs(6), []);
  const trendingNow = useMemo(() => songsData.slice(0, 4), []);
  const newReleases = useMemo(() => [...songsData].reverse().slice(0, 4), []);
  const likedRecommendations = useMemo(() => getRandomSongs(4), []);
  const exploreRecommendations = useMemo(() => getRandomSongs(4), []);

  // Mock activity data
  const mockActivities = [
    {
      id: '1',
      type: 'play' as const,
      text: `${authState.user?.firstName} đã nghe`,
      timestamp: '2 giờ trước',
      songId: recentActivity[0]?.id || songsData[0].id,
    },
    {
      id: '2',
      type: 'like' as const,
      text: `${authState.user?.firstName} đã thích`,
      timestamp: '5 giờ trước',
      songId: appState.library.likedSongs[0]?.id || songsData[1].id,
    },
    {
      id: '3',
      type: 'play' as const,
      text: `${authState.user?.firstName} đã nghe`,
      timestamp: '1 ngày trước',
      songId: recentActivity[1]?.id || songsData[2].id,
    },
  ];

  const getSongById = (songId: string) => {
    return songsData.find(song => song.id === songId) || songsData[0];
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'play':
        return 'bi-play-circle';
      case 'like':
        return 'bi-heart-fill';
      case 'playlist':
        return 'bi-music-note-list';
      default:
        return 'bi-music-note';
    }
  };

  return (
    <div className="feed-section">
      <div className="section-header">
        <h2>Feed</h2>
        <p className="section-subtitle">Khám phá hoạt động và âm nhạc mới</p>
      </div>

      <div className="feed-content">
        {/* Recent Activity */}
        <div className="feed-block">
          <h3 className="feed-block-title">
            <i className="bi bi-clock-history"></i>
            Hoạt động gần đây
          </h3>
          <div className="activity-list">
            {mockActivities.map((activity) => {
              const song = getSongById(activity.songId);
              return (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    <i className={`bi ${getActivityIcon(activity.type)}`}></i>
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">
                      <span className="activity-action">{activity.text}</span>
                      <span className="activity-song">"{song.title}"</span>
                      <span className="activity-artist">bởi {song.artist}</span>
                    </div>
                    <div className="activity-time">{activity.timestamp}</div>
                  </div>
                  <div className="activity-song-preview">
                    <img 
                      src={song.coverPath} 
                      alt={song.title}
                      className="activity-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Based on History */}
        {appState.library.recentlyPlayed.length > 0 && (
          <div className="feed-block">
            <h3 className="feed-block-title">
              <i className="bi bi-stars"></i>
              Gợi ý dành cho bạn
            </h3>
            <p className="feed-block-subtitle">Dựa trên lịch sử nghe của bạn</p>
            <div className="music-grid-wrapper">
              <div className="music-grid">
                {recommendedBasedOnHistory.map((song) => (
                  <MusicCard
                    key={`recommended-${song.id}`}
                    song={song}
                    isPlaying={playerState.currentSong?.id === song.id && playerState.isPlaying}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trending Now */}
        <div className="feed-block">
          <h3 className="feed-block-title">
            <i className="bi bi-fire"></i>
            Đang thịnh hành
          </h3>
          <p className="feed-block-subtitle">Những bài hát hot nhất hiện tại</p>
          <div className="music-grid-wrapper">
            <div className="music-grid">
              {trendingNow.map((song) => (
                <MusicCard
                  key={`trending-${song.id}`}
                  song={song}
                  isPlaying={playerState.currentSong?.id === song.id && playerState.isPlaying}
                />
              ))}
            </div>
          </div>
        </div>

        {/* New Releases */}
        <div className="feed-block">
          <h3 className="feed-block-title">
            <i className="bi bi-music-note-beamed"></i>
            Mới phát hành
          </h3>
          <p className="feed-block-subtitle">Những bài hát mới nhất</p>
          <div className="music-grid-wrapper">
            <div className="music-grid">
              {newReleases.map((song) => (
                <MusicCard
                  key={`new-${song.id}`}
                  song={song}
                  isPlaying={playerState.currentSong?.id === song.id && playerState.isPlaying}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Liked Songs Recommendation */}
        {appState.library.likedSongs.length > 0 && (
          <div className="feed-block">
            <h3 className="feed-block-title">
              <i className="bi bi-heart"></i>
              Có thể bạn cũng thích
            </h3>
            <p className="feed-block-subtitle">Dựa trên những bài hát bạn đã thích</p>
            <div className="music-grid-wrapper">
              <div className="music-grid">
                {likedRecommendations.map((song) => (
                  <MusicCard
                    key={`liked-rec-${song.id}`}
                    song={song}
                    isPlaying={playerState.currentSong?.id === song.id && playerState.isPlaying}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State for New Users */}
        {appState.library.recentlyPlayed.length === 0 && appState.library.likedSongs.length === 0 && (
          <div className="feed-empty-state">
            <div className="feed-empty-icon">
              <i className="bi bi-music-note-list"></i>
            </div>
            <h3>Chào mừng đến với Feed!</h3>
            <p>Bắt đầu nghe nhạc và thích những bài hát yêu thích để xem gợi ý cá nhân hóa tại đây.</p>
            <div className="feed-empty-suggestions">
              <h4>Khám phá ngay:</h4>
              <div className="music-grid-wrapper">
                <div className="music-grid">
                  {exploreRecommendations.map((song) => (
                    <MusicCard
                      key={`explore-${song.id}`}
                      song={song}
                      isPlaying={playerState.currentSong?.id === song.id && playerState.isPlaying}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedSection;
