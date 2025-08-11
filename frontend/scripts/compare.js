
// compare.js
import { API_BASE } from './config.js';

export async function compareImage(base64Image, resultDiv) {
  try {
    const response = await fetch(`${API_BASE}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });

    const data = await response.json();

    if (data.success && Array.isArray(data.matches)) {
      const resultsHtml = data.matches
        .map(
          (match) => `
        <div class="match">
          <p><strong>Imagem:</strong> ${match.label}</p>
          <img src="${match.image_url}" alt="${match.label}" style="max-width: 300px; border-radius: 12px;">
          <p><strong>Similaridade:</strong> ${(match.similarity * 100).toFixed(2)}%</p>
        </div>`
        )
        .join('');
      resultDiv.innerHTML = resultsHtml;
    } else {
      resultDiv.innerHTML = `<p>❌ Erro: ${data.message}</p>`;
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = `<p>❌ Erro ao comparar.</p>`;
  }
}
