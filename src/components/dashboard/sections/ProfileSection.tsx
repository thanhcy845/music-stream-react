import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';

const ProfileSection: React.FC = () => {
  const { state: authState } = useAuth();
  const { state: appState } = useApp();

  if (!authState.user) return null;

  // Helper function to format dates
  const formatDate = (dateString?: string, includeTime = false): string => {
    if (!dateString) return 'Chưa cập nhật';

    try {
      const date = new Date(dateString);
      if (includeTime) {
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      return date.toLocaleDateString('vi-VN');
    } catch (error) {
      return 'Chưa cập nhật';
    }
  };

  // Helper function to format gender
  const formatGender = (gender?: string): string => {
    switch (gender) {
      case 'male':
        return 'Nam';
      case 'female':
        return 'Nữ';
      case 'other':
        return 'Khác';
      case 'prefer-not-to-say':
        return 'Không muốn tiết lộ';
      default:
        return 'Chưa cập nhật';
    }
  };

  // Helper function to format last login
  const formatLastLogin = (lastLoginDate?: string): string => {
    if (!lastLoginDate) return 'Đang hoạt động';
    return formatDate(lastLoginDate, true);
  };

  return (
    <div className="profile-section">
      <div className="section-header">
        <h2>Hồ sơ cá nhân</h2>
        <p className="section-subtitle">Quản lý thông tin và tùy chỉnh hồ sơ của bạn</p>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <div className="profile-basic-info">
                <h3 className="profile-name">
                  {authState.user.firstName} {authState.user.lastName}
                </h3>
                <p className="profile-email">{authState.user.email}</p>
                <p className="profile-join-date">
                  Tham gia từ {formatDate(authState.user.joinDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Comprehensive User Information */}
          <div className="profile-details-section">
            <h4>Thông tin cá nhân</h4>
            <div className="profile-details-grid">
              <div className="profile-detail-item">
                <div className="detail-icon">
                  <i className="bi bi-person"></i>
                </div>
                <div className="detail-content">
                  <span className="detail-label">Họ và tên đầy đủ</span>
                  <span className="detail-value">{authState.user.firstName} {authState.user.lastName}</span>
                </div>
              </div>

              <div className="profile-detail-item">
                <div className="detail-icon">
                  <i className="bi bi-envelope"></i>
                </div>
                <div className="detail-content">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{authState.user.email}</span>
                </div>
              </div>

              <div className="profile-detail-item">
                <div className="detail-icon">
                  <i className="bi bi-telephone"></i>
                </div>
                <div className="detail-content">
                  <span className="detail-label">Số điện thoại</span>
                  <span className="detail-value">{authState.user.phoneNumber || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="profile-detail-item">
                <div className="detail-icon">
                  <i className="bi bi-calendar-date"></i>
                </div>
                <div className="detail-content">
                  <span className="detail-label">Ngày sinh</span>
                  <span className="detail-value">{formatDate(authState.user.dateOfBirth)}</span>
                </div>
              </div>

              <div className="profile-detail-item">
                <div className="detail-icon">
                  <i className="bi bi-gender-ambiguous"></i>
                </div>
                <div className="detail-content">
                  <span className="detail-label">Giới tính</span>
                  <span className="detail-value">{formatGender(authState.user.gender)}</span>
                </div>
              </div>

              <div className="profile-detail-item">
                <div className="detail-icon">
                  <i className="bi bi-geo-alt"></i>
                </div>
                <div className="detail-content">
                  <span className="detail-label">Địa chỉ</span>
                  <span className="detail-value">{authState.user.location || 'Chưa cập nhật'}</span>
                </div>
              </div>

              <div className="profile-detail-item">
                <div className="detail-icon">
                  <i className="bi bi-calendar-plus"></i>
                </div>
                <div className="detail-content">
                  <span className="detail-label">Ngày tạo tài khoản</span>
                  <span className="detail-value">{formatDate(authState.user.joinDate)}</span>
                </div>
              </div>

              <div className="profile-detail-item">
                <div className="detail-icon">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div className="detail-content">
                  <span className="detail-label">Lần đăng nhập cuối</span>
                  <span className="detail-value">{formatLastLogin(authState.user.lastLoginDate)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-number">{appState.library.recentlyPlayed.length}</div>
              <div className="stat-label">Bài hát đã nghe</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{appState.library.likedSongs.length}</div>
              <div className="stat-label">Bài hát yêu thích</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0h</div>
              <div className="stat-label">Thời gian nghe</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2</div>
              <div className="stat-label">Thành tích</div>
            </div>
          </div>

          <div className="profile-bio-section">
            <h4>Giới thiệu</h4>
            <div className="bio-content">
              <p className="profile-bio">
                {authState.user.bio || 'Chưa có thông tin giới thiệu.'}
              </p>
            </div>
          </div>

          <div className="profile-preferences">
            <h4>Sở thích âm nhạc</h4>
            <div className="genre-tags">
              {authState.user.favoriteGenres.map((genre, index) => (
                <span key={index} className="genre-tag">{genre}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
