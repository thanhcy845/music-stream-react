import React, { createContext, useContext, useReducer, useRef, useEffect, ReactNode } from 'react';
import { PlayerState, Song, PlayQueue } from '../types';

interface PlayerContextType {
  state: PlayerState;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playSong: (song: Song) => void;
  togglePlayPause: () => void;
  nextSong: () => void;
  previousSong: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  updateCurrentTime: (time: number) => void;
  updateDuration: (duration: number) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

type PlayerAction =
  | { type: 'SET_CURRENT_SONG'; payload: Song }
  | { type: 'TOGGLE_PLAY_PAUSE' }
  | { type: 'SET_PLAYING'; payload: boolean }
  | { type: 'UPDATE_CURRENT_TIME'; payload: number }
  | { type: 'UPDATE_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'SET_REPEAT_MODE'; payload: 'none' | 'one' | 'all' }
  | { type: 'ADD_TO_QUEUE'; payload: Song }
  | { type: 'REMOVE_FROM_QUEUE'; payload: number }
  | { type: 'CLEAR_QUEUE' }
  | { type: 'SET_QUEUE_INDEX'; payload: number }
  | { type: 'SHUFFLE_QUEUE' }
  | { type: 'RESTORE_ORIGINAL_ORDER' };

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const playerReducer = (state: PlayerState, action: PlayerAction): PlayerState => {
  switch (action.type) {
    case 'SET_CURRENT_SONG':
      return {
        ...state,
        currentSong: action.payload,
      };
    case 'TOGGLE_PLAY_PAUSE':
      return {
        ...state,
        isPlaying: !state.isPlaying,
      };
    case 'SET_PLAYING':
      return {
        ...state,
        isPlaying: action.payload,
      };
    case 'UPDATE_CURRENT_TIME':
      return {
        ...state,
        currentTime: action.payload,
      };
    case 'UPDATE_DURATION':
      return {
        ...state,
        duration: action.payload,
      };
    case 'SET_VOLUME':
      return {
        ...state,
        volume: action.payload,
        isMuted: false,
      };
    case 'TOGGLE_MUTE':
      return {
        ...state,
        isMuted: !state.isMuted,
      };
    case 'TOGGLE_SHUFFLE':
      const newIsShuffled = !state.isShuffled;
      if (newIsShuffled) {
        // Shuffle the queue
        const shuffledSongs = shuffleArray(state.queue.songs);
        return {
          ...state,
          isShuffled: newIsShuffled,
          queue: {
            ...state.queue,
            songs: shuffledSongs,
            currentIndex: shuffledSongs.findIndex(song => song.id === state.currentSong?.id) || 0,
          },
        };
      } else {
        // Restore original order
        return {
          ...state,
          isShuffled: newIsShuffled,
          queue: {
            ...state.queue,
            songs: state.queue.originalOrder,
            currentIndex: state.queue.originalOrder.findIndex(song => song.id === state.currentSong?.id) || 0,
          },
        };
      }
    case 'SET_REPEAT_MODE':
      return {
        ...state,
        repeatMode: action.payload,
      };
    case 'ADD_TO_QUEUE':
      const newSongs = [...state.queue.songs, action.payload];
      const newOriginalOrder = [...state.queue.originalOrder, action.payload];
      return {
        ...state,
        queue: {
          ...state.queue,
          songs: state.isShuffled ? shuffleArray(newSongs) : newSongs,
          originalOrder: newOriginalOrder,
        },
      };
    case 'REMOVE_FROM_QUEUE':
      const filteredSongs = state.queue.songs.filter((_, index) => index !== action.payload);
      const filteredOriginal = state.queue.originalOrder.filter((_, index) => index !== action.payload);
      let newCurrentIndex = state.queue.currentIndex;
      if (action.payload < state.queue.currentIndex) {
        newCurrentIndex = state.queue.currentIndex - 1;
      } else if (action.payload === state.queue.currentIndex) {
        newCurrentIndex = Math.min(state.queue.currentIndex, filteredSongs.length - 1);
      }
      return {
        ...state,
        queue: {
          ...state.queue,
          songs: filteredSongs,
          originalOrder: filteredOriginal,
          currentIndex: Math.max(0, newCurrentIndex),
        },
      };
    case 'CLEAR_QUEUE':
      return {
        ...state,
        queue: {
          songs: [],
          originalOrder: [],
          currentIndex: -1,
          isShuffled: false,
        },
        currentSong: null,
        isPlaying: false,
      };
    case 'SET_QUEUE_INDEX':
      return {
        ...state,
        queue: {
          ...state.queue,
          currentIndex: action.payload,
        },
      };
    default:
      return state;
  }
};

const initialQueue: PlayQueue = {
  songs: [],
  currentIndex: -1,
  isShuffled: false,
  originalOrder: [],
};

const initialState: PlayerState = {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.5,
  isMuted: false,
  repeatMode: 'none',
  isShuffled: false,
  queue: initialQueue,
};

interface PlayerProviderProps {
  children: ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Load saved volume from localStorage
  useEffect(() => {
    const savedVolume = localStorage.getItem('musicStreamVolume');
    if (savedVolume) {
      const volume = parseFloat(savedVolume);
      dispatch({ type: 'SET_VOLUME', payload: volume });
      if (audioRef.current) {
        audioRef.current.volume = volume;
      }
    }
  }, []);

  // Save volume to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('musicStreamVolume', state.volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : state.volume;
    }
  }, [state.volume, state.isMuted]);

  const playSong = (song: Song) => {
    dispatch({ type: 'SET_CURRENT_SONG', payload: song });
    
    // Add to queue if not already there
    if (!state.queue.songs.find(s => s.id === song.id)) {
      dispatch({ type: 'ADD_TO_QUEUE', payload: song });
    }
    
    // Set current index
    const index = state.queue.songs.findIndex(s => s.id === song.id);
    if (index !== -1) {
      dispatch({ type: 'SET_QUEUE_INDEX', payload: index });
    }

    if (audioRef.current) {
      audioRef.current.src = song.audioPath;
      audioRef.current.play();
      dispatch({ type: 'SET_PLAYING', payload: true });
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (state.isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      dispatch({ type: 'TOGGLE_PLAY_PAUSE' });
    }
  };

  const nextSong = () => {
    if (state.queue.songs.length === 0) return;

    let nextIndex = state.queue.currentIndex + 1;
    
    if (nextIndex >= state.queue.songs.length) {
      if (state.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        return; // End of queue
      }
    }

    const nextSong = state.queue.songs[nextIndex];
    if (nextSong) {
      dispatch({ type: 'SET_QUEUE_INDEX', payload: nextIndex });
      playSong(nextSong);
    }
  };

  const previousSong = () => {
    if (state.queue.songs.length === 0) return;

    let prevIndex = state.queue.currentIndex - 1;
    
    if (prevIndex < 0) {
      if (state.repeatMode === 'all') {
        prevIndex = state.queue.songs.length - 1;
      } else {
        return; // Beginning of queue
      }
    }

    const prevSong = state.queue.songs[prevIndex];
    if (prevSong) {
      dispatch({ type: 'SET_QUEUE_INDEX', payload: prevIndex });
      playSong(prevSong);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch({ type: 'UPDATE_CURRENT_TIME', payload: time });
    }
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: volume });
  };

  const toggleMute = () => {
    dispatch({ type: 'TOGGLE_MUTE' });
  };

  const toggleShuffle = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };

  const setRepeatMode = (mode: 'none' | 'one' | 'all') => {
    dispatch({ type: 'SET_REPEAT_MODE', payload: mode });
  };

  const addToQueue = (song: Song) => {
    dispatch({ type: 'ADD_TO_QUEUE', payload: song });
  };

  const removeFromQueue = (index: number) => {
    dispatch({ type: 'REMOVE_FROM_QUEUE', payload: index });
  };

  const clearQueue = () => {
    dispatch({ type: 'CLEAR_QUEUE' });
  };

  const updateCurrentTime = (time: number) => {
    dispatch({ type: 'UPDATE_CURRENT_TIME', payload: time });
  };

  const updateDuration = (duration: number) => {
    dispatch({ type: 'UPDATE_DURATION', payload: duration });
  };

  const value: PlayerContextType = {
    state,
    audioRef,
    playSong,
    togglePlayPause,
    nextSong,
    previousSong,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeatMode,
    addToQueue,
    removeFromQueue,
    clearQueue,
    updateCurrentTime,
    updateDuration,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
