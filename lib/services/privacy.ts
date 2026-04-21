import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const anonymizeCV = async (text: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Aşağıdaki CV metnindeki kişisel verileri (İsim, Soyisim, Telefon, Açık Adres, E-posta) bul ve bunları maskele.
    Örn: "Ahmet Yılmaz" -> "A*** Y***", "ahmet@mail.com" -> "a***@***.com" gibi.
    
    Sadece maskelenmiş metni döndür, başka hiçbir açıklama yapma.
    
    METİN:
    ${text}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};
