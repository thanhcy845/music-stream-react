import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

interface ThemeToggleProps {
  variant?: 'button' | 'switch';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'button', 
  size = 'medium',
  showLabel = false 
}) => {
  const { state, toggleTheme } = useTheme();

  if (variant === 'switch') {
    return (
      <div className={`theme-toggle-switch ${size}`}>
        {showLabel && (
          <span className="theme-toggle-label">
            {state.theme === 'light' ? 'Light' : 'Dark'} Mode
          </span>
        )}
        <label className="theme-switch">
          <input
            type="checkbox"
            checked={state.theme === 'light'}
            onChange={toggleTheme}
            aria-label="Toggle theme"
          />
          <span className="theme-slider">
            <i className={`theme-icon ${state.theme === 'light' ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
          </span>
        </label>
      </div>
    );
  }

  return (
    <button
      className={`theme-toggle-button ${size}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${state.theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${state.theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <i className={`bi ${state.theme === 'light' ? 'bi-moon-fill' : 'bi-sun-fill'}`}></i>
      {showLabel && (
        <span className="theme-toggle-text">
          {state.theme === 'light' ? 'Dark' : 'Light'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
