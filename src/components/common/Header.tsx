import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { searchSongs } from '../../utils/songsData';
import ThemeToggle from './ThemeToggle';
import './Header.css';

interface HeaderProps {
  isAuthenticated?: boolean;
  onSearchResults?: (results: any[]) => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated = false, onSearchResults }) => {
  const { state: authState, logout } = useAuth();
  const { showNotification } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Determine current section based on URL
  const getCurrentSection = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard' || path === '/dashboard/') {
      return 'home';
    }
    if (path.includes('/dashboard/home')) return 'home';
    if (path.includes('/dashboard/feed')) return 'feed';
    if (path.includes('/dashboard/library')) return 'library';
    if (path.includes('/dashboard/profile')) return 'profile';
    if (path.includes('/dashboard/settings')) return 'settings';
    return 'home';
  };

  const currentSection = getCurrentSection();

  const handleNavigation = (section: string) => {
    if (!isAuthenticated && (section === 'feed' || section === 'library')) {
      showNotification('Bạn cần đăng nhập để sử dụng tính năng này', 'warning');
      return;
    }

    // Navigate to appropriate route
    if (isAuthenticated) {
      if (section === 'home') {
        navigate('/dashboard');
      } else {
        navigate(`/dashboard/${section}`);
      }
    } else {
      // For non-authenticated users, only allow home navigation
      if (section === 'home') {
        navigate('/');
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      onSearchResults?.([]);
      return;
    }

    const results = searchSongs(query);
    onSearchResults?.(results);
  };

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    showNotification('Đã đăng xuất thành công', 'success');
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  return (
    <header className="top-header">
      <div className="header-content">
        <div className="header-left">
          <a href="/" className="logo">
            <i className="bi bi-cloud-hail"></i>
            <span>Music Stream</span>
          </a>
          <nav className="main-nav">
            <ul>
              <li>
                <button
                  className={`nav-link ${currentSection === 'home' ? 'active' : ''}`}
                  onClick={() => handleNavigation('home')}
                >
                  Trang chủ
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${currentSection === 'feed' ? 'active' : ''}`}
                  onClick={() => handleNavigation('feed')}
                >
                  Feed
                </button>
              </li>
              <li>
                <button
                  className={`nav-link ${currentSection === 'library' ? 'active' : ''}`}
                  onClick={() => handleNavigation('library')}
                >
                  Thư viện
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="header-center">
          <div className="search-container">
            <i className="bi bi-search"></i>
            <input
              type="search"
              id="search-input"
              placeholder="Tìm kiếm nghệ sĩ, bài hát, podcast..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="header-right">
          {isAuthenticated && authState.user ? (
            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">
                  {authState.user.firstName} {authState.user.lastName}
                </span>
                <span className="user-email">{authState.user.email}</span>
              </div>
              <div className="user-avatar">
                <i className="bi bi-person-circle"></i>
              </div>
              <div className="user-dropdown">
                <button 
                  className="dropdown-toggle"
                  onClick={toggleUserDropdown}
                >
                  <i className="bi bi-chevron-down"></i>
                </button>
                {showUserDropdown && (
                  <div className="dropdown-menu">
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        handleNavigation('profile');
                        setShowUserDropdown(false);
                      }}
                    >
                      <i className="bi bi-person"></i>
                      <span>Hồ sơ</span>
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        handleNavigation('settings');
                        setShowUserDropdown(false);
                      }}
                    >
                      <i className="bi bi-gear"></i>
                      <span>Cài đặt</span>
                    </button>
                    <div className="dropdown-item theme-toggle-item">
                      <ThemeToggle variant="switch" size="small" showLabel />
                    </div>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <a href="/login" className="btn btn-secondary">
                Đăng nhập
              </a>
              <a href="/login" className="btn btn-primary">
                Tạo tài khoản
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
