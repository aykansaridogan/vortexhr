import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { title } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

    const prompt = `
      Sen profesyonel bir İngilizce dil eğitmeni ve teknik mülakatçısın. 
      "${title}" pozisyonuna başvuran aday için bir İngilizce Mülakat Rehberi hazırla.
      
      Şunları içermeli (Sadece İngilizce):
      - Warm-up Questions (3 adet)
      - Technical-English Questions (Adayın pozisyonunu teknik olarak İngilizce anlatması için 3 soru)
      - Evaluation Criteria (Hangi kelime dağarcığını veya gramer yapısını kullanmalı?)
      
      Format: Markdown.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return NextResponse.json({ interviewGuide: response.text() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
