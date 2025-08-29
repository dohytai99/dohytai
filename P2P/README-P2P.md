# 🚀 File Transfer P2P - Chia sẻ file trực tiếp

## 📋 **Mô tả**

Giải pháp chia sẻ file **P2P (Peer-to-Peer)** sử dụng **WebRTC** để kết nối trực tiếp giữa các thiết bị mà **không cần server trung gian**. File được truyền trực tiếp từ thiết bị gửi đến thiết bị nhận.

## ✨ **Tính năng chính**

### 🔗 **Kết nối P2P**
- **Tạo phòng (Host)**: Tạo phòng mới và chia sẻ mã kết nối
- **Tham gia phòng (Join)**: Nhập mã để tham gia phòng có sẵn
- **Kết nối trực tiếp**: Sử dụng WebRTC để kết nối trực tiếp giữa các thiết bị

### 📁 **Chuyển file**
- **Drag & Drop**: Kéo thả file vào khu vực upload
- **Chọn file**: Click để chọn file từ máy tính
- **Gửi trực tiếp**: File được gửi trực tiếp đến thiết bị khác
- **Tiến trình real-time**: Hiển thị tiến trình chuyển file theo thời gian thực

### 📱 **Chia sẻ dễ dàng**
- **Mã QR**: Quét mã QR để tham gia phòng
- **Mã phòng**: Copy mã 6 ký tự để chia sẻ
- **Link trực tiếp**: Chia sẻ link với mã phòng

## 🛠️ **Công nghệ sử dụng**

- **WebRTC**: Kết nối P2P trực tiếp giữa các trình duyệt
- **PeerJS**: Thư viện JavaScript đơn giản hóa WebRTC
- **HTML5 File API**: Xử lý file và drag & drop
- **QR Code**: Tạo mã QR để chia sẻ

## 📁 **Cấu trúc file**

```
p2p-version.html      # Giao diện chính P2P
p2p-script.js         # Logic JavaScript P2P
style.css             # CSS chung (đã cập nhật)
README-P2P.md         # Hướng dẫn này
```

## 🚀 **Cách sử dụng**

### **Bước 1: Mở ứng dụng**
1. Mở file `p2p-version.html` trong trình duyệt
2. Chọn chế độ: **Tạo phòng** hoặc **Tham gia phòng**

### **Bước 2: Tạo phòng (Host)**
1. Click **"Tạo Phòng Mới"**
2. Đợi hệ thống tạo phòng và kết nối
3. Chia sẻ **mã phòng** hoặc **mã QR** với người khác
4. Chờ thiết bị khác tham gia

### **Bước 3: Tham gia phòng (Client)**
1. Nhập **mã phòng** 6 ký tự
2. Click **"Tham Gia"**
3. Đợi kết nối thành công với chủ phòng

### **Bước 4: Chuyển file**
1. **Kéo thả** hoặc **chọn file** cần gửi
2. Click **"Gửi File"**
3. File sẽ được chuyển trực tiếp đến thiết bị khác
4. Theo dõi tiến trình chuyển file real-time

## 🔧 **Cách hoạt động**

### **Kết nối P2P**
```
Thiết bị A (Host) ←→ PeerJS Server ←→ Thiết bị B (Client)
                ↓
        Kết nối trực tiếp WebRTC
                ↓
        Truyền file trực tiếp
```

### **Quy trình chuyển file**
1. **Chia file thành chunks** (64KB mỗi chunk)
2. **Gửi thông tin file** (tên, kích thước, số chunks)
3. **Gửi từng chunk** theo thứ tự
4. **Xác nhận hoàn thành** và ghép file lại

## 🌐 **Yêu cầu hệ thống**

### **Trình duyệt hỗ trợ**
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

### **Kết nối mạng**
- **Internet**: Cần để kết nối ban đầu qua PeerJS server
- **Local Network**: Có thể kết nối trực tiếp nếu cùng mạng
- **NAT Traversal**: Tự động xử lý qua STUN servers

## 📱 **Sử dụng trên mobile**

### **Tạo phòng từ mobile**
1. Mở trang web trên điện thoại
2. Click **"Tạo Phòng Mới"**
3. Chia sẻ mã QR hoặc mã phòng
4. Thiết bị khác quét mã để tham gia

### **Tham gia từ mobile**
1. Nhập mã phòng hoặc quét mã QR
2. Click **"Tham Gia"**
3. Đợi kết nối thành công
4. Nhận file được gửi từ thiết bị khác

## ⚡ **Ưu điểm P2P**

### **So với giải pháp server**
- 🚀 **Tốc độ cao**: Không qua server trung gian
- 💰 **Miễn phí**: Không cần trả tiền cho storage
- 🔒 **Bảo mật**: File không lưu trên server
- 📱 **Offline**: Có thể hoạt động trên mạng local
- ♾️ **Không giới hạn**: Không giới hạn dung lượng file

### **So với giải pháp local storage**
- 🌐 **Online**: File có thể truy cập từ thiết bị khác
- 🔄 **Real-time**: Chuyển file theo thời gian thực
- 📊 **Tiến trình**: Hiển thị tiến trình chuyển file
- 📱 **Mobile**: Hoạt động tốt trên mobile

## 🚨 **Hạn chế**

### **Kỹ thuật**
- **Cần kết nối Internet**: Để thiết lập kết nối ban đầu
- **Phụ thuộc WebRTC**: Một số trình duyệt cũ không hỗ trợ
- **NAT/Firewall**: Có thể gặp vấn đề với một số mạng

### **Trải nghiệm người dùng**
- **Cả 2 thiết bị phải online**: Để thiết lập kết nối
- **Mã phòng 6 ký tự**: Cần nhập chính xác
- **Kết nối không ổn định**: Có thể bị ngắt giữa chừng

## 🔧 **Troubleshooting**

### **Không thể kết nối**
1. **Kiểm tra Internet**: Đảm bảo cả 2 thiết bị có Internet
2. **Kiểm tra mã phòng**: Nhập chính xác 6 ký tự
3. **Thử lại**: Đôi khi cần thử lại vài lần
4. **Đổi trình duyệt**: Thử Chrome hoặc Firefox

### **File không gửi được**
1. **Kiểm tra kết nối**: Đảm bảo đã kết nối thành công
2. **Kiểm tra file size**: File quá lớn có thể gây lỗi
3. **Thử file nhỏ**: Thử với file < 10MB trước
4. **Kiểm tra console**: Xem lỗi trong Developer Tools

### **Kết nối bị ngắt**
1. **Kiểm tra mạng**: Đảm bảo mạng ổn định
2. **Thử kết nối lại**: Tạo phòng mới hoặc tham gia lại
3. **Đổi mạng**: Thử WiFi khác hoặc mobile data

## 🚀 **Nâng cấp và tùy chỉnh**

### **Thêm tính năng**
- **Chat**: Gửi tin nhắn giữa các thiết bị
- **Screen sharing**: Chia sẻ màn hình
- **Voice call**: Gọi thoại P2P
- **File compression**: Nén file trước khi gửi

### **Tùy chỉnh giao diện**
- **Theme**: Thay đổi màu sắc và style
- **Language**: Hỗ trợ đa ngôn ngữ
- **Responsive**: Tối ưu cho tablet và mobile

## 📞 **Hỗ trợ**

### **Vấn đề thường gặp**
- **WebRTC không hoạt động**: Cập nhật trình duyệt
- **Kết nối chậm**: Kiểm tra tốc độ mạng
- **File bị lỗi**: Thử gửi lại file

### **Liên hệ hỗ trợ**
- **GitHub Issues**: Báo cáo bug và yêu cầu tính năng
- **Documentation**: Xem hướng dẫn chi tiết
- **Community**: Tham gia thảo luận

## 📄 **License**

Giải pháp này được phát hành dưới MIT License - xem file LICENSE để biết thêm chi tiết.

---

**🎉 Chúc bạn sử dụng giải pháp P2P thành công!**
