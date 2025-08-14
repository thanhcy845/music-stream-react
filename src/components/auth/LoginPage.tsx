import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginFormData, RegisterFormData } from '../../types';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { state, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (state.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [state.isAuthenticated, navigate, from]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(loginData);
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(registerData);
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Register error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const switchForm = (formType: 'login' | 'register') => {
    setIsLoginForm(formType === 'login');
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="header-content">
          <Link to="/" className="logo">
            <i className="bi bi-cloud-hail"></i>
            <span>Music Stream</span>
          </Link>
          <Link to="/" className="back-link">
            <i className="bi bi-arrow-left"></i>
            <span>Quay lại</span>
          </Link>
        </div>
      </header>

      <main className="login-main">
        <div className="auth-container">
          {isLoginForm ? (
            <div className="auth-form">
              <div className="form-header">
                <div className="form-icon">
                  <i className="bi bi-person-circle"></i>
                </div>
                <h1 className="form-title">Đăng nhập</h1>
                <p className="form-subtitle">Chào mừng bạn quay trở lại</p>
              </div>

              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label htmlFor="login-email" className="form-label">Email</label>
                  <div className="input-container">
                    <i className="bi bi-envelope input-icon"></i>
                    <input
                      type="email"
                      id="login-email"
                      className="form-input"
                      placeholder="Nhập email của bạn"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="login-password" className="form-label">Mật khẩu</label>
                  <div className="input-container">
                    <i className="bi bi-lock input-icon"></i>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="login-password"
                      className="form-input"
                      placeholder="Nhập mật khẩu"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-text">Ghi nhớ đăng nhập</span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
                  {isLoading ? (
                    <i className="bi bi-arrow-clockwise loading-spin"></i>
                  ) : (
                    'Đăng nhập'
                  )}
                </button>

                {state.error && (
                  <div className="error-message">{state.error}</div>
                )}
              </form>

              <div className="form-footer">
                <p>
                  Chưa có tài khoản?{' '}
                  <button
                    className="switch-form-btn"
                    onClick={() => switchForm('register')}
                  >
                    Đăng ký ngay
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="auth-form">
              <div className="form-header">
                <div className="form-icon">
                  <i className="bi bi-person-plus"></i>
                </div>
                <h1 className="form-title">Tạo tài khoản</h1>
                <p className="form-subtitle">Tham gia cộng đồng âm nhạc</p>
              </div>

              <form onSubmit={handleRegisterSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="register-firstname" className="form-label">Tên</label>
                    <div className="input-container">
                      <i className="bi bi-person input-icon"></i>
                      <input
                        type="text"
                        id="register-firstname"
                        className="form-input"
                        placeholder="Tên của bạn"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-lastname" className="form-label">Họ</label>
                    <div className="input-container">
                      <i className="bi bi-person input-icon"></i>
                      <input
                        type="text"
                        id="register-lastname"
                        className="form-input"
                        placeholder="Họ của bạn"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-email" className="form-label">Email</label>
                  <div className="input-container">
                    <i className="bi bi-envelope input-icon"></i>
                    <input
                      type="email"
                      id="register-email"
                      className="form-input"
                      placeholder="Nhập email của bạn"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-password" className="form-label">Mật khẩu</label>
                  <div className="input-container">
                    <i className="bi bi-lock input-icon"></i>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="register-password"
                      className="form-input"
                      placeholder="Tạo mật khẩu"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="register-confirm-password" className="form-label">Xác nhận mật khẩu</label>
                  <div className="input-container">
                    <i className="bi bi-lock input-icon"></i>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="register-confirm-password"
                      className="form-input"
                      placeholder="Nhập lại mật khẩu"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={registerData.agreeTerms}
                      onChange={(e) => setRegisterData({ ...registerData, agreeTerms: e.target.checked })}
                      required
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-text">
                      Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật
                    </span>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
                  {isLoading ? (
                    <i className="bi bi-arrow-clockwise loading-spin"></i>
                  ) : (
                    'Tạo tài khoản'
                  )}
                </button>

                {state.error && (
                  <div className="error-message">{state.error}</div>
                )}
              </form>

              <div className="form-footer">
                <p>
                  Đã có tài khoản?{' '}
                  <button
                    className="switch-form-btn"
                    onClick={() => switchForm('login')}
                  >
                    Đăng nhập
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
