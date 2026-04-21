import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { candidateInfo, jobDescription, gaps } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
      Sen profesyonel bir teknik mülakatçısın. 
      Aşağıdaki aday analizi ve iş tanımına dayanarak, mülakatta sorulacak 5 KRİTİK soru hazırla.
      Özellikle adayın tespit edilen eksikliklerini (gaps) ve teknik geçmişindeki belirsiz noktaları hedefle.
      
      ADAY ANALİZİ ÖZETİ: ${JSON.stringify(gaps)}
      İŞ TANIMI: ${jobDescription}
      
      Yalnızca 5 adet soru cümlesi içeren bir JSON listesi döndür. Metin ekleme.
      Örn: ["Soru 1", "Soru 2", "Soru 3", "Soru 4", "Soru 5"]
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    
    // Agresif JSON Temizleme
    const firstBrace = text.indexOf('[');
    const lastBrace = text.lastIndexOf(']');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }
    
    const questions = JSON.parse(text);

    return NextResponse.json({ questions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
