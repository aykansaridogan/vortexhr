require('dotenv').config();

async function listAllModels() {
  const key = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("=== DESTEKLENEN MODELLER ===");
    if (data.models) {
      data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log("Model listesi alınamadı:", data);
    }
  } catch (e) {
    console.error("Hata:", e.message);
  }
}

listAllModels();
