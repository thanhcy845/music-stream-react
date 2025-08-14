import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { NavigationSection, LibraryTab, AppSettings, Song, LibraryState } from '../types';

interface AppContextType {
  state: AppState;
  setCurrentSection: (section: NavigationSection) => void;
  setCurrentLibraryTab: (tab: LibraryTab) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  addToLikedSongs: (song: Song) => void;
  removeFromLikedSongs: (songId: string) => void;
  addToRecentlyPlayed: (song: Song) => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  hideNotification: () => void;
}

interface AppState {
  currentSection: NavigationSection;
  currentLibraryTab: LibraryTab;
  settings: AppSettings;
  library: LibraryState;
  notification: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    isVisible: boolean;
  } | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

type AppAction =
  | { type: 'SET_CURRENT_SECTION'; payload: NavigationSection }
  | { type: 'SET_CURRENT_LIBRARY_TAB'; payload: LibraryTab }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'ADD_TO_LIKED_SONGS'; payload: Song }
  | { type: 'REMOVE_FROM_LIKED_SONGS'; payload: string }
  | { type: 'SET_LIKED_SONGS'; payload: Song[] }
  | { type: 'ADD_TO_RECENTLY_PLAYED'; payload: Song }
  | { type: 'SET_RECENTLY_PLAYED'; payload: Song[] }
  | { type: 'SHOW_NOTIFICATION'; payload: { message: string; type: 'success' | 'error' | 'info' | 'warning' } }
  | { type: 'HIDE_NOTIFICATION' };

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CURRENT_SECTION':
      return {
        ...state,
        currentSection: action.payload,
      };
    case 'SET_CURRENT_LIBRARY_TAB':
      return {
        ...state,
        currentLibraryTab: action.payload,
      };
    case 'UPDATE_SETTINGS':
      const newSettings = { ...state.settings, ...action.payload };
      localStorage.setItem('musicStreamSettings', JSON.stringify(newSettings));
      return {
        ...state,
        settings: newSettings,
      };
    case 'ADD_TO_LIKED_SONGS':
      const updatedLikedSongs = [...state.library.likedSongs, action.payload];
      localStorage.setItem('musicStreamLikedSongs', JSON.stringify(updatedLikedSongs));
      return {
        ...state,
        library: {
          ...state.library,
          likedSongs: updatedLikedSongs,
        },
      };
    case 'REMOVE_FROM_LIKED_SONGS':
      const filteredLikedSongs = state.library.likedSongs.filter(song => song.id !== action.payload);
      localStorage.setItem('musicStreamLikedSongs', JSON.stringify(filteredLikedSongs));
      return {
        ...state,
        library: {
          ...state.library,
          likedSongs: filteredLikedSongs,
        },
      };
    case 'SET_LIKED_SONGS':
      return {
        ...state,
        library: {
          ...state.library,
          likedSongs: action.payload,
        },
      };
    case 'ADD_TO_RECENTLY_PLAYED':
      // Remove if already exists to avoid duplicates
      const filteredRecent = state.library.recentlyPlayed.filter(song => song.id !== action.payload.id);
      // Add to beginning and limit to 50 items
      const updatedRecentlyPlayed = [action.payload, ...filteredRecent].slice(0, 50);
      localStorage.setItem('musicStreamRecentlyPlayed', JSON.stringify(updatedRecentlyPlayed));
      return {
        ...state,
        library: {
          ...state.library,
          recentlyPlayed: updatedRecentlyPlayed,
        },
      };
    case 'SET_RECENTLY_PLAYED':
      return {
        ...state,
        library: {
          ...state.library,
          recentlyPlayed: action.payload,
        },
      };
    case 'SHOW_NOTIFICATION':
      return {
        ...state,
        notification: {
          message: action.payload.message,
          type: action.payload.type,
          isVisible: true,
        },
      };
    case 'HIDE_NOTIFICATION':
      return {
        ...state,
        notification: null,
      };
    default:
      return state;
  }
};

const defaultSettings: AppSettings = {
  theme: 'dark',
  fontSize: 'medium',
  defaultVolume: 50,
  audioQuality: 'high',
  saveHistory: true,
  dataSharing: false,
  emailNotifications: true,
};

const initialState: AppState = {
  currentSection: 'home',
  currentLibraryTab: 'likes',
  settings: defaultSettings,
  library: {
    likedSongs: [],
    recentlyPlayed: [],
    playlists: [],
    albums: [],
  },
  notification: null,
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved data from localStorage on mount
  React.useEffect(() => {
    // Load settings
    const savedSettings = localStorage.getItem('musicStreamSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }

    // Load liked songs
    const savedLikedSongs = localStorage.getItem('musicStreamLikedSongs');
    if (savedLikedSongs) {
      try {
        const likedSongs = JSON.parse(savedLikedSongs);
        // Set the entire array instead of adding one by one
        dispatch({ type: 'SET_LIKED_SONGS', payload: likedSongs });
      } catch (error) {
        console.error('Error loading liked songs:', error);
      }
    }

    // Load recently played
    const savedRecentlyPlayed = localStorage.getItem('musicStreamRecentlyPlayed');
    if (savedRecentlyPlayed) {
      try {
        const recentlyPlayed = JSON.parse(savedRecentlyPlayed);
        // Set the entire array instead of adding one by one
        dispatch({ type: 'SET_RECENTLY_PLAYED', payload: recentlyPlayed });
      } catch (error) {
        console.error('Error loading recently played:', error);
      }
    }
  }, []);

  const setCurrentSection = (section: NavigationSection) => {
    dispatch({ type: 'SET_CURRENT_SECTION', payload: section });
  };

  const setCurrentLibraryTab = (tab: LibraryTab) => {
    dispatch({ type: 'SET_CURRENT_LIBRARY_TAB', payload: tab });
  };

  const updateSettings = (settings: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const addToLikedSongs = (song: Song) => {
    // Check if already liked
    const isAlreadyLiked = state.library.likedSongs.some(s => s.id === song.id);
    if (!isAlreadyLiked) {
      dispatch({ type: 'ADD_TO_LIKED_SONGS', payload: song });
      showNotification(`Đã thêm "${song.title}" vào danh sách yêu thích`, 'success');
    }
  };

  const removeFromLikedSongs = (songId: string) => {
    const song = state.library.likedSongs.find(s => s.id === songId);
    dispatch({ type: 'REMOVE_FROM_LIKED_SONGS', payload: songId });
    if (song) {
      showNotification(`Đã xóa "${song.title}" khỏi danh sách yêu thích`, 'info');
    }
  };

  const addToRecentlyPlayed = (song: Song) => {
    dispatch({ type: 'ADD_TO_RECENTLY_PLAYED', payload: song });
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    dispatch({ type: 'SHOW_NOTIFICATION', payload: { message, type } });
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      dispatch({ type: 'HIDE_NOTIFICATION' });
    }, 3000);
  };

  const hideNotification = () => {
    dispatch({ type: 'HIDE_NOTIFICATION' });
  };

  const value: AppContextType = {
    state,
    setCurrentSection,
    setCurrentLibraryTab,
    updateSettings,
    addToLikedSongs,
    removeFromLikedSongs,
    addToRecentlyPlayed,
    showNotification,
    hideNotification,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
