"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Briefcase, Users, Clock, ArrowLeft, ChevronRight, User, Star, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, candRes] = await Promise.all([
          fetch(`/api/jobs/${id}`),
          fetch(`/api/candidates?jobId=${id}`)
        ]);
        const jobData = await jobRes.json();
        const candData = await candRes.json();
        
        setJob(jobData);
        // Sadece bu iş ilanıyla eşleşen adayları filtreleyelim (API bazen hepsini dönebilir)
        setCandidates(candData.filter((c: any) => c.jobId === id));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Yükleniyor...</div>;
  if (!job) return <div style={{ padding: '3rem', textAlign: 'center' }}>İlan bulunamadı.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn-secondary" onClick={() => router.back()} style={{ padding: '8px' }}>
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: '1.75rem' }}>İlan Detayları</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        {/* Left Column: Job Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{job.title}</h2>
                <span className="btn-secondary" style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>{job.department}</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} /> {job.createdAt ? new Date(job.createdAt).toLocaleDateString('tr-TR') : 'Tarih Belirtilmedi'}
              </div>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>İş Tanımı ve Gereksinimler</h3>
              <p style={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{job.description}</p>
            </div>
          </div>

          <div className="glass" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={20} color="var(--accent)" /> Bu İlana Başvuranlar ({candidates.length})
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="glass" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Search size={14} /> <input type="text" placeholder="Aday ara..." style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.8rem', outline: 'none' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {candidates.length > 0 ? candidates.map((cand) => (
                <Link key={cand.id} href={`/candidates/${cand.id}`} style={{ textDecoration: 'none' }}>
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="glass-hover" 
                    style={{ padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={20} color="var(--accent)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{cand.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Skor: {cand.analysis?.technicalScore || 'N/A'}/100</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      {cand.analysis?.decision === 'POSITIVE' && (
                        <div style={{ padding: '4px 8px', background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600 }}>
                          Öneriliyor
                        </div>
                      )}
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </div>
                  </motion.div>
                </Link>
              )) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Henüz başvuran aday yok.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Statistics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>İlan İstatistikleri</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Toplam Başvuru</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{candidates.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mülakat Aşamasında</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{candidates.filter(c => c.status === 'INTERVIEW').length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Yapay Zeka Memnuniyeti</div>
                <div style={{ height: '8px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden' }}>
                   <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, var(--accent), #8b5cf6)' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding: '2rem', background: 'linear-gradient(135deg, #3b82f610, #8b5cf610)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} color="#f1c40f" /> AI Tavsiyesi
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Bu pozisyon için adayların teknik yetkinlikleri oldukça yüksek. Mülakatlarda özellikle Mimari Tasarım ve Problem Çözme yeteneklerine odaklanmanızı öneririm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
