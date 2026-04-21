import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { title, description } = await request.json();
    console.log(`[AI] Test üretiliyor: ${title}`);

    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    const prompt = `
      Sen profesyonel bir teknik eğitimcisin. 
      "${title}" pozisyonu için "${description}" gereksinimlerine dayalı, adayı test edecek 10 soruluk bir Teknik Değerlendirme Testi hazırla.
      
      Yalnızca şu JSON formatında yanıt ver, metin ekleme, markdown bloğu kullanma:
      {
        "testName": "${title} Teknik Değerlendirme",
        "questions": [
          {
            "question": "Soru metni?",
            "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği"],
            "correctAnswer": "Doğru seçenek"
          }
        ]
      }
    `;

    // Zaman aşımı koruması (isteğe bağlı, ama AI bazen takılabilir)
    const result = await model.generateContent(prompt);
    console.log("[AI] Yanıt alındı, işleniyor...");
    
    const response = result.response;
    let text = response.text().trim();

    // Agresif JSON Temizleme
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }
    
    try {
      const test = JSON.parse(text);
      console.log("[AI] Başarıyla tamamlandı.");
      return NextResponse.json(test);
    } catch (parseError) {
      console.error("[AI] Parse Hatası:", text);
      return NextResponse.json({ error: "Yanıt formatı bozuk." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("[AI] Kritik Hata:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
