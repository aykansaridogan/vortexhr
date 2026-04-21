import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { title, department } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Başlık gereklidir.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
      Sen profesyonel bir İK uzmanısın. 
      "${title}" pozisyonu için "${department || 'Genel'}" departmanında yayınlanacak, modern bir iş tanımı ve pazar analizi oluştur.
      
      Yanıtı şu JSON formatında ver:
      {
        "description": "Profesyonel iş tanımı (Markdown formatında)",
        "marketAnalysis": {
          "salaryRange": "Örn: 80.000 TL - 120.000 TL",
          "difficulty": "1-10 arası zorluk puanı",
          "hiringTime": "Ortalama işe alım süresi (Örn: 4-6 hafta)",
          "trends": ["İlgili teknoloji trendleri 1", "..."]
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Agresif JSON Temizleme
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    const data = JSON.parse(text);
    
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
