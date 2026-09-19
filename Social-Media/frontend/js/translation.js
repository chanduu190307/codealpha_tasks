import { api } from './api.js';
import { toast, escapeHTML } from './utils.js';

export class TranslationController {
  static async translateElement(element, text, targetLang = 'kn') {
    try {
      const res = await api.post('/api/translation/translate/', {
        text: text,
        target_language: targetLang
      });

      if (res && res.translated_text) {
        let transBox = element.parentElement.querySelector('.translated-box');
        if (!transBox) {
          transBox = document.createElement('div');
          transBox.className = 'translated-box';
          element.parentElement.appendChild(transBox);
        }
        transBox.innerHTML = `<strong>${res.target_language_name}:</strong> ${escapeHTML(res.translated_text)}`;
      }
    } catch (err) {
      toast('Translation failed.', 'error');
    }
  }
}

window.translatePost = function(btn, text) {
  TranslationController.translateElement(btn, text, 'kn');
};
