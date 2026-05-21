(function() {
  // 1. Inject Puter script tag if it doesn't exist
  if (!document.querySelector('script[src*="puter.com"]')) {
    const puterScript = document.createElement('script');
    puterScript.src = "https://js.puter.com/v2/";
    puterScript.async = true;
    document.head.appendChild(puterScript);
  }

  // 2. Inject CSS for settings button and modal
  const styles = `
    .settings-trigger {
      position: absolute;
      top: 1.2rem;
      right: 1.2rem;
      cursor: pointer;
      font-size: 0.85rem;
      color: var(--settings-text, #555);
      background: var(--settings-bg, #ffffff);
      padding: 0.4rem 0.85rem;
      border-radius: 999px;
      border: 1px solid var(--settings-border, #e0c8c0);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      z-index: 99;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
      font-weight: 500;
    }
    .settings-trigger:hover {
      background: var(--settings-sec-bg, #fff0f4);
      color: var(--settings-accent, #D4537E);
      border-color: var(--settings-accent, #D4537E);
      transform: translateY(-1px);
    }
    .settings-modal {
      display: none;
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      z-index: 10000;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      box-sizing: border-box;
    }
    .settings-modal.show {
      display: flex;
    }
    .settings-content {
      background: white;
      border-radius: 18px;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: settingsFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes settingsFadeIn {
      from { opacity: 0; transform: scale(0.96) translateY(8px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .settings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.1rem 1.4rem;
      background: var(--settings-sec-bg, #fdf6ee);
      border-bottom: 1px solid var(--settings-border, #f0e0d8);
    }
    .settings-header h3 {
      font-family: 'Playfair Display', serif;
      color: var(--settings-text, #1a1a1a);
      font-size: 1.25rem;
      margin: 0;
      font-weight: 600;
    }
    .settings-close-btn {
      cursor: pointer;
      font-size: 1.5rem;
      color: #999;
      line-height: 1;
      border: none;
      background: none;
      transition: color 0.15s;
    }
    .settings-close-btn:hover {
      color: var(--settings-accent, #D4537E);
    }
    .settings-body {
      padding: 1.4rem;
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
      box-sizing: border-box;
    }
    .settings-field {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .settings-field label {
      font-size: 0.72rem;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }
    .settings-field input, .settings-field select {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      padding: 0.65rem 0.8rem;
      border-radius: 10px;
      border: 1.5px solid var(--settings-border, #e8d5cc);
      background: #fefaf8;
      color: var(--settings-text, #1a1a1a);
      outline: none;
      transition: all 0.2s;
      width: 100%;
      box-sizing: border-box;
    }
    .settings-field input:focus, .settings-field select:focus {
      border-color: var(--settings-accent, #D4537E);
      background: white;
    }
    .settings-help {
      font-size: 0.75rem;
      color: #777;
      line-height: 1.4;
      margin-top: 0.1rem;
    }
    .settings-help a {
      color: var(--settings-accent, #D4537E);
      text-decoration: none;
      font-weight: 500;
    }
    .settings-help a:hover {
      text-decoration: underline;
    }
    .settings-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .settings-checkbox {
      width: 16px;
      height: 16px;
      cursor: pointer;
      accent-color: var(--settings-accent, #D4537E);
    }
    .settings-checkbox-label {
      font-size: 0.85rem;
      color: var(--settings-text, #1a1a1a);
      cursor: pointer;
      user-select: none;
    }
    .save-settings-btn {
      background: var(--settings-accent, #D4537E);
      color: white;
      border: none;
      border-radius: 12px;
      padding: 0.8rem;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.15s, transform 0.1s;
      margin-top: 0.5rem;
      width: 100%;
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
      font-family: inherit;
    }
    .save-settings-btn:hover {
      opacity: 0.92;
    }
    .save-settings-btn:active {
      transform: scale(0.98);
    }
    
    /* Responsive adjustment for trigger button on mobile */
    @media (max-width: 600px) {
      .settings-trigger {
        top: 0.6rem;
        right: 0.6rem;
        font-size: 0.75rem;
        padding: 0.3rem 0.6rem;
      }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // 3. Inject DOM Elements on load
  function initDOM() {
    // Add trigger
    const trigger = document.createElement('div');
    trigger.className = 'settings-trigger';
    trigger.innerHTML = '⚙️ AI Config';
    trigger.onclick = toggleSettingsModal;
    document.body.appendChild(trigger);

    // Add modal
    const modal = document.createElement('div');
    modal.className = 'settings-modal';
    modal.id = 'aiSettingsModal';
    modal.innerHTML = `
      <div class="settings-content">
        <div class="settings-header">
          <h3>AI Settings</h3>
          <button class="settings-close-btn" onclick="toggleSettingsModal()">&times;</button>
        </div>
        <div class="settings-body">
          <div class="settings-field">
            <label>AI Provider</label>
            <select id="aiProviderSelect">
              <option value="puter">Puter.js (Free & No Key Required)</option>
              <option value="gemini">Google Gemini (Key Required)</option>
              <option value="openai">OpenAI (Key Required)</option>
              <option value="openrouter">OpenRouter (Key Required)</option>
            </select>
          </div>
          
          <div class="settings-field" id="aiKeyField" style="display:none;">
            <label id="aiKeyLabel">API Key</label>
            <input type="password" id="aiApiKeyInput" placeholder="Paste your API key here..." />
            <small id="aiKeyHelp" class="settings-help"></small>
          </div>
          
          <div class="settings-field">
            <label>Model (Optional)</label>
            <input type="text" id="aiModelInput" placeholder="e.g. gpt-4o-mini, gemini-1.5-flash..." />
            <small class="settings-help">Leave blank to use the provider's default model.</small>
          </div>

          <div class="settings-field settings-row">
            <input type="checkbox" id="aiSearchCheckbox" class="settings-checkbox" />
            <label for="aiSearchCheckbox" class="settings-checkbox-label">Enable Web Search (Puter/OpenRouter/Gemini)</label>
          </div>
          
          <button class="save-settings-btn" onclick="saveAISettings()">Save Changes</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Set values from localStorage
    loadAISettings();

    // Attach event listener for provider change
    document.getElementById('aiProviderSelect').addEventListener('change', onProviderChange);
    
    // Close modal on background click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) toggleSettingsModal();
    });
  }

  // Toggle modal function
  window.toggleSettingsModal = function() {
    const modal = document.getElementById('aiSettingsModal');
    if (modal) {
      modal.classList.toggle('show');
      if (modal.classList.contains('show')) {
        loadAISettings(); // reload current settings
      }
    }
  };

  // On provider selection change
  function onProviderChange() {
    const provider = document.getElementById('aiProviderSelect').value;
    const keyField = document.getElementById('aiKeyField');
    const keyLabel = document.getElementById('aiKeyLabel');
    const keyHelp = document.getElementById('aiKeyHelp');
    const modelInput = document.getElementById('aiModelInput');

    if (provider === 'puter') {
      keyField.style.display = 'none';
      modelInput.placeholder = 'gpt-4o-mini';
    } else {
      keyField.style.display = 'flex';
      
      if (provider === 'gemini') {
        keyLabel.textContent = 'Gemini API Key';
        keyHelp.innerHTML = 'Get a free Gemini API Key from <a href="https://aistudio.google.com/" target="_blank">Google AI Studio</a>';
        modelInput.placeholder = 'gemini-1.5-flash';
      } else if (provider === 'openai') {
        keyLabel.textContent = 'OpenAI API Key';
        keyHelp.innerHTML = 'Get an API Key from <a href="https://platform.openai.com/api-keys" target="_blank">OpenAI Platform</a>';
        modelInput.placeholder = 'gpt-4o-mini';
      } else if (provider === 'openrouter') {
        keyLabel.textContent = 'OpenRouter API Key';
        keyHelp.innerHTML = 'Get a key (free models available) from <a href="https://openrouter.ai/keys" target="_blank">OpenRouter</a>';
        modelInput.placeholder = 'google/gemma-2-9b-it:free';
      }
    }
  }

  // Load from localStorage
  function loadAISettings() {
    const provider = localStorage.getItem('ai_provider') || 'puter';
    const apiKey = localStorage.getItem('ai_api_key') || '';
    const model = localStorage.getItem('ai_model') || '';
    const search = localStorage.getItem('ai_web_search') === 'true';

    const providerSelect = document.getElementById('aiProviderSelect');
    const apiKeyInput = document.getElementById('aiApiKeyInput');
    const modelInput = document.getElementById('aiModelInput');
    const searchCheckbox = document.getElementById('aiSearchCheckbox');

    if (providerSelect) providerSelect.value = provider;
    if (apiKeyInput) apiKeyInput.value = apiKey;
    if (modelInput) modelInput.value = model;
    if (searchCheckbox) searchCheckbox.checked = search;

    onProviderChange();
  }

  // Save to localStorage
  window.saveAISettings = function() {
    const provider = document.getElementById('aiProviderSelect').value;
    const apiKey = document.getElementById('aiApiKeyInput').value.trim();
    const model = document.getElementById('aiModelInput').value.trim();
    const search = document.getElementById('aiSearchCheckbox').checked;

    localStorage.setItem('ai_provider', provider);
    localStorage.setItem('ai_api_key', apiKey);
    localStorage.setItem('ai_model', model);
    localStorage.setItem('ai_web_search', search);

    toggleSettingsModal();
    
    // Quick user feedback toast (optional, alert fallback)
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:8px 16px;border-radius:20px;font-size:0.8rem;z-index:100000;opacity:0;transition:opacity 0.3s;';
    alertDiv.textContent = 'AI Settings saved successfully! ✨';
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.style.opacity = '1', 50);
    setTimeout(() => {
      alertDiv.style.opacity = '0';
      setTimeout(() => alertDiv.remove(), 300);
    }, 2000);
  };

  // 4. Central Call AI API function
  window.callAI = async function(prompt, systemInstruction = "") {
    const provider = localStorage.getItem('ai_provider') || 'puter';
    const apiKey = localStorage.getItem('ai_api_key') || '';
    const customModel = localStorage.getItem('ai_model') || '';
    const searchEnabled = localStorage.getItem('ai_web_search') === 'true';

    if (provider === 'puter') {
      if (typeof puter === 'undefined') {
        throw new Error("Puter.js library is still loading. Please try again in a moment!");
      }
      
      const messages = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });
      
      const options = {
        model: customModel || 'gpt-4o-mini'
      };
      
      if (searchEnabled) {
        options.tools = [{ type: 'web_search' }];
      }
      
      const response = await puter.ai.chat(messages, options);
      if (typeof response === 'string') return response;
      if (response && response.message && response.message.content) {
        return response.message.content;
      }
      return response.toString();
    }

    if (provider === 'gemini') {
      if (!apiKey) throw new Error("Please configure your Gemini API Key in the settings (⚙️ AI Config).");
      const model = customModel || 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      const bodyPayload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: (systemInstruction ? systemInstruction + "\n\n" : "") + prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7
        }
      };

      if (searchEnabled) {
        bodyPayload.tools = [{ googleSearchRetrieval: {} }];
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Gemini API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts[0]) {
        throw new Error("Received empty response from Gemini API.");
      }
      return data.candidates[0].content.parts[0].text;
    }

    if (provider === 'openai') {
      if (!apiKey) throw new Error("Please configure your OpenAI API Key in the settings (⚙️ AI Config).");
      const model = customModel || 'gpt-4o-mini';
      const url = `https://api.openai.com/v1/chat/completions`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `OpenAI API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    }

    if (provider === 'openrouter') {
      if (!apiKey) throw new Error("Please configure your OpenRouter API Key in the settings (⚙️ AI Config).");
      const model = customModel || 'google/gemma-2-9b-it:free';
      const url = `https://openrouter.ai/api/v1/chat/completions`;
      
      const bodyPayload = {
        model: model,
        messages: [
          ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      };

      if (searchEnabled) {
        bodyPayload.plugins = [{ id: "web-search" }];
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Flirt Engine'
        },
        body: JSON.stringify(bodyPayload)
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `OpenRouter API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    }

    throw new Error("Unsupported AI provider selected.");
  };

  // Run DOM injection
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDOM);
  } else {
    initDOM();
  }
})();
