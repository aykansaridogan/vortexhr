"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, Briefcase, FileText, CheckCircle2, AlertCircle, Info, MessageSquare, Loader2, Zap, UserCheck } from "lucide-react";
import { motion } from "framer-motion";
import AnalysisResult from "@/components/AnalysisResult";

export default function CandidateDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [candidate, setCandidate] = useState<any>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [codeChallenge, setCodeChallenge] = useState<string>("");
  const [englishGuide, setEnglishGuide] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<string | null>(null); // 'questions', 'code', 'english'
  const [isHiring, setIsHiring] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleHire = async () => {
    if (!candidate) return;
    setIsHiring(true);
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateId: candidate.id }),
      });
      if (res.ok) {
        alert("Aday başarıyla personeller arasına eklendi!");
        router.push("/staff");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsHiring(false);
    }
  };

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  const fetchCandidate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/candidates/${id}`);
      const data = await res.json();
      setCandidate(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAssessment = async (type: 'questions' | 'code' | 'english') => {
    if (!candidate) return;
    setIsGenerating(type);
    try {
      const endpoint = type === 'questions' ? '/api/generate-questions' :
        type === 'code' ? '/api/generate-code-challenge' :
          '/api/generate-english-interview';

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: candidate.job.title,
          title: candidate.job?.title,
          stack: candidate.resumeText,
          jobDescription: candidate.job?.description,
          gaps: candidate.analysis?.gaps || []
        }),
      });
      const data = await res.json();

      if (type === 'questions') setQuestions(data.questions || []);
      else if (type === 'code') setCodeChallenge(data.challenge || "");
      else if (type === 'english') setEnglishGuide(data.interviewGuide || "");

    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(null);
    }
  };

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><Loader2 className="animate-spin" /></div>;
  if (!candidate) return <div>Aday bulunamadı.</div>;

  const analysisData = candidate.analysis ? {
    ...candidate.analysis,
    scores: candidate.analysis.scores || {
      technicalFit: { score: 0, reasoning: "Veri yok" },
      architecture: { score: 0, reasoning: "Veri yok" },
      experience: { score: 0, reasoning: "Veri yok" },
      softSkills: { score: 0, reasoning: "Veri yok" }
    },
    chainOfThought: candidate.analysis.chainOfThought || [],
    keyStrengths: candidate.analysis.keyStrengths || [],
    gaps: candidate.analysis.gaps || []
  } : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '5rem' }}>
      <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}>
        <ArrowLeft size={18} /> Geri Dön
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left: Info Card */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <User size={40} />
            </div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{candidate.name}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{candidate.job?.title}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={16} /> {candidate.email || 'N/A'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={16} /> {candidate.phone || 'N/A'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Briefcase size={16} /> {candidate.job?.department}</div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={handleHire}
                disabled={isHiring}
              >
                {isHiring ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
                {isHiring ? 'İşlem Yapılıyor...' : 'İşe Alımı Onayla'}
              </button>
              <button className="btn-secondary" style={{ width: '100%' }} onClick={() => window.print()}>PDF Olarak İndir</button>
            </div>
          </div>

          <div className="glass" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>AI Değerlendirme Araç Kutusu</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Tool 1: Interview Questions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Teknik Mülakat Soruları</div>
                  <button onClick={() => generateAssessment('questions')} className="btn-secondary" style={{ fontSize: '0.7rem', padding: '4px 8px' }} disabled={!!isGenerating}>
                    {isGenerating === 'questions' ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />} Hazırla
                  </button>
                </div>
                {questions?.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {questions.map((q, i) => (
                      <div key={i} style={{ padding: '10px', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.8rem' }}>{q}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tool 2: Code Challenge */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Kod Ödevi (Case Study)</div>
                  <button onClick={() => generateAssessment('code')} className="btn-secondary" style={{ fontSize: '0.7rem', padding: '4px 8px' }} disabled={!!isGenerating}>
                    {isGenerating === 'code' ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />} Üret
                  </button>
                </div>
                {codeChallenge && (
                  <pre style={{ padding: '10px', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.8rem', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{codeChallenge}</pre>
                )}
              </div>

              {/* Tool 3: English Assessment */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>İngilizce Mülakat Rehberi</div>
                  <button onClick={() => generateAssessment('english')} className="btn-secondary" style={{ fontSize: '0.7rem', padding: '4px 8px' }} disabled={!!isGenerating}>
                    {isGenerating === 'english' ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />} Hazırla
                  </button>
                </div>
                {englishGuide && (
                  <pre style={{ padding: '10px', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '10px', fontSize: '0.8rem', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{englishGuide}</pre>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Right: Analysis Details */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {analysisData ? (
            <AnalysisResult data={analysisData} />
          ) : (
            <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
              <Zap size={40} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)' }} />
              <h3>Henüz Analiz Edilmedi</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Adayın CV'si henüz AI tarafından analiz edilmemiş. Ana sayfadan yeni bir analiz başlatabilirsiniz.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
