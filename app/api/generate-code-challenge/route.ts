import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { title, stack } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
      Sen kıdemli bir yazılım mimarısın. 
      "${title}" pozisyonuna başvuran ve "${stack}" kullanan bir aday için 1 adet gerçekçi KODLAMA ÖDEVİ (Case Study) hazırla.
      
      Ödev ŞU FORMATTA olmalı:
      - BAŞLIK: Ödevin adı
      - SENARYO: Gerçek dünyadan bir problem (Örn: "Yüksek trafikli bir e-ticaret sepet sistemi")
      - BEKLENTİLER: (Örn: "State yönetimi için Redux kullanılmalı", "Hata yönetimi yapılmalı")
      - BONUS: Adayı öne çıkaracak ekstra bir özellik
      - DEĞERLENDİRME KRİTERİ: Mülakatçının nelere bakması gerektiği
      
      Yanıtı Markdown formatında ver.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return NextResponse.json({ challenge: response.text() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
