import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const analyzeCandidate = async (cvText: string, jobDescription: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
# HR ANALİZ SİSTEMİ - ADAY DEĞERLENDİRME

Aşağıdaki aday verilerini (CV/Portfolyo) verilen iş tanımıyla kıyaslayarak analiz et. 
Analizini "Düşünce Zinciri" (Chain of Thought) yöntemini kullanarak yap ve her puanı somut kanıtlara dayandır.

## İŞ TANIMI
${jobDescription}

## ADAY VERİLERİ
${cvText}

## ANALİZ FORMATI (JSON ÇIKTISI ÜRET)
Lütfen aşağıdaki JSON formatında yanıt ver:

{
  "summary": "Genel özet",
  "scores": {
    "technicalFit": { "score": 0-100, "reasoning": "Adayın [...] teknolojisindeki tecrübesi [...] projesinde kanıtlanmıştır." },
    "architecture": { "score": 0-100, "reasoning": "Design patterns ve mimari yaklaşımı [...]" },
    "experience": { "score": 0-100, "reasoning": "Yıl ve derinlik analizi [...]" },
    "softSkills": { "score": 0-100, "reasoning": "İletişim ve takım çalışması çıkarımları [...]" }
  },
  "chainOfThought": [
    "Adım 1: Adayın temel teknolojileri incelendi...",
    "Adım 2: Teknik zorlukları nasıl çözdüğü analiz edildi...",
    "Adım 3: ..."
  ],
  "decision": "En uygun/Uygun/Düşünülebilir/Uygun Değil",
  "keyStrengths": ["Kritik avantaj 1", "..."],
  "gaps": ["Eksik yetkinlik 1", "..."]
}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Clean potential markdown blocks from AI response
  const cleanJson = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleanJson);
};
