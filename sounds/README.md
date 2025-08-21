# Video Upload to YouTube & Script Collection Website

## 🎯 Mô tả
Trang web cho phép người dùng upload video MP4 **trực tiếp lên kênh YouTube của bạn** để thu thập script. Sau khi upload, bạn có thể xem video, tải script và xóa video khi cần thiết.

## ✨ Tính năng chính

### 🔐 YouTube Authentication
- **Đăng nhập một lần**: Bạn đăng nhập YouTube một lần duy nhất
- **Tự động upload**: Mọi người có thể upload video lên kênh của bạn
- **Bảo mật**: Sử dụng OAuth 2.0 với Google Sign-In
- **Quyền riêng tư**: Kiểm soát quyền riêng tư video (private, unlisted, public)

### 🎥 Upload Video lên YouTube
- **Kéo thả**: Kéo file video MP4 trực tiếp vào khu vực upload
- **Chọn file**: Click để chọn file từ máy tính
- **Thông tin chi tiết**: Nhập tiêu đề, mô tả, tags cho video
- **Upload tự động**: Video được upload trực tiếp lên YouTube
- **Hiển thị tiến trình**: Thanh tiến trình upload với animation

### 📱 Giao diện hiện đại
- **Responsive design**: Tương thích với mọi thiết bị
- **Gradient background**: Giao diện đẹp mắt với màu sắc hiện đại
- **Animation**: Hiệu ứng mượt mà khi tương tác
- **Icon Font Awesome**: Biểu tượng đẹp và rõ ràng

### 🎬 Quản lý Video
- **Thumbnail**: Hiển thị preview video
- **Thông tin chi tiết**: Tên file, kích thước, ngày upload
- **Modal xem video**: Xem video full màn hình
- **Lưu trữ local**: Video được lưu trong trình duyệt
- **Trạng thái YouTube**: Hiển thị video đã upload lên YouTube

### 📝 Script Management
- **Tải script**: Tạo và tải file script từ video
- **Template script nâng cao**: Bao gồm thông tin YouTube
- **Xóa video**: Xóa video sau khi đã lấy script
- **Link YouTube**: Xem video trực tiếp trên YouTube

## 🚀 Cách sử dụng

### 1. Cấu hình YouTube API
1. Làm theo hướng dẫn trong file `YOUTUBE_SETUP.md`
2. Lấy Client ID từ Google Cloud Console
3. Cập nhật `script.js` với Client ID của bạn

### 2. Đăng nhập YouTube
1. Mở trang web trong trình duyệt
2. Click "Đăng nhập YouTube"
3. Chọn tài khoản Google của bạn
4. Cấp quyền truy cập YouTube

### 3. Upload Video lên YouTube
1. Kéo thả file MP4 vào khu vực upload
2. Điền thông tin video:
   - **Tiêu đề**: Tên video trên YouTube
   - **Mô tả**: Mô tả chi tiết video
   - **Tags**: Từ khóa tìm kiếm (phân cách bằng dấu phẩy)
   - **Quyền riêng tư**: Private, Unlisted, hoặc Public
3. Click "Upload lên YouTube"
4. Chờ quá trình upload hoàn tất

### 4. Quản lý Video
1. **Xem video**: Click vào video card để mở modal
2. **Tải script**: Click "Tải Script" để download
3. **Xem trên YouTube**: Click "Xem trên YouTube" (nếu đã upload)
4. **Xóa video**: Click "Xóa Video" sau khi đã lấy script

## 🔧 Cấu hình kỹ thuật

### YouTube API Requirements
- YouTube Data API v3
- OAuth 2.0 Authentication
- Google Sign-In integration
- Proper scopes và permissions

### Local Storage
- Video metadata được lưu trong localStorage
- Tự động lưu mỗi 30 giây
- Không cần server backend

### File Handling
- Hỗ trợ format MP4
- Kiểm tra type file
- Xử lý lỗi upload
- Progress bar animation

## 📁 Cấu trúc file
```
├── index.html              # Trang chính với YouTube integration
├── styles.css              # CSS styling cho giao diện mới
├── script.js               # JavaScript với YouTube API
├── YOUTUBE_SETUP.md        # Hướng dẫn cấu hình YouTube API
├── README.md               # Hướng dẫn sử dụng
└── package.json            # Quản lý dự án
```

## ⚠️ Yêu cầu hệ thống
- Trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)
- Hỗ trợ HTML5 video
- Hỗ trợ localStorage
- Hỗ trợ File API
- Kết nối internet để upload lên YouTube

## 🔐 Bảo mật và Quyền riêng tư

### OAuth 2.0
- Xác thực an toàn với Google
- Token được lưu locally
- Quyền truy cập có thể thu hồi

### Quyền riêng tư Video
- **Private**: Chỉ bạn có thể xem
- **Unlisted**: Ai có link đều có thể xem
- **Public**: Công khai cho mọi người

## 📊 Giới hạn và Quota

### YouTube API Limits
- Quota hàng ngày: 10,000 units
- Upload video: 100 units/video
- Tối đa: 100 video/ngày

### File Limits
- Kích thước tối đa: 128GB
- Định dạng hỗ trợ: MP4, MOV, AVI, WMV, FLV, WebM
- Thời lượng: Không giới hạn

## 🐛 Xử lý lỗi thường gặp

### Lỗi Authentication
- Kiểm tra Client ID trong `script.js`
- Đảm bảo domain được authorize
- Kiểm tra OAuth consent screen

### Lỗi Upload
- Kiểm tra kết nối internet
- Kiểm tra quota YouTube API
- Kiểm tra định dạng file

### Lỗi Local Storage
- Kiểm tra dung lượng localStorage
- Xóa cache trình duyệt nếu cần

## 🚀 Phát triển thêm

### Tính năng có thể bổ sung:
- [ ] Upload nhiều video cùng lúc
- [ ] Lên lịch upload video
- [ ] Chỉnh sửa video sau khi upload
- [ ] Thống kê video và analytics
- [ ] Tích hợp với Google Drive
- [ ] Backup video metadata

### Cải tiến kỹ thuật:
- [ ] Service Worker cho offline support
- [ ] IndexedDB thay vì localStorage
- [ ] WebRTC cho streaming
- [ ] WebAssembly cho xử lý video
- [ ] PWA support

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console của trình duyệt
2. Kiểm tra Google Cloud Console logs
3. Đảm bảo đã cấu hình YouTube API đúng
4. Kiểm tra OAuth consent screen
5. Tham khảo `YOUTUBE_SETUP.md`

## 📄 License
Dự án này được phát triển cho mục đích học tập và sử dụng cá nhân.

## 🔗 Links hữu ích
- [YouTube Data API v3](https://developers.google.com/youtube/v3)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Sign-In](https://developers.google.com/identity/sign-in/web)
