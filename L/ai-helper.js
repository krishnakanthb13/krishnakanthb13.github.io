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
      position: fixed;
      top: 1rem;
      right: 1rem;
      cursor: pointer;
      font-family: 'Fredoka', 'Quicksand', sans-serif;
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--settings-accent, #f25e9c);
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(6px);
      padding: 0.5rem 1rem;
      border-radius: 999px;
      border: 2px solid var(--settings-border, #f6cfe2);
      transition: transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s, background 0.2s, color 0.2s;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      z-index: 9000;
      box-shadow: 0 4px 14px rgba(242,94,156,0.18);
    }
    .settings-trigger:hover {
      background: linear-gradient(135deg, #ff9ec7, var(--settings-accent, #f25e9c));
      color: #fff;
      border-color: #fff;
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 7px 20px rgba(242,94,156,0.35);
    }
    .settings-trigger:active { transform: scale(0.97); }

    .settings-modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(80, 28, 56, 0.42);
      backdrop-filter: blur(7px);
      z-index: 10000;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      box-sizing: border-box;
    }
    .settings-modal.show { display: flex; }

    .settings-content {
      background: var(--settings-bg, #fffafc);
      border-radius: 28px;
      width: 100%;
      max-width: 430px;
      max-height: 90vh;
      box-shadow: 0 22px 55px rgba(242,94,156,0.32), 0 0 0 6px rgba(255,255,255,0.45);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: settingsPop 0.34s cubic-bezier(0.34, 1.4, 0.64, 1);
    }
    @keyframes settingsPop {
      from { opacity: 0; transform: scale(0.9) translateY(16px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .settings-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      background: linear-gradient(135deg, #ff9ec7 0%, var(--settings-accent, #f25e9c) 60%, #c97ce8 100%);
    }
    .settings-header h3 {
      font-family: 'Fredoka', 'Quicksand', sans-serif;
      color: #fff;
      font-size: 1.3rem;
      font-weight: 600;
      margin: 0;
      letter-spacing: 0.3px;
      text-shadow: 0 2px 5px rgba(150,40,90,0.25);
    }
    .settings-close-btn {
      cursor: pointer;
      font-size: 1.3rem;
      color: #fff;
      line-height: 1;
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.16s, transform 0.16s;
    }
    .settings-close-btn:hover {
      background: rgba(255,255,255,0.5);
      transform: rotate(90deg);
    }

    .settings-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
      box-sizing: border-box;
      overflow-y: auto;
      min-height: 0;
    }
    .settings-body::-webkit-scrollbar { width: 8px; }
    .settings-body::-webkit-scrollbar-thumb {
      background: var(--settings-border, #f6cfe2);
      border-radius: 999px;
    }

    .settings-field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .settings-field label {
      font-family: 'Fredoka', 'Quicksand', sans-serif;
      font-size: 0.74rem;
      font-weight: 600;
      color: var(--settings-accent, #f25e9c);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 0;
    }
    .settings-field input, .settings-field select {
      font-family: 'Quicksand', 'DM Sans', sans-serif;
      font-weight: 500;
      font-size: 0.92rem;
      padding: 0.75rem 0.95rem;
      border-radius: 15px;
      border: 2.5px solid var(--settings-border, #f6cfe2);
      background: #fff;
      color: var(--settings-text, #6b2d4f);
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      width: 100%;
      box-sizing: border-box;
    }
    .settings-field select {
      appearance: none;
      -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23f25e9c' stroke-width='3' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.95rem center;
      padding-right: 2.4rem;
      cursor: pointer;
    }
    .settings-field input:focus, .settings-field select:focus {
      border-color: var(--settings-accent, #f25e9c);
      box-shadow: 0 0 0 4px rgba(255,143,192,0.2);
    }
    .settings-field input::placeholder { color: #d9b3c6; }

    .settings-help {
      font-family: 'Quicksand', 'DM Sans', sans-serif;
      font-size: 0.78rem;
      font-weight: 500;
      color: var(--settings-text, #b07f9b);
      line-height: 1.5;
      margin-top: 0.05rem;
    }
    .settings-help a {
      color: var(--settings-accent, #f25e9c);
      text-decoration: none;
      font-weight: 700;
    }
    .settings-help a:hover { text-decoration: underline; }

    .settings-row {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: var(--settings-sec-bg, #ffeaf4);
      border: 2px solid var(--settings-border, #f6cfe2);
      border-radius: 15px;
      padding: 0.8rem 0.95rem;
    }
    .settings-checkbox {
      width: 19px;
      height: 19px;
      cursor: pointer;
      flex-shrink: 0;
      accent-color: var(--settings-accent, #f25e9c);
    }
    .settings-checkbox-label {
      font-family: 'Quicksand', 'DM Sans', sans-serif;
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--settings-text, #6b2d4f);
      cursor: pointer;
      user-select: none;
    }

    .save-settings-btn {
      background: linear-gradient(135deg, #ff9ec7 0%, var(--settings-accent, #f25e9c) 60%, #c97ce8 100%);
      color: white;
      border: none;
      border-radius: 17px;
      padding: 0.95rem;
      font-family: 'Fredoka', 'Quicksand', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.15s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.2s;
      margin-top: 0.4rem;
      width: 100%;
      box-shadow: 0 7px 20px rgba(242,94,156,0.35);
    }
    .save-settings-btn:hover {
      transform: translateY(-2px) scale(1.01);
      box-shadow: 0 11px 26px rgba(242,94,156,0.45);
    }
    .save-settings-btn:active { transform: scale(0.98); }

    @media (max-width: 600px) {
      .settings-trigger {
        top: 0.6rem;
        right: 0.6rem;
        font-size: 0.74rem;
        padding: 0.4rem 0.75rem;
      }
      .settings-content { border-radius: 24px; }
      .settings-header { padding: 1.1rem 1.2rem; }
      .settings-body { padding: 1.2rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .settings-content { animation-duration: 0.01ms; }
      .settings-trigger, .save-settings-btn, .settings-close-btn { transition-duration: 0.01ms; }
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
              <option value="groq">Groq (Free Key · Super Fast)</option>
              <option value="gemini">Google Gemini (Free Key)</option>
              <option value="mistral">Mistral AI (Free Key)</option>
              <option value="cohere">Cohere (Free Key)</option>
              <option value="openrouter">OpenRouter (Free Models)</option>
              <option value="openai">OpenAI (Paid Key)</option>
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
      
      if (provider === 'groq') {
        keyLabel.textContent = 'Groq API Key';
        keyHelp.innerHTML = 'Get a free key (no card needed) from <a href="https://console.groq.com/keys" target="_blank">Groq Console</a>';
        modelInput.placeholder = 'llama-3.3-70b-versatile';
      } else if (provider === 'gemini') {
        keyLabel.textContent = 'Gemini API Key';
        keyHelp.innerHTML = 'Get a free Gemini API Key from <a href="https://aistudio.google.com/" target="_blank">Google AI Studio</a>';
        modelInput.placeholder = 'gemini-1.5-flash';
      } else if (provider === 'mistral') {
        keyLabel.textContent = 'Mistral API Key';
        keyHelp.innerHTML = 'Get a free key from <a href="https://console.mistral.ai/api-keys" target="_blank">Mistral Console</a>';
        modelInput.placeholder = 'mistral-small-latest';
      } else if (provider === 'cohere') {
        keyLabel.textContent = 'Cohere API Key';
        keyHelp.innerHTML = 'Get a free trial key from <a href="https://dashboard.cohere.com/api-keys" target="_blank">Cohere Dashboard</a>';
        modelInput.placeholder = 'command-r-plus';
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

    // OpenAI-compatible providers (OpenAI, Groq, Mistral) share one request shape
    const openAICompatible = {
      openai:  { url: 'https://api.openai.com/v1/chat/completions',      defaultModel: 'gpt-4o-mini',               label: 'OpenAI' },
      groq:    { url: 'https://api.groq.com/openai/v1/chat/completions', defaultModel: 'llama-3.3-70b-versatile',   label: 'Groq' },
      mistral: { url: 'https://api.mistral.ai/v1/chat/completions',      defaultModel: 'mistral-small-latest',      label: 'Mistral' }
    };

    if (openAICompatible[provider]) {
      const cfg = openAICompatible[provider];
      if (!apiKey) throw new Error(`Please configure your ${cfg.label} API Key in the settings (⚙️ AI Config).`);
      const model = customModel || cfg.defaultModel;

      const response = await fetch(cfg.url, {
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
        throw new Error(errData?.error?.message || `${cfg.label} API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    }

    if (provider === 'cohere') {
      if (!apiKey) throw new Error("Please configure your Cohere API Key in the settings (⚙️ AI Config).");
      const model = customModel || 'command-r-plus';

      const response = await fetch('https://api.cohere.com/v2/chat', {
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
        throw new Error(errData?.message || `Cohere API error: ${response.statusText}`);
      }

      const data = await response.json();
      // Cohere v2 returns message.content as an array of text blocks
      const parts = data?.message?.content || [];
      return parts.map(p => p.text || '').join('');
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
