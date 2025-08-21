# Hướng dẫn cấu hình YouTube API

## 🎯 Mục tiêu
Trang web này cho phép upload video MP4 trực tiếp lên kênh YouTube của bạn sau khi xác thực một lần.

## 📋 Yêu cầu trước khi bắt đầu

### 1. Tài khoản Google
- Phải có tài khoản Google
- Phải có kênh YouTube

### 2. Google Cloud Console
- Truy cập [Google Cloud Console](https://console.cloud.google.com/)
- Tạo project mới hoặc chọn project có sẵn

## 🚀 Các bước cấu hình

### Bước 1: Tạo Google Cloud Project

1. Mở [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" ở góc trên bên trái
3. Click "New Project"
4. Đặt tên project (ví dụ: "Video Upload App")
5. Click "Create"

### Bước 2: Bật YouTube Data API v3

1. Trong Google Cloud Console, chọn project vừa tạo
2. Vào menu "APIs & Services" > "Library"
3. Tìm kiếm "YouTube Data API v3"
4. Click vào API và click "Enable"

### Bước 3: Tạo OAuth 2.0 Credentials

1. Vào menu "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Nếu chưa có OAuth consent screen, click "Configure Consent Screen"
4. Chọn "External" và click "Create"
5. Điền thông tin:
   - App name: Tên ứng dụng của bạn
   - User support email: Email hỗ trợ
   - Developer contact information: Email liên hệ
6. Click "Save and Continue" qua các bước còn lại
7. Quay lại "Credentials" và click "Create Credentials" > "OAuth client ID"
8. Chọn "Web application"
9. Đặt tên (ví dụ: "Video Upload Web App")
10. Thêm Authorized JavaScript origins:
    - `http://localhost:8000` (cho development)
    - `https://yourdomain.com` (cho production)
11. Click "Create"
12. **Lưu Client ID và Client Secret**

### Bước 4: Cấu hình trong code

1. Mở file `script.js`
2. Thay thế các giá trị sau:

```javascript
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY'; // Để trống nếu không cần
const YOUTUBE_CLIENT_ID = 'YOUR_YOUTUBE_CLIENT_ID'; // Client ID từ bước 3
```

### Bước 5: Cấu hình OAuth Consent Screen

1. Vào "OAuth consent screen"
2. Thêm scope: `https://www.googleapis.com/auth/youtube.upload`
3. Thêm test users (email của bạn)
4. Publish app (nếu muốn public)

## 🔧 Cấu hình nâng cao

### Cấu hình cho Production

1. Thay đổi Authorized JavaScript origins thành domain thật
2. Cấu hình HTTPS
3. Thêm domain vào OAuth consent screen

### Cấu hình bảo mật

1. Giới hạn API key (nếu sử dụng)
2. Cấu hình CORS
3. Sử dụng environment variables

## 📱 Cách sử dụng

### 1. Đăng nhập YouTube
- Click "Đăng nhập YouTube"
- Chọn tài khoản Google của bạn
- Cấp quyền truy cập YouTube

### 2. Upload Video
- Kéo thả file MP4 vào khu vực upload
- Điền thông tin video (tiêu đề, mô tả, tags, quyền riêng tư)
- Click "Upload lên YouTube"

### 3. Quản lý Video
- Xem danh sách video đã upload
- Tải script từ video
- Xem video trên YouTube
- Xóa video khi cần

## ⚠️ Lưu ý quan trọng

### Giới hạn API
- YouTube Data API có quota giới hạn
- Mỗi ngày có thể upload tối đa 100 video
- File size tối đa: 128GB
- Định dạng hỗ trợ: MP4, MOV, AVI, WMV, FLV, WebM

### Bảo mật
- Không chia sẻ Client ID và Secret
- Sử dụng HTTPS cho production
- Giới hạn quyền truy cập API

### Chi phí
- YouTube Data API v3 miễn phí với quota cơ bản
- Nếu vượt quota, có thể phải trả phí

## 🐛 Xử lý lỗi thường gặp

### Lỗi "Quota exceeded"
- Kiểm tra quota trong Google Cloud Console
- Đợi đến ngày hôm sau hoặc tăng quota

### Lỗi "Access denied"
- Kiểm tra OAuth consent screen
- Đảm bảo đã thêm scope đúng
- Kiểm tra test users

### Lỗi "Invalid credentials"
- Kiểm tra Client ID
- Đảm bảo domain được authorize
- Kiểm tra OAuth consent screen

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra Google Cloud Console logs
2. Kiểm tra browser console
3. Tham khảo [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
4. Tham khảo [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

## 🔄 Cập nhật

Để cập nhật lên phiên bản mới:
1. Backup cấu hình hiện tại
2. Cập nhật code
3. Kiểm tra API endpoints
4. Test upload video
5. Cập nhật documentation
