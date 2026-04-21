import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: Request) {
  try {
    // 1. FormData Olarak Oku (Dosya ve metin verileri)
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const jobId = formData.get("jobId") as string;
    const file = formData.get("file") as File;

    if (!name || !jobId) {
      return NextResponse.json({ error: 'İsim ve pozisyon gereklidir.' }, { status: 400 });
    }

    // 2. Adayı Kaydet (Eğer yoksa oluştur)
    const candidate = await db.candidate.create({
      data: {
        name,
        jobId,
        resumeUrl: file ? file.name : "cv_analiz_edildi.pdf",
        status: 'INITIAL_SCREENING',
        email: `${name.toLowerCase().replace(/ /g, '.')}@vortex.hr`,
      }
    });

    // 3. İş İlanını Al
    const job = await db.job.findUnique({ where: { id: jobId } });
    if (!job) return NextResponse.json({ error: 'İş ilanı bulunamadı.' }, { status: 404 });

    // 4. AI Analizi Başlat (UI formatına tam uyumlu)
    console.log(`[AI] Detaylı analiz başlatılıyor: ${name} -> ${job.title}`);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    const prompt = `
      Sen profesyonel bir teknik işe alım uzmanısın. 
      Aday "${name}" için "${job.title}" pozisyonu baz alınarak derinlemesine bir analiz yap.
      
      Yalnızca şu JSON formatında yanıt ver, metin ekleme, markdown kullanma:
      {
        "summary": "Analiz özeti (max 3 cümle)...",
        "scores": {
          "technicalFit": { "score": 85, "reasoning": "Teknik beceri gerekçesi..." },
          "architecture": { "score": 75, "reasoning": "Mimari bilgi gerekçesi..." },
          "experience": { "score": 90, "reasoning": "Deneyim gerekçesi..." },
          "softSkills": { "score": 80, "reasoning": "İletişim gerekçesi..." }
        },
        "chainOfThought": [
          "CV tarandı ve anahtar kelimeler belirlendi.",
          "Pozisyon gereksinimleriyle eşleştirme yapıldı.",
          "Teknik derinlik ve proje deneyimi puanlandı."
        ],
        "decision": "POSITIVE",
        "keyStrengths": ["Güçlü yan 1", "Güçlü yan 2", "Güçlü yan 3"],
        "gaps": ["Gelişim alanı 1", "Gelişim alanı 2"]
      }
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // JSON Temizleme
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    try {
      const analysisData = JSON.parse(text);

      // 5. Analizi Kaydet
      await db.analysis.create({
        data: {
          ...analysisData,
          candidateId: candidate.id,
          // DB şemamızdaki basit alanları da besleyelim (opsiyonel)
          technicalScore: analysisData.scores.technicalFit.score,
          softSkillsScore: analysisData.scores.softSkills.score
        }
      });

      // 6. Aday Durumunu Güncelle
      await db.candidate.update({
        where: { id: candidate.id },
        data: { status: 'ANALYZED' }
      });

      return NextResponse.json({ success: true, analysis: analysisData });
    } catch (parseError) {
      console.error("[AI] Parse Hatası:", text);
      return NextResponse.json({ error: "Analiz formatı bozuk geldi." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("[AI] Kritik Hata:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
