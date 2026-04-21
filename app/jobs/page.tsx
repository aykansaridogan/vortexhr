"use client";

import { useState, useEffect } from "react";
import { Plus, Briefcase, MapPin, Clock, MoreVertical, Search, Loader2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    description: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [marketData, setMarketData] = useState<any>(null);

  const generateWithAI = async () => {
    if (!newJob.title) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newJob.title, department: newJob.department }),
      });
      const data = await res.json();
      setNewJob(prev => ({ ...prev, description: data.description }));
      setMarketData(data.marketAnalysis);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const [activeTest, setActiveTest] = useState<any>(null);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);

  const generateTest = async (job: any) => {
    setIsGeneratingTest(true);
    try {
      const res = await fetch("/api/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: job.title, description: job.description }),
      });
      const data = await res.json();
      setActiveTest(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingTest(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data);
    setIsLoading(false);
  };

  const createJob = async () => {
    if (!newJob.title || !newJob.description) return;

    await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });

    setNewJob({ title: "", department: "", description: "" });
    setIsModalOpen(false);
    fetchJobs();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>İş İlanları</h1>
          <p style={{ color: 'var(--text-muted)' }}>Aktif pozisyonları yönetin ve yeni ilanlar oluşturun.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Yeni İlan Oluştur
        </button>
      </div>

      <div className="glass" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Search size={20} color="var(--text-muted)" />
        <input
          type="text"
          placeholder="İlan ara..."
          style={{ background: 'none', border: 'none', color: '#fff', width: '100%', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {isLoading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
          </div>
        ) : (
          jobs.map((job) => (
            <motion.div
              key={job.id}
              className="glass"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{job.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, background: 'var(--accent-soft)', padding: '2px 8px', borderRadius: '4px' }}>
                    {job.department}
                  </span>
                </div>
                <Link href={`/jobs/${job.id}`}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <MoreVertical size={18} />
                  </button>
                </Link>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                {job.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Briefcase size={14} /> {job._count.candidates} Aday
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} /> {job.createdAt ? new Date(job.createdAt).toLocaleDateString('tr-TR') : 'Tarih Belirtilmedi'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-secondary"
                    style={{ fontSize: '0.7rem', padding: '6px 12px' }}
                    onClick={() => generateTest(job)}
                    disabled={isGeneratingTest}
                  >
                    {isGeneratingTest ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />} Test Üret
                  </button>
                  <Link href={`/jobs/${job.id}`}>
                    <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>Detaylar</button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* New Job Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass"
              style={{ padding: '2.5rem', width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <h2 style={{ fontSize: '1.5rem' }}>Yeni İş İlanı Ekle</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pozisyon Başlığı</label>
                    <button
                      onClick={generateWithAI}
                      disabled={isGenerating || !newJob.title}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 600
                      }}
                    >
                      {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                      AI ile Yazdır
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Örn: Senior Frontend Developer"
                    style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem', color: '#fff' }}
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Departman</label>
                  <input
                    type="text"
                    placeholder="Örn: Engineering"
                    style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem', color: '#fff' }}
                    value={newJob.department}
                    onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>İş Tanımı ve Gereksinimler</label>
                  <textarea
                    placeholder="Teknolojiler, deneyim yılı ve sorumluluklar..."
                    style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem', color: '#fff', minHeight: '150px', resize: 'vertical' }}
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  />
                </div>

                {marketData && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="glass"
                    style={{ padding: '1rem', background: 'var(--accent-soft)', borderColor: 'var(--accent)' }}
                  >
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--accent)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Zap size={14} /> Pazar Analizi (AI)
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.75rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>Maaş Aralığı</div>
                        <div style={{ fontWeight: 600 }}>{marketData.salaryRange}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-muted)' }}>Bulunabilirlik Zorluğu</div>
                        <div style={{ fontWeight: 600 }}>{marketData.difficulty}/10</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>İptal</button>
                <button className="btn-primary" onClick={createJob}>İlanı Yayınla</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Technical Test Modal */}
      <AnimatePresence>
        {activeTest && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass"
              style={{ padding: '2.5rem', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem' }}>{activeTest.testName}</h2>
                <button className="btn-secondary" onClick={() => setActiveTest(null)}>Kapat</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {activeTest.questions?.map((q: any, i: number) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{i + 1}. {q.question}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {q.options?.map((opt: string, j: number) => (
                        <div key={j} className="glass" style={{ padding: '0.75rem', fontSize: '0.85rem', border: opt === q.correctAnswer ? '1px solid var(--accent)' : '1px solid var(--glass-border)', background: opt === q.correctAnswer ? 'var(--accent-soft)' : 'transparent' }}>
                          <span style={{ fontWeight: 700, marginRight: '8px' }}>{String.fromCharCode(65 + j)}.</span> {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
