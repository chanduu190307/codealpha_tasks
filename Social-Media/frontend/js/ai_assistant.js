import { api } from './api.js';
import { toast, escapeHTML } from './utils.js';

export class AIAssistantController {
  constructor() {
    this.modal = document.getElementById('ai-assistant-modal');
    this.resultsContainer = document.getElementById('ai-suggestions-results');
  }

  init() {
    const triggerBtn = document.getElementById('ai-enhance-btn');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => this.openAssistant());
    }

    const closeBtn = document.getElementById('close-ai-assistant-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeAssistant());
    }

    const generateBtn = document.getElementById('ai-generate-suggestions-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generateSuggestions());
    }
  }

  openAssistant() {
    if (!this.modal) return;
    const currentText = document.getElementById('create-post-text')?.value || '';
    const input = document.getElementById('ai-input-text');
    if (input) input.value = currentText;
    this.modal.classList.add('active');
  }

  closeAssistant() {
    if (this.modal) this.modal.classList.remove('active');
  }

  async generateSuggestions() {
    const text = document.getElementById('ai-input-text')?.value.trim();
    const tone = document.getElementById('ai-tone-select')?.value || 'engaging';
    if (!text) {
      toast('Please enter some draft text first.', 'error');
      return;
    }

    if (!this.resultsContainer) return;
    this.resultsContainer.innerHTML = '<div class="spinner"></div> Generating AI recommendations...';

    try {
      const res = await api.post('/api/ai/writing-assist/', { text, tone });
      this.renderSuggestions(res);
    } catch (err) {
      this.resultsContainer.innerHTML = '<p class="empty-hint">AI writing assistant temporarily unavailable.</p>';
    }
  }

  renderSuggestions(data) {
    if (!this.resultsContainer) return;
    this.resultsContainer.innerHTML = '';

    if (data.suggestions && data.suggestions.length > 0) {
      data.suggestions.forEach((sug) => {
        const card = document.createElement('div');
        card.className = 'creator-draft-item';
        card.style.flexDirection = 'column';
        card.style.alignItems = 'flex-start';
        card.style.gap = '8px';

        card.innerHTML = `
          <span style="font-size: 11px; font-weight: 700; color: var(--primary-accent);">${sug.title}</span>
          <p style="font-size: 13px; margin: 0; color: #fff;">${escapeHTML(sug.content)}</p>
          <button class="btn btn-sm btn-primary apply-sug-btn">Apply to Post</button>
        `;

        card.querySelector('.apply-sug-btn').onclick = () => {
          const textarea = document.getElementById('create-post-text');
          if (textarea) textarea.value = sug.content;
          toast('Applied AI suggestion to composer!', 'success');
          this.closeAssistant();
        };

        this.resultsContainer.appendChild(card);
      });
    }

    if (data.suggested_hashtags && data.suggested_hashtags.length > 0) {
      const tagWrap = document.createElement('div');
      tagWrap.style.marginTop = '12px';
      tagWrap.innerHTML = `
        <span style="font-size: 11px; color: var(--text-muted);">Suggested Tags: </span>
        ${data.suggested_hashtags.map(t => `<span class="trending-chip" style="cursor: pointer;">${t}</span>`).join(' ')}
      `;
      this.resultsContainer.appendChild(tagWrap);
    }
  }
}

export const aiAssistantController = new AIAssistantController();
