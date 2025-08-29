# File Transfer - Giải pháp chia sẻ file đơn giản

## 🎯 Mục đích
Giải pháp này giúp bạn chia sẻ file giữa các thiết bị mà không cần cài đặt ứng dụng như Zalo, Messenger. Hoạt động hoàn toàn trên web và có thể deploy lên GitHub Pages.

## 📁 Cấu trúc file
```
giai-phap-up-va-down-file/
├── index.html              # Phiên bản local storage (cơ bản)
├── firebase-version.html   # Phiên bản Firebase (online thực sự)
├── style.css               # Giao diện CSS
├── script.js               # Logic cho phiên bản local
├── firebase-config.js      # Cấu hình Firebase
├── firebase-script.js      # Logic cho phiên bản Firebase
└── README.md               # Hướng dẫn này
```

## 🚀 Cách sử dụng

### Phiên bản 1: Local Storage (Đơn giản)
1. Mở file `index.html` trong trình duyệt
2. Kéo thả hoặc chọn file cần chia sẻ
3. Click "Upload Files"
4. Copy link chia sẻ và gửi cho người khác
5. Người nhận mở link để tải xuống

**⚠️ Hạn chế:** File chỉ tồn tại khi máy tính upload còn bật và mở trang web

### Phiên bản 2: Firebase (Online thực sự) ⭐
1. Setup Firebase (xem hướng dẫn bên dưới)
2. Mở file `firebase-version.html`
3. Upload file lên cloud
4. File tồn tại vĩnh viễn trên internet

## 🔥 Setup Firebase (Khuyến nghị)

### Bước 1: Tạo dự án Firebase
1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" hoặc chọn dự án có sẵn
3. Đặt tên dự án (ví dụ: "file-transfer-app")

### Bước 2: Thêm ứng dụng web
1. Trong dự án, click biểu tượng web (</>)
2. Đặt tên app (ví dụ: "file-transfer")
3. Click "Register app"

### Bước 3: Copy cấu hình
1. Copy thông tin cấu hình Firebase
2. Mở file `firebase-config.js`
3. Thay thế thông tin trong `firebaseConfig`

### Bước 4: Bật Storage
1. Trong menu bên trái, chọn "Storage"
2. Click "Get started"
3. Chọn "Start in test mode" (cho test)
4. Chọn region gần nhất (ví dụ: asia-southeast1)

### Bước 5: Cập nhật cấu hình
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyB...",           // Thay bằng API key thật
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};
```

## 📱 Tính năng

### ✅ Đã có
- Upload file kéo thả
- Hỗ trợ nhiều loại file
- Chia sẻ qua link
- Mã QR để chia sẻ
- Chia sẻ trực tiếp qua WhatsApp, Telegram, Email
- Giao diện responsive
- Progress bar khi upload
- Tự động dọn dẹp file hết hạn

### 🔧 Tùy chỉnh
- Giới hạn kích thước file (50MB local, 100MB Firebase)
- Thời gian hết hạn (24h local, 1 năm Firebase)
- Giao diện đẹp với gradient và animation
- Hỗ trợ mobile và desktop

## 💰 Chi phí Firebase

### Free Tier (Spark Plan)
- **Storage:** 5GB
- **Download:** 1GB/ngày
- **Upload:** 20GB/ngày
- **Database:** 1GB
- **Hosting:** 10GB

### Paid Plans
- **Blaze Plan:** Pay as you go
- **Storage:** $0.026/GB/tháng
- **Download:** $0.15/GB

## 🚨 Lưu ý bảo mật

### Test Mode (Hiện tại)
- Ai cũng có thể upload/download
- Chỉ dùng để test
- Không an toàn cho production

### Production Mode
1. Vào Firebase Console > Storage > Rules
2. Thay đổi rules để kiểm soát quyền truy cập
3. Có thể thêm authentication

## 🐛 Xử lý lỗi thường gặp

### Lỗi "Firebase not initialized"
- Kiểm tra file `firebase-config.js`
- Đảm bảo thông tin cấu hình đúng
- Kiểm tra console để xem lỗi chi tiết

### Lỗi upload
- Kiểm tra kết nối internet
- File quá lớn (giới hạn 100MB)
- Quota Firebase đã hết

### Lỗi download
- Link đã hết hạn
- File đã bị xóa
- Vấn đề quyền truy cập

## 🔄 Cập nhật và bảo trì

### Dọn dẹp file cũ
- Firebase tự động dọn dẹp theo rules
- Có thể setup lifecycle rules để xóa file tự động

### Backup
- File được lưu trên Firebase Storage
- Có thể backup metadata vào database
- Export danh sách file chia sẻ

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra console browser (F12)
2. Kiểm tra Firebase Console
3. Xem logs và errors
4. Kiểm tra network tab

## 🎉 Kết luận

- **Phiên bản local:** Đơn giản, không cần setup, nhưng file không tồn tại online
- **Phiên bản Firebase:** File thực sự online, tồn tại vĩnh viễn, nhưng cần setup

**Khuyến nghị:** Sử dụng phiên bản Firebase để có trải nghiệm tốt nhất và file thực sự online!
