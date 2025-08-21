// Google API Configuration
const GOOGLE_API_CONFIG = {
    clientId: '904904464078-tgq0a8u8q9r2jjbp3tgdoi27lhf7cs6i.apps.googleusercontent.com',
    clientSecret: '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',
    scopes: ['https://www.googleapis.com/auth/youtube.upload'],
    tokenUri: 'https://oauth2.googleapis.com/token'
};

// Global variables
let videos = [];
let currentVideoIndex = -1;
let isAuthenticated = false;
let currentVideoFile = null;
let accessToken = null;
let refreshToken = null;

// DOM elements
const authSection = document.getElementById('authSection');
const uploadSection = document.getElementById('uploadSection');
const authBtn = document.getElementById('authBtn');
const authStatus = document.getElementById('authStatus');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const videoDetailsForm = document.getElementById('videoDetailsForm');
const uploadToYoutubeBtn = document.getElementById('uploadToYoutubeBtn');
const videoGrid = document.getElementById('videoGrid');
const noVideos = document.getElementById('noVideos');
const videoModal = document.getElementById('videoModal');
const closeModal = document.getElementById('closeModal');
const modalVideo = document.getElementById('modalVideo');
const modalTitle = document.getElementById('modalTitle');
const downloadScriptBtn = document.getElementById('downloadScript');
const viewOnYoutubeBtn = document.getElementById('viewOnYoutube');
const deleteVideoBtn = document.getElementById('deleteVideo');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    loadVideos();
    setupEventListeners();
    loadGoogleToken();
    checkAuthenticationStatus();
});

function setupEventListeners() {
    // Authentication
    authBtn.addEventListener('click', authenticateYouTube);
    
    // File input change
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop events
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Upload to YouTube
    uploadToYoutubeBtn.addEventListener('click', uploadToYouTube);
    
    // Modal events
    closeModal.addEventListener('click', closeVideoModal);
    window.addEventListener('click', function(event) {
        if (event.target === videoModal) {
            closeVideoModal();
        }
    });
    
    // Action buttons
    downloadScriptBtn.addEventListener('click', downloadScript);
    deleteVideoBtn.addEventListener('click', deleteCurrentVideo);
}

// Load Google Token from file
async function loadGoogleToken() {
    try {
        // Try to load the new token.json first, fallback to token_readonly.json
        let response = await fetch('token.json');
        if (!response.ok) {
            response = await fetch('token_readonly.json');
        }
        
        const tokenData = await response.json();
        
        accessToken = tokenData.token;
        refreshToken = tokenData.refresh_token;
        
        // Check if token is expired
        if (tokenData.expiry) {
            const expiryDate = new Date(tokenData.expiry);
            if (new Date() > expiryDate) {
                console.log('Token đã hết hạn, cần refresh');
                await refreshAccessToken();
            } else {
                console.log('Token còn hiệu lực');
                isAuthenticated = true;
                updateAuthenticationUI();
                showNotification('Đã tải token YouTube API thành công!', 'success');
            }
        } else {
            // If no expiry date, assume token is valid
            isAuthenticated = true;
            updateAuthenticationUI();
            showNotification('Đã tải token YouTube API thành công!', 'success');
        }
        
    } catch (error) {
        console.error('Không thể tải token:', error);
        showNotification('Không thể tải token Google API', 'error');
    }
}

// Refresh access token
async function refreshAccessToken() {
    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: GOOGLE_API_CONFIG.clientId,
                client_secret: GOOGLE_API_CONFIG.clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
        });

        const data = await response.json();
        if (data.access_token) {
            accessToken = data.access_token;
            isAuthenticated = true;
            updateAuthenticationUI();
            showNotification('Token đã được refresh thành công!', 'success');
        } else {
            throw new Error('Không thể refresh token');
        }
    } catch (error) {
        console.error('Lỗi refresh token:', error);
        showNotification('Không thể refresh token, vui lòng đăng nhập lại', 'error');
        isAuthenticated = false;
        updateAuthenticationUI();
    }
}

// YouTube Authentication
function authenticateYouTube() {
    if (isAuthenticated) {
        logoutYouTube();
        return;
    }
    
    // Sử dụng Google Sign-In với token đã có
    if (accessToken) {
        isAuthenticated = true;
        updateAuthenticationUI();
        showNotification('Đăng nhập YouTube thành công!', 'success');
    } else {
        // Fallback to Google Sign-In
        google.accounts.id.initialize({
            client_id: GOOGLE_API_CONFIG.clientId,
            scope: GOOGLE_API_CONFIG.scopes.join(' '),
            callback: handleAuthCallback
        });
        
        google.accounts.id.prompt();
    }
}

function handleAuthCallback(response) {
    if (response.credential) {
        // Lưu token
        localStorage.setItem('youtube_token', response.credential);
        isAuthenticated = true;
        updateAuthenticationUI();
        showNotification('Đăng nhập YouTube thành công!', 'success');
    }
}

function logoutYouTube() {
    localStorage.removeItem('youtube_token');
    isAuthenticated = false;
    updateAuthenticationUI();
    showNotification('Đã đăng xuất YouTube', 'info');
}

function checkAuthenticationStatus() {
    const token = localStorage.getItem('youtube_token');
    if (token || accessToken) {
        isAuthenticated = true;
        updateAuthenticationUI();
    }
}

function updateAuthenticationUI() {
    if (isAuthenticated) {
        authBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Đăng xuất YouTube';
        authStatus.innerHTML = '<span class="status-text authenticated">Đã đăng nhập YouTube</span>';
        uploadSection.style.display = 'block';
    } else {
        authBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Đăng nhập YouTube';
        authStatus.innerHTML = '<span class="status-text not-authenticated">Chưa đăng nhập</span>';
        uploadSection.style.display = 'none';
    }
}

// File handling functions
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
        currentVideoFile = files[0];
        showVideoDetailsForm();
    }
}

function handleDragOver(event) {
    event.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = Array.from(event.dataTransfer.files);
    const videoFiles = files.filter(file => file.type === 'video/mp4');
    
    if (videoFiles.length > 0) {
        currentVideoFile = videoFiles[0];
        showVideoDetailsForm();
    } else {
        alert('Vui lòng chỉ upload file MP4!');
    }
}

function showVideoDetailsForm() {
    if (!isAuthenticated) {
        showNotification('Vui lòng đăng nhập YouTube trước!', 'error');
        return;
    }
    
    videoDetailsForm.style.display = 'block';
    
    // Auto-fill title from filename
    const title = currentVideoFile.name.replace('.mp4', '');
    document.getElementById('videoTitle').value = title;
    
    // Scroll to form
    videoDetailsForm.scrollIntoView({ behavior: 'smooth' });
}

// YouTube Upload Functions
async function uploadToYouTube() {
    if (!currentVideoFile || !isAuthenticated) {
        showNotification('Vui lòng chọn file và đăng nhập YouTube!', 'error');
        return;
    }
    
    const title = document.getElementById('videoTitle').value;
    const description = document.getElementById('videoDescription').value;
    const tags = document.getElementById('videoTags').value;
    const privacy = document.getElementById('videoPrivacy').value;
    
    if (!title.trim()) {
        showNotification('Vui lòng nhập tiêu đề video!', 'error');
        return;
    }
    
    try {
        showUploadProgress();
        progressText.textContent = 'Đang upload lên YouTube...';
        
        // Real YouTube upload using API
        const youtubeData = await uploadVideoToYouTube(title, description, tags, privacy);
        
        // Lưu video vào danh sách local
        const videoData = {
            id: Date.now(),
            name: currentVideoFile.name,
            size: formatFileSize(currentVideoFile.size),
            data: URL.createObjectURL(currentVideoFile),
            uploadDate: new Date().toLocaleDateString('vi-VN'),
            youtubeId: youtubeData.id,
            youtubeUrl: `https://youtube.com/watch?v=${youtubeData.id}`,
            title: title,
            description: description,
            tags: tags,
            privacy: privacy
        };
        
        videos.push(videoData);
        updateVideoGrid();
        hideUploadProgress();
        
        // Reset form
        videoDetailsForm.style.display = 'none';
        currentVideoFile = null;
        document.getElementById('videoTitle').value = '';
        document.getElementById('videoDescription').value = '';
        document.getElementById('videoTags').value = '';
        
        showNotification(`Đã upload thành công lên YouTube: ${title}`, 'success');
        
    } catch (error) {
        hideUploadProgress();
        showNotification(`Lỗi khi upload lên YouTube: ${error.message}`, 'error');
        console.error('Upload error:', error);
    }
}

// Real YouTube API upload
async function uploadVideoToYouTube(title, description, tags, privacy) {
    if (!accessToken) {
        throw new Error('Không có access token');
    }
    
    console.log('Bắt đầu upload video lên YouTube...');
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Tags:', tags);
    console.log('Privacy:', privacy);
    
    // Step 1: Create video resource
    const videoResource = {
        snippet: {
            title: title,
            description: description || '',
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [],
            categoryId: '22', // People & Blogs
            defaultLanguage: 'vi',
            defaultAudioLanguage: 'vi'
        },
        status: {
            privacyStatus: privacy,
            selfDeclaredMadeForKids: false
        }
    };
    
    console.log('Video resource:', videoResource);
    
    // Step 2: Upload video file using multipart upload
    const formData = new FormData();
    
    // Add metadata as a JSON blob
    const metadataBlob = new Blob([JSON.stringify(videoResource)], { 
        type: 'application/json' 
    });
    formData.append('metadata', metadataBlob);
    
    // Add video file
    formData.append('file', currentVideoFile);
    
    console.log('FormData prepared, file size:', currentVideoFile.size);
    
    // Step 3: Make the upload request
    const uploadUrl = 'https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status&uploadType=multipart';
    
    const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            // Don't set Content-Type header for FormData, let browser set it with boundary
        },
        body: formData
    });
    
    console.log('Upload response status:', response.status);
    console.log('Upload response headers:', response.headers);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.error?.message || errorMessage;
        } catch (e) {
            // If not JSON, use the text as is
        }
        
        throw new Error(`YouTube API Error: ${errorMessage}`);
    }
    
    const data = await response.json();
    console.log('Upload success response:', data);
    
    return {
        id: data.id,
        title: data.snippet.title,
        description: data.snippet.description
    };
}

function updateProgress(percent) {
    progressFill.style.width = percent + '%';
    progressText.textContent = `Đang upload lên YouTube... ${Math.round(percent)}%`;
}

function showUploadProgress() {
    uploadProgress.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = 'Đang upload lên YouTube...';
}

function hideUploadProgress() {
    uploadProgress.style.display = 'none';
}

// Video display functions
function updateVideoGrid() {
    if (videos.length === 0) {
        videoGrid.style.display = 'none';
        noVideos.style.display = 'block';
    } else {
        videoGrid.style.display = 'grid';
        noVideos.style.display = 'none';
        
        videoGrid.innerHTML = videos.map((video, index) => `
            <div class="video-card" onclick="openVideoModal(${index})">
                <div class="video-thumbnail">
                    <video src="${video.data}" preload="metadata">
                        <i class="fas fa-video"></i>
                    </video>
                </div>
                <div class="video-info">
                    <div class="video-title">${video.title || video.name}</div>
                    <div class="video-meta">
                        <span>${video.uploadDate}</span>
                        <span class="video-size">${video.size}</span>
                    </div>
                    ${video.youtubeId ? '<div class="video-youtube-status">Đã upload YouTube</div>' : ''}
                </div>
            </div>
        `).join('');
    }
    
    saveVideos();
}

function openVideoModal(index) {
    currentVideoIndex = index;
    const video = videos[index];
    
    modalTitle.textContent = video.title || video.name;
    modalVideo.src = video.data;
    
    // Show/hide YouTube button
    if (video.youtubeId) {
        viewOnYoutubeBtn.style.display = 'inline-flex';
        viewOnYoutubeBtn.onclick = () => window.open(video.youtubeUrl, '_blank');
    } else {
        viewOnYoutubeBtn.style.display = 'none';
    }
    
    videoModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    videoModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    modalVideo.pause();
    modalVideo.currentTime = 0;
}

function downloadScript() {
    if (currentVideoIndex === -1) return;
    
    const video = videos[currentVideoIndex];
    
    // Create enhanced script with YouTube info
    const scriptContent = `Video Script: ${video.title || video.name}
Upload Date: ${video.uploadDate}
File Size: ${video.size}
YouTube ID: ${video.youtubeId || 'Chưa upload'}
YouTube URL: ${video.youtubeUrl || 'Chưa upload'}

[Ghi chú: Đây là script được tạo từ video "${video.title || video.name}"]
[Thời gian: ${new Date().toLocaleString('vi-VN')}]

---
Thông tin YouTube:
- Tiêu đề: ${video.title || video.name}
- Mô tả: ${video.description || 'Không có mô tả'}
- Tags: ${video.tags || 'Không có tags'}
- Quyền riêng tư: ${video.privacy || 'Không xác định'}

Nội dung video sẽ được hiển thị ở đây khi có công cụ trích xuất script.
Hiện tại đây chỉ là template cơ bản.
---
`;
    
    // Create and download file
    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `script_${(video.title || video.name).replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Đã tải script thành công!', 'success');
}

function deleteCurrentVideo() {
    if (currentVideoIndex === -1) return;
    
    if (confirm('Bạn có chắc chắn muốn xóa video này?')) {
        videos.splice(currentVideoIndex, 1);
        updateVideoGrid();
        closeVideoModal();
        showNotification('Đã xóa video thành công!', 'success');
    }
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation keyframes
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Local storage functions
function saveVideos() {
    try {
        localStorage.setItem('uploadedVideos', JSON.stringify(videos));
    } catch (error) {
        console.error('Không thể lưu video vào localStorage:', error);
    }
}

function loadVideos() {
    try {
        const saved = localStorage.getItem('uploadedVideos');
        if (saved) {
            videos = JSON.parse(saved);
            updateVideoGrid();
        }
    } catch (error) {
        console.error('Không thể tải video từ localStorage:', error);
        videos = [];
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && videoModal.style.display === 'block') {
        closeVideoModal();
    }
});

// Auto-save every 30 seconds
setInterval(saveVideos, 30000);
