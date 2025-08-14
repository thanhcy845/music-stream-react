import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User, LoginFormData, RegisterFormData } from '../types';

interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginFormData) => Promise<boolean>;
  register: (userData: RegisterFormData) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const userData = localStorage.getItem('musicStreamUser');
      const isLoggedIn = localStorage.getItem('musicStreamLoggedIn');
      
      if (userData && isLoggedIn === 'true') {
        try {
          const user = JSON.parse(userData);
          dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('musicStreamUser');
          localStorage.removeItem('musicStreamLoggedIn');
        }
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginFormData): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate API call - replace with actual authentication logic
      const users = JSON.parse(localStorage.getItem('musicStreamUsers') || '[]');
      const user = users.find((u: any) => 
        u.email === credentials.email && u.password === credentials.password
      );

      if (user) {
        const { password, ...userWithoutPassword } = user;

        // Update last login date
        const updatedUser = {
          ...userWithoutPassword,
          lastLoginDate: new Date().toISOString()
        };

        // Store authentication state
        localStorage.setItem('musicStreamUser', JSON.stringify(updatedUser));
        localStorage.setItem('musicStreamLoggedIn', 'true');

        if (credentials.rememberMe) {
          localStorage.setItem('musicStreamRememberMe', 'true');
        }

        dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Email hoặc mật khẩu không đúng' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Đã xảy ra lỗi khi đăng nhập' });
      return false;
    }
  };

  const register = async (userData: RegisterFormData): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate API call - replace with actual registration logic
      const users = JSON.parse(localStorage.getItem('musicStreamUsers') || '[]');
      
      // Check if user already exists
      const existingUser = users.find((u: any) => u.email === userData.email);
      if (existingUser) {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Email đã được sử dụng' });
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        joinDate: new Date().toISOString(),
        favoriteGenres: ['Pop', 'Rock', 'Electronic'],
        isPublic: true,
        showActivity: true,
      };

      // Store user with password for authentication
      const userWithPassword = { ...newUser, password: userData.password };
      users.push(userWithPassword);
      localStorage.setItem('musicStreamUsers', JSON.stringify(users));

      // Store authentication state
      localStorage.setItem('musicStreamUser', JSON.stringify(newUser));
      localStorage.setItem('musicStreamLoggedIn', 'true');

      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
      return true;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: 'Đã xảy ra lỗi khi tạo tài khoản' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('musicStreamUser');
    localStorage.removeItem('musicStreamLoggedIn');
    localStorage.removeItem('musicStreamRememberMe');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem('musicStreamUser', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: userData });
    }
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
