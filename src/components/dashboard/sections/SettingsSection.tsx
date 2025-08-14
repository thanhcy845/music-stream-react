import React from 'react';
import { useApp } from '../../../context/AppContext';

const SettingsSection: React.FC = () => {
  const { state: appState, updateSettings } = useApp();

  const handleThemeChange = (theme: 'light' | 'dark') => {
    updateSettings({ theme });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseInt(e.target.value);
    updateSettings({ defaultVolume: volume });
  };

  const handleToggleSetting = (setting: keyof typeof appState.settings) => {
    updateSettings({ [setting]: !appState.settings[setting] });
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Cài đặt</h2>
        <p className="section-subtitle">Tùy chỉnh trải nghiệm Music Stream của bạn</p>
      </div>

      <div className="settings-container">
        <div className="settings-category">
          <h3 className="category-title">
            <i className="bi bi-palette"></i> Giao diện
          </h3>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-title">Chế độ hiển thị</span>
                <span className="setting-desc">Chọn giao diện sáng hoặc tối</span>
              </div>
              <div className="setting-control">
                <div className="theme-toggle">
                  <button 
                    className={`theme-option ${appState.settings.theme === 'dark' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <i className="bi bi-moon-fill"></i>
                    <span>Tối</span>
                  </button>
                  <button 
                    className={`theme-option ${appState.settings.theme === 'light' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <i className="bi bi-sun-fill"></i>
                    <span>Sáng</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-category">
          <h3 className="category-title">
            <i className="bi bi-volume-up"></i> Âm thanh
          </h3>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-title">Âm lượng mặc định</span>
                <span className="setting-desc">Âm lượng khi khởi động ứng dụng</span>
              </div>
              <div className="setting-control">
                <input 
                  type="range" 
                  className="setting-slider" 
                  min="0" 
                  max="100" 
                  value={appState.settings.defaultVolume}
                  onChange={handleVolumeChange}
                />
                <span className="slider-value">{appState.settings.defaultVolume}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-category">
          <h3 className="category-title">
            <i className="bi bi-shield-lock"></i> Quyền riêng tư
          </h3>
          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-title">Lưu lịch sử nghe</span>
                <span className="setting-desc">Cho phép lưu trữ lịch sử nghe nhạc</span>
              </div>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={appState.settings.saveHistory}
                    onChange={() => handleToggleSetting('saveHistory')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-title">Thông báo email</span>
                <span className="setting-desc">Nhận thông báo qua email</span>
              </div>
              <div className="setting-control">
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={appState.settings.emailNotifications}
                    onChange={() => handleToggleSetting('emailNotifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
