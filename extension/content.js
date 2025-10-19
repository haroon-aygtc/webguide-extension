class PageAnalyzer {
  analyzeDOM() {
    const forms = Array.from(document.querySelectorAll('form'));
    const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
    const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
    const links = Array.from(document.querySelectorAll('a[href]'));
    const interactiveElements = Array.from(
      document.querySelectorAll('[onclick], [role="button"], [tabindex]')
    );

    return {
      forms,
      inputs,
      buttons,
      links,
      interactiveElements,
    };
  }

  getElementContext(element) {
    const label = this.findLabel(element);
    const placeholder = element.getAttribute('placeholder');
    const ariaLabel = element.getAttribute('aria-label');
    const title = element.getAttribute('title');
    const name = element.getAttribute('name');
    const id = element.getAttribute('id');

    return [label, placeholder, ariaLabel, title, name, id]
      .filter(Boolean)
      .join(' | ');
  }

  findLabel(element) {
    const id = element.getAttribute('id');
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (label) return label.textContent?.trim() || null;
    }

    const parentLabel = element.closest('label');
    if (parentLabel) return parentLabel.textContent?.trim() || null;

    return null;
  }

  getElementSelector(element) {
    if (element.id) return `#${element.id}`;
    
    const classes = Array.from(element.classList).slice(0, 2).join('.');
    if (classes) return `${element.tagName.toLowerCase()}.${classes}`;
    
    const name = element.getAttribute('name');
    if (name) return `${element.tagName.toLowerCase()}[name="${name}"]`;
    
    return element.tagName.toLowerCase();
  }

  isVisible(element) {
    const style = window.getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      style.opacity !== '0' &&
      element.offsetParent !== null
    );
  }
}

class VoiceService {
  constructor() {
    this.recognition = null;
    this.synthesis = window.speechSynthesis;
    this.isListening = false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  async startListening(onResult, onError) {
    if (!this.recognition) {
      onError?.('Speech recognition not supported');
      return;
    }

    if (this.isListening) return;

    this.isListening = true;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      this.isListening = false;
    };

    this.recognition.onerror = (event) => {
      onError?.(event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch (error) {
      this.isListening = false;
      onError?.('Failed to start recognition');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text, lang = 'en-US') {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject('Speech synthesis not supported');
        return;
      }

      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event.error);

      this.synthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}

const pageAnalyzer = new PageAnalyzer();
const voiceService = new VoiceService();

let assistantActive = false;
let currentLanguage = 'en';
let highlightedElement = null;

function createAssistantUI() {
  const container = document.createElement('div');
  container.id = 'ai-assistant-container';
  container.innerHTML = `
    <div id="ai-assistant-panel" style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 320px;
      background: white;
      border: 2px solid #3b82f6;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 999999;
      font-family: system-ui, -apple-system, sans-serif;
      display: none;
    ">
      <div style="
        background: #3b82f6;
        color: white;
        padding: 12px 16px;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
      " id="ai-assistant-header">
        <span style="font-weight: 600;">✨ AI Assistant</span>
        <button id="close-assistant" style="
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 0;
          width: 24px;
          height: 24px;
        ">×</button>
      </div>
      <div style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Language</label>
          <select id="language-select" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
          ">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="ar">العربية</option>
            <option value="hi">हिन्दी</option>
            <option value="pt">Português</option>
            <option value="ru">Русский</option>
          </select>
        </div>
        <div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Voice Commands</label>
          <div style="display: flex; gap: 8px;">
            <button id="start-listening" style="
              flex: 1;
              padding: 10px;
              background: #3b82f6;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
              font-weight: 500;
            ">🎤 Listen</button>
            <button id="speak-help" style="
              padding: 10px;
              background: #f3f4f6;
              border: 1px solid #d1d5db;
              border-radius: 6px;
              font-size: 14px;
              cursor: pointer;
            ">🔊</button>
          </div>
        </div>
        <div id="listening-indicator" style="
          display: none;
          padding: 12px;
          background: #dbeafe;
          border-radius: 6px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
        ">🎤 Listening...</div>
        <div style="
          padding: 12px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 12px;
        ">
          <p style="margin: 0 0 8px 0; font-weight: 500; color: #6b7280;">Try saying:</p>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            <span style="background: white; padding: 4px 8px; border-radius: 4px; border: 1px solid #e5e7eb;">Fill email</span>
            <span style="background: white; padding: 4px 8px; border-radius: 4px; border: 1px solid #e5e7eb;">Click submit</span>
            <span style="background: white; padding: 4px 8px; border-radius: 4px; border: 1px solid #e5e7eb;">Read page</span>
          </div>
        </div>
      </div>
    </div>
    <button id="toggle-assistant" style="
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      z-index: 999998;
    ">✨</button>
  `;
  
  document.body.appendChild(container);

  const panel = document.getElementById('ai-assistant-panel');
  const toggleBtn = document.getElementById('toggle-assistant');
  const closeBtn = document.getElementById('close-assistant');
  const listenBtn = document.getElementById('start-listening');
  const speakBtn = document.getElementById('speak-help');
  const langSelect = document.getElementById('language-select');
  const listeningIndicator = document.getElementById('listening-indicator');

  toggleBtn.addEventListener('click', () => {
    assistantActive = !assistantActive;
    panel.style.display = assistantActive ? 'block' : 'none';
    toggleBtn.style.display = assistantActive ? 'none' : 'block';
  });

  closeBtn.addEventListener('click', () => {
    assistantActive = false;
    panel.style.display = 'none';
    toggleBtn.style.display = 'block';
  });

  listenBtn.addEventListener('click', async () => {
    listeningIndicator.style.display = 'block';
    listenBtn.textContent = '⏹️ Stop';
    
    await voiceService.startListening(
      async (transcript) => {
        listeningIndicator.style.display = 'none';
        listenBtn.textContent = '🎤 Listen';
        
        await processVoiceCommand(transcript);
      },
      (error) => {
        listeningIndicator.style.display = 'none';
        listenBtn.textContent = '🎤 Listen';
        console.error('Voice error:', error);
      }
    );
  });

  speakBtn.addEventListener('click', () => {
    voiceService.speak('How can I help you navigate this page?');
  });

  langSelect.addEventListener('change', (e) => {
    currentLanguage = e.target.value;
    localStorage.setItem('assistantLanguage', currentLanguage);
  });

  makeDraggable(panel, document.getElementById('ai-assistant-header'));
}

function makeDraggable(element, handle) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  
  handle.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
    element.style.bottom = 'auto';
    element.style.right = 'auto';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

async function processVoiceCommand(command) {
  const pageText = document.body.innerText.substring(0, 1000);
  
  const lowerCommand = command.toLowerCase();
  
  if (lowerCommand.includes('fill') || lowerCommand.includes('enter')) {
    const inputs = pageAnalyzer.analyzeDOM().inputs;
    const visibleInputs = inputs.filter(input => pageAnalyzer.isVisible(input));
    
    if (visibleInputs.length > 0) {
      const input = visibleInputs[0];
      input.focus();
      highlightElement(input);
      await voiceService.speak('I found an input field. You can now type.');
    }
  } else if (lowerCommand.includes('click') || lowerCommand.includes('submit')) {
    const buttons = pageAnalyzer.analyzeDOM().buttons;
    const visibleButtons = buttons.filter(btn => pageAnalyzer.isVisible(btn));
    
    if (visibleButtons.length > 0) {
      const button = visibleButtons[0];
      highlightElement(button);
      await voiceService.speak('I found a button. Clicking it now.');
      setTimeout(() => button.click(), 1000);
    }
  } else if (lowerCommand.includes('read')) {
    const text = document.body.innerText.substring(0, 500);
    await voiceService.speak(text);
  } else {
    await voiceService.speak('I can help you fill forms, click buttons, or read the page. What would you like to do?');
  }
}

function highlightElement(element) {
  if (highlightedElement) {
    highlightedElement.remove();
  }

  const rect = element.getBoundingClientRect();
  const highlight = document.createElement('div');
  highlight.style.cssText = `
    position: fixed;
    left: ${rect.left - 4}px;
    top: ${rect.top - 4}px;
    width: ${rect.width + 8}px;
    height: ${rect.height + 8}px;
    border: 4px solid #3b82f6;
    background: rgba(59, 130, 246, 0.1);
    pointer-events: none;
    z-index: 999997;
    animation: pulse 1s infinite;
  `;
  
  document.body.appendChild(highlight);
  highlightedElement = highlight;
  
  setTimeout(() => {
    if (highlightedElement === highlight) {
      highlight.remove();
      highlightedElement = null;
    }
  }, 3000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createAssistantUI);
} else {
  createAssistantUI();
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleAssistant') {
    assistantActive = !assistantActive;
    const panel = document.getElementById('ai-assistant-panel');
    const toggleBtn = document.getElementById('toggle-assistant');
    if (panel && toggleBtn) {
      panel.style.display = assistantActive ? 'block' : 'none';
      toggleBtn.style.display = assistantActive ? 'none' : 'block';
    }
  }
  sendResponse({ success: true });
});
