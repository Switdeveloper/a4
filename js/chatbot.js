// Chatbot Configuration
const CHATBOT_CONFIG = {
  webhookUrl: 'https://n8n-cfdeljun.us-west-1.clawcloudrun.com/webhook/ced5d0d8-1d54-4723-b33e-5003fb6d68a9',
  botName: 'Freedman Assistant',
  welcomeMessage: "Hi! I'm your Freedman Insurance assistant. How can I help you today?"
};

// Global reference for template literal access
const CHATBOT = CHATBOT_CONFIG;

// Chatbot State
let chatHistory = [];

// Initialize Chatbot
function initChatbot() {
  // Create chatbot HTML structure
  createChatbotHTML();
  
  // Add event listeners
  const toggle = document.getElementById('chatbot-toggle');
  const close = document.getElementById('chatbot-close');
  const send = document.getElementById('chatbot-send');
  const input = document.getElementById('chatbot-input');
  
  toggle.addEventListener('click', toggleChatbot);
  close.addEventListener('click', closeChatbot);
  send.addEventListener('click', sendMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}

// Create Chatbot HTML
function createChatbotHTML() {
  const chatbotHTML = `
    <div class="chatbot-container" id="chatbot-container">
      <div class="chatbot-window" id="chatbot-window">
        <div class="chatbot-header">
          <h3>${CHATBOT.botName}</h3>
          <button class="chatbot-close" id="chatbot-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="chatbot-messages" id="chatbot-messages">
          <div class="chatbot-welcome">
            <div class="chatbot-welcome-icon">
              <i class="fas fa-comments"></i>
            </div>
            <h4>Welcome!</h4>
            <p>Ask me anything about our insurance products</p>
          </div>
        </div>
        <div class="chatbot-input-container">
          <input 
            type="text" 
            class="chatbot-input" 
            id="chatbot-input" 
            placeholder="Type your message..."
            autocomplete="off"
          >
          <button class="chatbot-send" id="chatbot-send">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
      <button class="chatbot-toggle" id="chatbot-toggle">
        <i class="fas fa-comments"></i>
      </button>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);
}

// Toggle Chatbot Window
function toggleChatbot() {
  const window = document.getElementById('chatbot-window');
  const toggle = document.getElementById('chatbot-toggle');
  window.classList.toggle('open');
  toggle.classList.toggle('active');
  
  if (window.classList.contains('open')) {
    // Focus input when opened
    setTimeout(() => {
      document.getElementById('chatbot-input').focus();
    }, 300);
  }
}

// Close Chatbot
function closeChatbot() {
  const window = document.getElementById('chatbot-window');
  const toggle = document.getElementById('chatbot-toggle');
  window.classList.remove('open');
  toggle.classList.remove('active');
}

// Send Message
async function sendMessage() {
  const input = document.getElementById('chatbot-input');
  const message = input.value.trim();
  
  if (!message) return;
  
  // Add user message to chat
  addMessage(message, 'user');
  input.value = '';
  
  // Show typing indicator
  showTyping();
  
  // Disable send button
  const sendBtn = document.getElementById('chatbot-send');
  sendBtn.disabled = true;
  
  try {
    // Send to webhook
    const response = await fetch(CHATBOT_CONFIG.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        conversation_id: getConversationId(),
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    
    // Hide typing indicator
    hideTyping();
    
    // Add bot response
    const botMessage = data.response || data.message || "I'm sorry, I couldn't process that. Please try again.";
    addMessage(botMessage, 'bot');
    
  } catch (error) {
    console.error('Chatbot error:', error);
    hideTyping();
    addMessage("I'm sorry, I'm having trouble connecting right now. Please try again later.", 'bot');
  } finally {
    sendBtn.disabled = false;
  }
}

// Add Message to Chat
function addMessage(text, type) {
  const messagesContainer = document.getElementById('chatbot-messages');
  
  // Remove welcome message if it exists
  const welcome = messagesContainer.querySelector('.chatbot-welcome');
  if (welcome) {
    welcome.remove();
  }
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `chatbot-message ${type}`;
  
  messageDiv.innerHTML = `
    <div class="chatbot-message-content">${escapeHtml(text)}</div>
  `;
  
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Show Typing Indicator
function showTyping() {
  const messagesContainer = document.getElementById('chatbot-messages');
  
  const typingDiv = document.createElement('div');
  typingDiv.className = 'chatbot-message bot';
  typingDiv.id = 'chatbot-typing';
  
  typingDiv.innerHTML = `
    <div class="chatbot-message-content">
      <div class="chatbot-typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  
  messagesContainer.appendChild(typingDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Hide Typing Indicator
function hideTyping() {
  const typing = document.getElementById('chatbot-typing');
  if (typing) {
    typing.remove();
  }
}

// Get or Create Conversation ID
function getConversationId() {
  let convId = localStorage.getItem('chatbot_conversation_id');
  if (!convId) {
    convId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatbot_conversation_id', convId);
  }
  return convId;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}
