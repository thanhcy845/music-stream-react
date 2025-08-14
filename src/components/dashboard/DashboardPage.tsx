import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../common/Header';
import MusicPlayer from '../player/MusicPlayer';
import HomeSection from './sections/HomeSection';
import FeedSection from './sections/FeedSection';
import LibrarySection from './sections/LibrarySection';
import ProfileSection from './sections/ProfileSection';
import SettingsSection from './sections/SettingsSection';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {

  return (
    <div className="dashboard-page">
      <Header isAuthenticated={true} />
      
      <main className="dashboard-main">
        <div className="dashboard-content">
          <Routes>
            <Route path="/" element={<HomeSection />} />
            <Route path="/home" element={<HomeSection />} />
            <Route path="/feed" element={<FeedSection />} />
            <Route path="/library" element={<LibrarySection />} />
            <Route path="/profile" element={<ProfileSection />} />
            <Route path="/settings" element={<SettingsSection />} />
          </Routes>
        </div>
      </main>

      <MusicPlayer />
    </div>
  );
};

export default DashboardPage;
