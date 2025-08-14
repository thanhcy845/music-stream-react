// Core types for the Music Stream application

export interface Song {
  id: string;
  title: string;
  artist: string;
  coverPath: string;
  audioPath: string;
  duration: string;
  genre?: string;
  album?: string;
  year?: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  joinDate: string;
  bio?: string;
  favoriteGenres: string[];
  isPublic: boolean;
  showActivity: boolean;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  location?: string;
  lastLoginDate?: string;
}

export interface UserStats {
  totalListened: number;
  totalLiked: number;
  listeningTime: number; // in hours
  totalAchievements: number;
}

export interface PlayQueue {
  songs: Song[];
  currentIndex: number;
  isShuffled: boolean;
  originalOrder: Song[];
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isShuffled: boolean;
  queue: PlayQueue;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LibraryState {
  likedSongs: Song[];
  recentlyPlayed: Song[];
  playlists: Playlist[];
  albums: Album[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverPath?: string;
  songs: Song[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  coverPath: string;
  songs: Song[];
  year: number;
  genre: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isEarned: boolean;
  progress?: {
    current: number;
    total: number;
  };
}

export interface Activity {
  id: string;
  type: 'play' | 'like' | 'playlist' | 'follow';
  text: string;
  timestamp: string;
  songId?: string;
  playlistId?: string;
}

export interface SearchResult {
  songs: Song[];
  artists: string[];
  albums: Album[];
  playlists: Playlist[];
}

export interface AppSettings {
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
  defaultVolume: number;
  audioQuality: 'normal' | 'high' | 'lossless';
  saveHistory: boolean;
  dataSharing: boolean;
  emailNotifications: boolean;
}

// Navigation types
export type NavigationSection = 'home' | 'feed' | 'library' | 'profile' | 'settings';
export type LibraryTab = 'likes' | 'recent' | 'playlists' | 'albums';

// Form types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Event types
export interface PlayerEvent {
  type: 'play' | 'pause' | 'next' | 'previous' | 'seek' | 'volumeChange';
  payload?: any;
}

export interface NotificationEvent {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
