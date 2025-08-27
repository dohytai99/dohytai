(() => {
  const form = document.getElementById('form');
  const input = document.getElementById('input');
  const messages = document.getElementById('messages');
  const usernameInput = document.getElementById('username');
  const clearBtn = document.getElementById('clearBtn');
  const exportBtn = document.getElementById('exportBtn');

  let myName = localStorage.getItem('chat:name') || '';
  if (myName) usernameInput.value = myName;
  
  usernameInput.addEventListener('input', () => {
    myName = usernameInput.value.trim().slice(0, 24);
    localStorage.setItem('chat:name', myName);
  });

  // Load messages from localStorage
  const loadMessages = () => {
    const savedMessages = localStorage.getItem('chat:messages');
    if (savedMessages) {
      try {
        const messageArray = JSON.parse(savedMessages);
        messageArray.forEach(msg => addMessage(msg, false));
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
  };

  // Save messages to localStorage
  const saveMessages = () => {
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
    
    localStorage.setItem('chat:messages', JSON.stringify(messageArray));
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    
    const payload = { 
      user: myName || 'Guest', 
      text, 
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      ts: Date.now()
    };
    
    addMessage(payload);
    input.value = '';
  });

  // Clear messages
  clearBtn.addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn xóa tất cả tin nhắn?')) {
      messages.innerHTML = '';
      localStorage.removeItem('chat:messages');
    }
  });

  // Export messages
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

  // Load messages on page load
  loadMessages();
})();
