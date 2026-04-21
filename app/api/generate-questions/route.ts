import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { candidateInfo, jobDescription, gaps } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Sen profesyonel bir teknik mülakatçısın. 
      Aşağıdaki aday analizi ve iş tanımına dayanarak, mülakatta sorulacak 5 KRİTİK soru hazırla.
      Özellikle adayın tespit edilen eksikliklerini (gaps) ve teknik geçmişindeki belirsiz noktaları hedefle.
      
      ADAY ANALİZİ ÖZETİ: ${JSON.stringify(gaps)}
      İŞ TANIMI: ${jobDescription}
      
      Sorular; teknik derinlik, problem çözme ve ekip uyumu üzerine odaklanmalıdır.
      Sadece 5 adet soru cümlesi içeren bir liste döndür. Format:
      ["Soru 1", "Soru 2", "Soru 3", "Soru 4", "Soru 5"]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON string from AI response
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(cleanJson);

    return NextResponse.json({ questions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
