// P2P File Transfer using PeerJS
class P2PFileTransfer {
    constructor() {
        this.peer = null;
        this.connection = null;
        this.roomCode = null;
        this.isHost = false;
        this.selectedFiles = [];
        this.receivedFiles = [];
        this.fileChunks = new Map();
        this.chunkSize = 64 * 1024; // 64KB chunks
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 3;
        this.reconnectInterval = null;
        
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.checkForRoomCode();
    }

    setupEventListeners() {
        // File input change
        const fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Drag and drop
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        uploadArea.addEventListener('click', () => fileInput.click());
    }

    // Check URL for room code
    checkForRoomCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const roomCode = urlParams.get('room');
        if (roomCode) {
            document.getElementById('roomCode').value = roomCode;
            this.joinRoom();
        }
    }

    // Create a new room (Host)
    async createRoom() {
        try {
            this.showLoading('Đang tạo phòng...');
            
            // Generate room code
            this.roomCode = this.generateRoomCode();
            this.isHost = true;
            
            // Initialize PeerJS with better configuration
            this.peer = new Peer(this.roomCode, {
                host: 'peerjs-server.herokuapp.com',
                port: 443,
                secure: true,
                config: {
                    'iceServers': [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' },
                        { urls: 'stun:stun2.l.google.com:19302' },
                        { urls: 'stun:stun3.l.google.com:19302' },
                        { urls: 'stun:stun4.l.google.com:19302' }
                    ]
                },
                debug: 3,
                retryLimit: 5
            });

            this.setupPeerEventListeners();
            this.showConnectionInfo();
            this.showQRCode();
            this.showTransferSection();
            
            this.hideLoading();
            
        } catch (error) {
            this.hideLoading();
            alert('Có lỗi xảy ra khi tạo phòng: ' + error.message);
            console.error('Create room error:', error);
        }
    }

    // Join an existing room (Client)
    async joinRoom() {
        const roomCode = document.getElementById('roomCode').value.trim();
        
        if (!roomCode) {
            alert('Vui lòng nhập mã phòng!');
            return;
        }

        try {
            this.showLoading('Đang tham gia phòng...');
            
            this.roomCode = roomCode;
            this.isHost = false;
            
            // Initialize PeerJS with better configuration
            this.peer = new Peer({
                host: 'peerjs-server.herokuapp.com',
                port: 443,
                secure: true,
                config: {
                    'iceServers': [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' },
                        { urls: 'stun:stun2.l.google.com:19302' },
                        { urls: 'stun:stun3.l.google.com:19302' },
                        { urls: 'stun:stun4.l.google.com:19302' }
                    ]
                },
                debug: 3,
                retryLimit: 5
            });

            this.setupPeerEventListeners();
            this.showConnectionInfo();
            this.showTransferSection();
            
            this.hideLoading();
            
        } catch (error) {
            this.hideLoading();
            alert('Có lỗi xảy ra khi tham gia phòng: ' + error.message);
            console.error('Join room error:', error);
        }
    }

    // Setup PeerJS event listeners
    setupPeerEventListeners() {
        this.peer.on('open', (id) => {
            console.log('Peer connected with ID:', id);
            this.updateStatus('Đã kết nối', 'connected');
            this.reconnectAttempts = 0; // Reset reconnect attempts
            
            if (this.isHost) {
                this.updateConnectionStatus('Chờ thiết bị khác tham gia...');
            } else {
                this.connectToHost();
            }
        });

        this.peer.on('connection', (conn) => {
            console.log('Incoming connection from:', conn.peer);
            this.connection = conn;
            this.setupConnectionEventListeners();
            this.updateConnectionStatus('Đã kết nối với thiết bị khác');
            this.showReconnectButton(false);
        });

        this.peer.on('error', (error) => {
            console.error('Peer error:', error);
            this.updateStatus('Lỗi kết nối', 'error');
            this.updateConnectionStatus('Lỗi: ' + error.message);
            
            // Try to reconnect automatically
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.scheduleReconnect();
            } else {
                this.showReconnectButton(true);
            }
        });

        this.peer.on('disconnected', () => {
            console.log('Peer disconnected');
            this.updateStatus('Mất kết nối', 'disconnected');
            this.updateConnectionStatus('Mất kết nối với thiết bị khác');
            
            // Try to reconnect automatically
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                this.scheduleReconnect();
            } else {
                this.showReconnectButton(true);
            }
        });

        this.peer.on('close', () => {
            console.log('Peer connection closed');
            this.updateStatus('Kết nối đã đóng', 'disconnected');
            this.updateConnectionStatus('Kết nối đã đóng');
        });
    }

    // Schedule automatic reconnect
    scheduleReconnect() {
        this.reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000); // Exponential backoff
        
        this.updateConnectionStatus(`Đang thử kết nối lại... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        setTimeout(() => {
            if (this.peer && this.peer.disconnected) {
                this.peer.reconnect();
            }
        }, delay);
    }

    // Show reconnect button
    showReconnectButton(show) {
        let reconnectBtn = document.getElementById('reconnectBtn');
        
        if (show && !reconnectBtn) {
            reconnectBtn = document.createElement('button');
            reconnectBtn.id = 'reconnectBtn';
            reconnectBtn.className = 'reconnect-btn';
            reconnectBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Kết nối lại';
            reconnectBtn.onclick = () => this.manualReconnect();
            
            const connectionInfo = document.getElementById('connectionInfo');
            connectionInfo.appendChild(reconnectBtn);
            
            // Show troubleshooting tips
            document.getElementById('troubleshootingTips').style.display = 'block';
        } else if (!show && reconnectBtn) {
            reconnectBtn.remove();
            document.getElementById('troubleshootingTips').style.display = 'none';
        }
    }

    // Manual reconnect
    manualReconnect() {
        this.reconnectAttempts = 0;
        this.updateConnectionStatus('Đang kết nối lại...');
        
        if (this.peer) {
            this.peer.reconnect();
        }
    }

    // Connect to host (Client)
    connectToHost() {
        try {
            this.connection = this.peer.connect(this.roomCode, {
                reliable: true,
                maxRetries: 3
            });
            this.setupConnectionEventListeners();
            this.updateConnectionStatus('Đang kết nối với chủ phòng...');
        } catch (error) {
            console.error('Connection error:', error);
            this.updateConnectionStatus('Không thể kết nối với chủ phòng');
        }
    }

    // Setup connection event listeners
    setupConnectionEventListeners() {
        this.connection.on('open', () => {
            console.log('Connection established');
            this.updateConnectionStatus('Đã kết nối thành công!');
            this.showReconnectButton(false);
        });

        this.connection.on('data', (data) => {
            this.handleIncomingData(data);
        });

        this.connection.on('close', () => {
            console.log('Connection closed');
            this.updateConnectionStatus('Kết nối đã đóng');
            this.showReconnectButton(true);
        });

        this.connection.on('error', (error) => {
            console.error('Connection error:', error);
            this.updateConnectionStatus('Lỗi kết nối: ' + error.message);
            this.showReconnectButton(true);
        });
    }

    // Handle incoming data
    handleIncomingData(data) {
        if (data.type === 'file-start') {
            this.handleFileStart(data);
        } else if (data.type === 'file-chunk') {
            this.handleFileChunk(data);
        } else if (data.type === 'file-end') {
            this.handleFileEnd(data);
        } else if (data.type === 'file-info') {
            this.handleFileInfo(data);
        }
    }

    // Handle file start
    handleFileStart(data) {
        const { fileId, fileName, fileSize, totalChunks } = data;
        
        this.fileChunks.set(fileId, {
            name: fileName,
            size: fileSize,
            totalChunks: totalChunks,
            receivedChunks: 0,
            chunks: new Array(totalChunks)
        });
        
        this.showTransferProgress();
        this.updateProgress(fileId, 0);
    }

    // Handle file chunk
    handleFileChunk(data) {
        const { fileId, chunkIndex, chunkData } = data;
        const fileInfo = this.fileChunks.get(fileId);
        
        if (fileInfo) {
            fileInfo.chunks[chunkIndex] = chunkData;
            fileInfo.receivedChunks++;
            
            const progress = (fileInfo.receivedChunks / fileInfo.totalChunks) * 100;
            this.updateProgress(fileId, progress);
        }
    }

    // Handle file end
    handleFileEnd(data) {
        const { fileId } = data;
        const fileInfo = this.fileChunks.get(fileId);
        
        if (fileInfo && fileInfo.receivedChunks === fileInfo.totalChunks) {
            // Reconstruct file
            const fileBlob = new Blob(fileInfo.chunks, { type: 'application/octet-stream' });
            const file = new File([fileBlob], fileInfo.name, { type: 'application/octet-stream' });
            
            this.receivedFiles.push({
                name: file.name,
                size: file.size,
                file: file,
                receivedAt: new Date()
            });
            
            this.displayReceivedFiles();
            this.fileChunks.delete(fileId);
            
            // Show success message
            this.showFileReceivedNotification(file.name);
        }
    }

    // Handle file info
    handleFileInfo(data) {
        const { fileName, fileSize } = data;
        this.showFileIncomingNotification(fileName, fileSize);
    }

    // Send files to connected peer
    async sendFiles() {
        if (!this.connection || this.connection.open !== true) {
            alert('Chưa kết nối với thiết bị khác!');
            return;
        }

        if (this.selectedFiles.length === 0) {
            alert('Vui lòng chọn ít nhất một file!');
            return;
        }

        for (const file of this.selectedFiles) {
            await this.sendFile(file);
        }

        // Clear selected files
        this.selectedFiles = [];
        this.hideFileList();
    }

    // Send a single file
    async sendFile(file) {
        try {
            const fileId = this.generateFileId();
            const totalChunks = Math.ceil(file.size / this.chunkSize);
            
            // Send file info
            this.connection.send({
                type: 'file-info',
                fileName: file.name,
                fileSize: file.size
            });
            
            // Send file start
            this.connection.send({
                type: 'file-start',
                fileId: fileId,
                fileName: file.name,
                fileSize: file.size,
                totalChunks: totalChunks
            });
            
            // Send file in chunks
            for (let i = 0; i < totalChunks; i++) {
                const start = i * this.chunkSize;
                const end = Math.min(start + this.chunkSize, file.size);
                const chunk = file.slice(start, end);
                
                const chunkData = await this.readChunkAsArrayBuffer(chunk);
                
                this.connection.send({
                    type: 'file-chunk',
                    fileId: fileId,
                    chunkIndex: i,
                    chunkData: chunkData
                });
                
                // Small delay to prevent overwhelming the connection
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            // Send file end
            this.connection.send({
                type: 'file-end',
                fileId: fileId
            });
            
        } catch (error) {
            console.error('Error sending file:', error);
            alert('Có lỗi xảy ra khi gửi file: ' + error.message);
        }
    }

    // Read chunk as ArrayBuffer
    readChunkAsArrayBuffer(chunk) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(chunk);
        });
    }

    // File handling methods
    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.addFilesToList(files);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        this.addFilesToList(files);
    }

    addFilesToList(files) {
        files.forEach(file => {
            if (!this.selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
                this.selectedFiles.push(file);
            }
        });
        
        this.updateFileList();
        this.showFileList();
    }

    updateFileList() {
        const selectedFilesDiv = document.getElementById('selectedFiles');
        selectedFilesDiv.innerHTML = '';
        
        this.selectedFiles.forEach((file, index) => {
            const fileItem = this.createFileItem(file, index);
            selectedFilesDiv.appendChild(fileItem);
        });
    }

    createFileItem(file, index) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const fileIcon = this.getFileIcon(file.type);
        const fileSize = this.formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas ${fileIcon} file-icon"></i>
                <div class="file-details">
                    <h4>${file.name}</h4>
                    <p>${fileSize}</p>
                </div>
            </div>
            <button class="remove-btn" onclick="p2pTransfer.removeFile(${index})">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        return fileItem;
    }

    getFileIcon(type) {
        if (type.startsWith('image/')) return 'fa-image';
        if (type.startsWith('video/')) return 'fa-video';
        if (type.startsWith('audio/')) return 'fa-music';
        if (type.includes('pdf')) return 'fa-file-pdf';
        if (type.includes('word') || type.includes('document')) return 'fa-file-word';
        if (type.includes('excel') || type.includes('spreadsheet')) return 'fa-file-excel';
        if (type.includes('powerpoint') || type.includes('presentation')) return 'fa-file-powerpoint';
        if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return 'fa-file-archive';
        if (type.includes('text') || type.includes('code')) return 'fa-file-code';
        return 'fa-file';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updateFileList();
        
        if (this.selectedFiles.length === 0) {
            this.hideFileList();
        }
    }

    showFileList() {
        document.getElementById('fileList').style.display = 'block';
    }

    hideFileList() {
        document.getElementById('fileList').style.display = 'none';
    }

    // UI methods
    showConnectionInfo() {
        document.getElementById('connectionInfo').style.display = 'block';
        document.getElementById('roomInfo').style.display = 'block';
        document.getElementById('roomCodeDisplay').textContent = this.roomCode;
    }

    showTransferSection() {
        document.getElementById('transferSection').style.display = 'block';
    }

    showQRCode() {
        const qrContainer = document.getElementById('qrCode');
        qrContainer.innerHTML = '';
        
        const qrData = `${window.location.origin}${window.location.pathname}?room=${this.roomCode}`;
        
        new QRCode(qrContainer, {
            text: qrData,
            width: 200,
            height: 200,
            colorDark: "#667eea",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        document.getElementById('qrRoomCode').textContent = this.roomCode;
        document.getElementById('qrSection').style.display = 'block';
    }

    showTransferProgress() {
        document.getElementById('transferProgress').style.display = 'block';
    }

    updateProgress(fileId, progress) {
        let progressItem = document.getElementById(`progress-${fileId}`);
        
        if (!progressItem) {
            const progressList = document.getElementById('progressList');
            progressItem = document.createElement('div');
            progressItem.className = 'progress-item';
            progressItem.id = `progress-${fileId}`;
            
            const fileInfo = this.fileChunks.get(fileId);
            progressItem.innerHTML = `
                <div class="progress-info">
                    <span class="filename">${fileInfo.name}</span>
                    <span class="progress-text">${Math.round(progress)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            `;
            
            progressList.appendChild(progressItem);
        } else {
            const progressFill = progressItem.querySelector('.progress-fill');
            const progressText = progressItem.querySelector('.progress-text');
            
            progressFill.style.width = progress + '%';
            progressText.textContent = Math.round(progress) + '%';
        }
    }

    displayReceivedFiles() {
        const receivedList = document.getElementById('receivedList');
        receivedList.innerHTML = '';
        
        this.receivedFiles.forEach((fileInfo, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'received-item';
            
            const fileIcon = this.getFileIcon(fileInfo.file.type);
            
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="fas ${fileIcon} file-icon"></i>
                    <div class="file-details">
                        <h4>${fileInfo.name}</h4>
                        <p>${this.formatFileSize(fileInfo.size)}</p>
                        <small>Nhận lúc: ${new Date(fileInfo.receivedAt).toLocaleString()}</small>
                    </div>
                </div>
                <button class="download-btn" onclick="p2pTransfer.downloadReceivedFile(${index})">
                    <i class="fas fa-download"></i> Tải xuống
                </button>
            `;
            
            receivedList.appendChild(fileItem);
        });
        
        document.getElementById('receivedFiles').style.display = 'block';
    }

    downloadReceivedFile(index) {
        const fileInfo = this.receivedFiles[index];
        const url = URL.createObjectURL(fileInfo.file);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = fileInfo.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    updateStatus(text, status) {
        document.getElementById('statusText').textContent = text;
        const statusDot = document.getElementById('statusDot');
        statusDot.className = `status-dot ${status}`;
    }

    updateConnectionStatus(text) {
        document.getElementById('connectionStatus').textContent = text;
    }

    showFileIncomingNotification(fileName, fileSize) {
        const notification = document.createElement('div');
        notification.className = 'notification incoming';
        notification.innerHTML = `
            <i class="fas fa-download"></i>
            <span>Đang nhận file: ${fileName} (${this.formatFileSize(fileSize)})</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showFileReceivedNotification(fileName) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check"></i>
            <span>Đã nhận file: ${fileName}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showLoading(text) {
        document.getElementById('loadingText').textContent = text;
        document.getElementById('loadingModal').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loadingModal').style.display = 'none';
    }

    // Utility methods
    generateRoomCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    generateFileId() {
        return 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    copyRoomCode() {
        navigator.clipboard.writeText(this.roomCode).then(() => {
            const btn = document.querySelector('.copy-room-btn');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-check"></i> Đã copy';
            btn.style.background = '#28a745';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '#667eea';
            }, 2000);
        }).catch(() => {
            alert('Không thể copy mã. Vui lòng copy thủ công: ' + this.roomCode);
        });
    }
}

// Global functions for HTML onclick
let p2pTransfer;

function createRoom() {
    p2pTransfer.createRoom();
}

function joinRoom() {
    p2pTransfer.joinRoom();
}

function sendFiles() {
    p2pTransfer.sendFiles();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    p2pTransfer = new P2PFileTransfer();
});
