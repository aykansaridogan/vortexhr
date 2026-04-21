"use client";

import { useState, useEffect } from "react";
import { Upload, Users, Briefcase, ChevronRight, FileText, Zap, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnalysisResult from "@/components/AnalysisResult";
import HiringFunnel from "@/components/HiringFunnel";

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/jobs")
      .then(res => res.json())
      .then(data => setJobs(data));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startAnalysis = async () => {
    if (!file || !selectedJobId || !candidateName) {
      setError("Lütfen isim, iş seçimi ve CV dosyasını tamamlayın.");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobId", selectedJobId);
      formData.append("name", candidateName);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sunucu hatası.");
      
      setAnalysisResult(data.analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span style={{ 
            color: 'var(--accent)', 
            fontSize: '0.9rem', 
            fontWeight: 600, 
            letterSpacing: '0.1em', 
            textTransform: 'uppercase',
            background: 'var(--accent-soft)',
            padding: '4px 12px',
            borderRadius: '100px'
          }}>
            Yapay Zeka Destekli Analiz
          </span>
          <h1 style={{ fontSize: '3.5rem', marginTop: '1.5rem', lineHeight: 1.1 }}>
            Geleceğin Yeteneklerini <br/> 
            <span style={{ color: 'var(--text-muted)' }}>Veriyle Keşfedin.</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '1.5rem', lineHeight: 1.6 }}>
            Aday verilerini saniyeler içinde analiz edin ve en doğru eşleşmeleri "Düşünce Zinciri" şeffaflığıyla bulun.
          </p>
        </motion.div>
      </section>

      {!analysisResult ? (
        <>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Aktif İlanlar', value: '12', icon: <Briefcase size={20} /> },
              { label: 'Toplam Başvuru', value: '1,284', icon: <Users size={20} /> },
              { label: 'Analiz Edilen CV', value: '942', icon: <FileText size={20} /> },
              { label: 'AI Karar Destek', value: '89%', icon: <Zap size={20} /> },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className="glass"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
              >
                <div style={{ padding: '12px', background: 'var(--glass-hover)', borderRadius: '12px', color: 'var(--accent)' }}>
                  {stat.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{stat.label}</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Zone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
            {/* Input Form */}
            <section className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h3 style={{ marginBottom: '1rem' }}>Yeni Analiz Başlat</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Name Input */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Aday İsmi</label>
                    <input 
                      type="text" 
                      placeholder="Ad Soyad"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      style={{ 
                        background: 'var(--glass)', 
                        border: '1px solid var(--glass-border)', 
                        borderRadius: '12px', 
                        padding: '1rem', 
                        color: '#fff',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Job Selection */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Hedef Pozisyon</label>
                    <select 
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      style={{ 
                        background: 'var(--background)', 
                        border: '1px solid var(--glass-border)', 
                        borderRadius: '12px', 
                        padding: '1rem', 
                        color: '#fff',
                        outline: 'none',
                        appearance: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">İş İlanı Seçin...</option>
                      {jobs.map(job => (
                        <option key={job.id} value={job.id}>{job.title} ({job.department})</option>
                      ))}
                    </select>
                  </div>

                  {/* File Upload */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Aday CV (PDF)</label>
                    <div style={{ 
                      border: '1px dashed var(--glass-border)', 
                      borderRadius: '12px', 
                      padding: '2rem', 
                      textAlign: 'center',
                      background: file ? 'var(--accent-soft)' : 'transparent',
                    }}>
                      <input 
                        type="file" 
                        accept=".pdf" 
                        id="cv-upload" 
                        hidden 
                        onChange={handleFileChange}
                      />
                      <label htmlFor="cv-upload" style={{ cursor: 'pointer' }}>
                        <Upload size={32} style={{ margin: '0 auto 1rem', color: 'var(--accent)' }} />
                        <div style={{ fontSize: '0.9rem', color: file ? 'var(--foreground)' : 'var(--text-muted)' }}>
                          {file ? file.name : "PDF dosyasını seçin veya buraya bırakın"}
                        </div>
                      </label>
                    </div>
                  </div>

                  {error && <div style={{ color: '#e74c3c', fontSize: '0.85rem' }}>{error}</div>}

                  <button 
                    className="btn-primary" 
                    onClick={startAnalysis}
                    disabled={isAnalyzing}
                    style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Analiz Ediliyor...
                      </>
                    ) : (
                      "Analizi Başlat"
                    )}
                  </button>
                </div>
              </div>
            </section>

            {/* Sidebar info */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <HiringFunnel />
              
              <div className="glass" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Sistem Notu</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Analiz işlemi ortalama 5-10 saniye sürmektedir. Sonuçlar aday havuzuna otomatik olarak kaydedilir.
                </p>
              </div>
            </section>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <button 
            onClick={() => setAnalysisResult(null)} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--accent)', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              fontWeight: 600
            }}
          >
            ← Yeni Analiz
          </button>
          <AnalysisResult data={analysisResult} />
        </div>
      )}
    </div>
  );
}
