
// upload.js
import { API_BASE } from './config.js';

export async function uploadImage(name, base64Image, resultDiv, resetForm) {
  try {
    const response = await fetch(`${API_BASE}/api/images/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, image: base64Image })
    });

    const data = await response.json();
    if (resultDiv) {
      resultDiv.innerHTML = data.success
        ? `<p>✅ Imagem enviada com sucesso!</p>`
        : `<p>❌ Erro: ${data.message}</p>`;
    }
    if (data.success && resetForm) resetForm();
    return data;
  } catch (error) {
    console.error(error);
    if (resultDiv) {
      resultDiv.innerHTML = `<p>❌ Erro ao enviar.</p>`;
    }
    return { success: false, message: 'Erro ao enviar.' };
  }
}
