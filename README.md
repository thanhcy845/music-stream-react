# 🎵 Music Stream React

Ứng dụng nghe nhạc trực tuyến được xây dựng bằng React với TypeScript, cung cấp trải nghiệm nghe nhạc hiện đại và thân thiện với người dùng.

## 🌟 Tính năng chính

### 🎧 Music Player
- **Phát nhạc đầy đủ**: Play, pause, next, previous
- **Điều khiển âm lượng**: Volume slider với mute/unmute
- **Repeat modes**: None, one song, all playlist
- **Shuffle**: Phát ngẫu nhiên
- **Progress bar**: Tua nhanh đến vị trí bất kỳ
- **Queue management**: Quản lý hàng đợi phát nhạc

### 🔐 Authentication System
- **Đăng ký/Đăng nhập**: Form validation đầy đủ
- **LocalStorage**: Lưu trữ session người dùng
- **Protected Routes**: Bảo vệ các trang cần đăng nhập
- **Remember Me**: Ghi nhớ đăng nhập
- **User Profile**: Quản lý thông tin cá nhân

### 🎨 UI/UX Features
- **Dark/Light Theme**: Chuyển đổi theme mượt mà
- **Responsive Design**: Tương thích mọi thiết bị
- **Modern Interface**: Giao diện hiện đại, trực quan
- **Notifications**: Hệ thống thông báo thông minh
- **Search**: Tìm kiếm bài hát, nghệ sĩ

### 📊 Analytics Integration
- **Google Analytics**: Theo dõi hành vi người dùng
- **Real-time tracking**: Dữ liệu thời gian thực
- **Event tracking**: Theo dõi các hành động người dùng

## 🚀 Demo

**Live Demo**: [https://music-stream-react.vercel.app/](https://music-stream-react.vercel.app/)

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **React Router** - Navigation
- **Context API** - State Management
- **CSS3** - Styling với CSS Variables
- **Bootstrap Icons** - Icon Library

### Tools & Services
- **Vite/Create React App** - Build Tool
- **Git** - Version Control
- **Vercel** - Deployment
- **Google Analytics** - Web Analytics

## 📦 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js >= 16.0.0
- npm >= 8.0.0

### Cài đặt
```bash
# Clone repository
git clone https://github.com/thanhcy845/music-stream-react.git

# Di chuyển vào thư mục dự án
cd music-stream-react

# Cài đặt dependencies
npm install

# Chạy development server
npm start
```

### Build cho Production
```bash
# Build ứng dụng
npm run build

# Preview build
npm run preview
```

## 📁 Cấu trúc dự án

```
src/
├── components/           # React Components
│   ├── auth/            # Authentication components
│   ├── common/          # Shared components
│   ├── dashboard/       # Dashboard pages
│   ├── pages/           # Main pages
│   └── player/          # Music player components
├── context/             # React Context providers
│   ├── AuthContext.tsx  # Authentication state
│   ├── PlayerContext.tsx # Music player state
│   ├── ThemeContext.tsx # Theme management
│   └── AppContext.tsx   # Global app state
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── styles/              # Global styles
└── assets/              # Static assets
```

## 🎯 Tính năng nổi bật

### Music Player Context
- Quản lý trạng thái phát nhạc toàn cục
- Queue management với shuffle/repeat
- Volume control và mute functionality
- Progress tracking và seeking

### Authentication Flow
- Secure login/register với validation
- Session persistence với localStorage
- Protected route implementation
- User profile management

### Theme System
- Dynamic theme switching
- CSS variables cho customization
- Persistent theme preference
- Smooth transitions

## 🔧 Configuration

### Environment Variables
Tạo file `.env.local` trong root directory:
```env
REACT_APP_GA_TRACKING_ID=G-GQ4V295D5Q
```

### Google Analytics Setup
Analytics đã được tích hợp với tracking ID: `G-GQ4V295D5Q`

## 📱 Responsive Design

Ứng dụng được tối ưu cho:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px  
- **Mobile**: 320px - 767px

## 🎵 Music Library

Demo bao gồm các bài hát Việt Nam phổ biến:
- Alo Alo - Trúc Nhân
- Despacito - Luis Fonsi
- Em Về Đi Em - Khắc Việt
- Và nhiều bài khác...

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Tác giả

**thanhcy845** - [GitHub](https://github.com/thanhcy845)

## 🙏 Acknowledgments

- React team cho framework tuyệt vời
- Bootstrap Icons cho icon library
- Vercel cho hosting miễn phí
- Google Analytics cho web analytics

---

⭐ **Nếu bạn thích dự án này, hãy cho một star!** ⭐
