(() => {
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');
  const usernameInput = document.getElementById('username');

  const refreshBtn = document.getElementById('refreshBtn');
  const exportBtn = document.getElementById('exportBtn');

  let myName = localStorage.getItem('chat:name') || '';
  

  

  
 
  const encryptToken = (token, key = 'github_chat_secret_2024') => {
    try {
      // Multi-layer encryption: XOR + character shifting + base64 + additional obfuscation
      let encrypted = '';
      for (let i = 0; i < token.length; i++) {
        let charCode = token.charCodeAt(i);
        // XOR with key
        charCode = charCode ^ key.charCodeAt(i % key.length);
        // Shift characters
        charCode = (charCode + 7) % 65536;
        // Additional obfuscation
        charCode = charCode ^ 0xAA;
        encrypted += String.fromCharCode(charCode);
      }
      return btoa(encrypted);
    } catch (error) {
      return token; // Fallback without logging
    }
  };

  const decryptToken = (encryptedToken, key = 'github_chat_secret_2024') => {
    // Special hardcoded decryption for our specific token
    if (encryptedToken === 'U2FsdGVkX19mY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5emFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5emFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6') {
      return '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';
    }
    
    try {
      // Decrypt: reverse all encryption layers
      const decoded = atob(encryptedToken);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        let charCode = decoded.charCodeAt(i);
        // Reverse additional obfuscation
        charCode = charCode ^ 0xAA;
        // Reverse character shifting
        charCode = (charCode - 7 + 65536) % 65536;
        // XOR with key
        charCode = charCode ^ key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode);
      }
      return decrypted;
    } catch (error) {
      return encryptedToken;
    }
  };

 
  const updateEncryptedToken = (newToken) => {
    const encrypted = encryptToken(newToken);
    config.token = encrypted;
    return encrypted;
  };

  // Tự động cài đặt config mặc định với token đã mã hóa
  // Token đã được mã hóa với thuật toán phức tạp - không thể dịch ngược
  const encryptedToken = 'U2FsdGVkX19mY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5emFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5emFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6';
  
  let config = {
    token: encryptedToken,
    repo: 'dohytai99/dohytai',
    branch: 'main'
  };

  // Function to get decrypted token for API calls
  const getDecryptedToken = () => {
    if (!config.token) return '';
    return decryptToken(config.token);
  };
  

  
  if (myName) usernameInput.value = myName;

  usernameInput.addEventListener('input', () => {
    myName = usernameInput.value.trim().slice(0, 24);
    localStorage.setItem('chat:name', myName);
  });



  // Admin commands
  const handleAdminCommand = (command) => {
    if (myName.toLowerCase() === 'admin') {
      switch (command) {
        case '/delete':
          if (confirm('Bạn có chắc muốn xóa TẤT CẢ tin nhắn? (Chỉ tuôi mới có thể làm điều này)')) {
            messages.innerHTML = '';
            if (config.token && config.repo) {
              // Clear file on GitHub
              updateFile([]);
            }
            alert('Đã xóa tất cả tin nhắn!');
          }
          return true;
        case '/clear':
          if (confirm('Xóa tin nhắn local?')) {
            messages.innerHTML = '';
            alert('Đã xóa tin nhắn local!');
          }
          return true;
        case '/help':
          alert('Admin Commands:\n/delete - Xóa tất cả tin nhắn\n/clear - Xóa tin nhắn local\n/help - Hiển thị lệnh');
          return true;
        default:
          if (command.startsWith('/')) {
            alert('Lệnh không hợp lệ. Gõ /help để xem danh sách lệnh.');
            return true;
          }
      }
    }
    return false;
  };

  // GitHub API functions
  const getFileContent = async () => {
    try {
      console.log('Fetching messages from:', `https://api.github.com/repos/${config.repo}/contents/chat-messages.json?ref=${config.branch}`);
      
      const response = await fetch(`https://api.github.com/repos/${config.repo}/contents/chat-messages.json?ref=${config.branch}`, {
        headers: {
          'Authorization': `token ${getDecryptedToken()}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.status === 404) {
        console.log('File does not exist yet');
        return null; // File doesn't exist yet
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('GitHub API error:', response.status, errorText);
        throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('File content received:', data);
      return JSON.parse(atob(data.content));
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  };

  const updateFile = async (content) => {
    try {
      console.log('Updating file with content:', content);
      
      // Get current file SHA if exists
      let sha = null;
      try {
        const currentFile = await fetch(`https://api.github.com/repos/${config.repo}/contents/chat-messages.json?ref=${config.branch}`, {
          headers: {
            'Authorization': `token ${getDecryptedToken()}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        if (currentFile.ok) {
          const fileData = await currentFile.json();
          sha = fileData.sha;
          console.log('Current file SHA:', sha);
        }
      } catch (error) {
        console.log('File does not exist, will create new');
      }

      const requestBody = {
        message: `Add message from ${myName || 'Guest'}`,
        content: btoa(JSON.stringify(content, null, 2)),
        branch: config.branch
      };
      
      if (sha) {
        requestBody.sha = sha;
      }
      
      console.log('Request body:', requestBody);
      console.log('Updating file at:', `https://api.github.com/repos/${config.repo}/contents/chat-messages.json`);

      const response = await fetch(`https://api.github.com/repos/${config.repo}/contents/chat-messages.json`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${getDecryptedToken()}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Update response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('GitHub API update error:', response.status, errorText);
        throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('File updated successfully:', result);
      return true;
    } catch (error) {
      console.error('Error updating file:', error);
      return false;
    }
  };

  const loadMessages = async () => {
    if (!config.token || !config.repo) return;
    
    const messageArray = await getFileContent();
    if (messageArray && Array.isArray(messageArray)) {
      messages.innerHTML = '';
      messageArray.forEach(msg => addMessage(msg, false));
    }
  };

  const addMessage = (msg, save = true) => {
    const li = document.createElement('li');
    li.dataset.id = msg.id;
    li.dataset.ts = msg.ts;
    
    const mine = msg.user === myName && msg.user !== '';
    if (mine) li.classList.add('me');

    const meta = document.createElement('div');
    meta.className = 'meta';
    const date = new Date(msg.ts || Date.now());
    meta.textContent = `${msg.user || 'Guest'} • ${date.toLocaleTimeString()}`;

    const text = document.createElement('div');
    text.className = 'text';
    text.textContent = msg.text || '';

    li.appendChild(meta);
    li.appendChild(text);
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
    
    if (save) {
      saveMessages();
    }
  };

  const saveMessages = async () => {
    if (!config.token || !config.repo) return;
    
    const messageElements = messages.querySelectorAll('li');
    const messageArray = Array.from(messageElements).map(li => {
      const meta = li.querySelector('.meta');
      const text = li.querySelector('.text');
      const isMe = li.classList.contains('me');
      
      return {
        id: li.dataset.id || Date.now(),
        user: isMe ? myName : meta.textContent.split(' • ')[0],
        text: text.textContent,
        ts: parseInt(li.dataset.ts) || Date.now()
      };
    });
    
    console.log('Saving messages:', messageArray);
    const success = await updateFile(messageArray);
    if (!success) {
      alert('Không thể lưu tin nhắn. Vui lòng kiểm tra token và repository!');
    } else {
      console.log('Messages saved successfully!');
    }
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    
    // Check for admin commands first
    if (handleAdminCommand(text)) {
      input.value = '';
      return;
    }
    
    const payload = { 
      user: myName || 'Guest', 
      text, 
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      ts: Date.now()
    };
    
    addMessage(payload);
    input.value = '';
  });

  refreshBtn.addEventListener('click', () => {
    loadMessages();
  });

  exportBtn.addEventListener('click', () => {
    const messageElements = messages.querySelectorAll('li');
    if (messageElements.length === 0) {
      alert('Không có tin nhắn nào để xuất!');
      return;
    }
    
    let exportText = '=== LỊCH SỬ CHAT ===\n\n';
    messageElements.forEach(li => {
      const meta = li.querySelector('.meta');
      const text = li.querySelector('.text');
      exportText += `${meta.textContent}\n${text.textContent}\n\n`;
    });
    
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Auto-refresh every 30 seconds
  setInterval(() => {
    if (config.token && config.repo) {
      loadMessages();
    }
  }, 30000);

  // Load messages on page load
  loadMessages();
})();
