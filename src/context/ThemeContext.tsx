import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
}

interface ThemeContextType {
  state: ThemeState;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'TOGGLE_THEME' };

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };
    default:
      return state;
  }
};

// Get initial theme from localStorage or system preference
const getInitialTheme = (): Theme => {
  // Check localStorage first
  const savedTheme = localStorage.getItem('musicStreamTheme') as Theme;
  if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
    return savedTheme;
  }

  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  // Default to dark theme
  return 'dark';
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Apply theme to document root and save to localStorage
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('theme-light', 'theme-dark');
    
    // Add current theme class
    root.classList.add(`theme-${state.theme}`);
    
    // Save to localStorage
    localStorage.setItem('musicStreamTheme', state.theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', state.theme === 'light' ? '#f8f9fa' : '#121212');
    }
  }, [state.theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no theme is saved in localStorage
      const savedTheme = localStorage.getItem('musicStreamTheme');
      if (!savedTheme) {
        dispatch({ type: 'SET_THEME', payload: e.matches ? 'light' : 'dark' });
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const setTheme = (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const value: ThemeContextType = {
    state,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
