"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Filter, MoreHorizontal, User, FileText, CheckCircle2, XCircle, Clock, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setIsLoading(true);
    const res = await fetch("/api/candidates");
    const data = await res.json();
    setCandidates(data);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCREENING": return "#3498db";
      case "INTERVIEW": return "#f1c40f";
      case "OFFER": return "var(--accent)";
      case "REJECTED": return "#e74c3c";
      default: return "var(--text-muted)";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--accent)";
    if (score >= 50) return "#f1c40f";
    return "#e74c3c";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Aday Havuzu</h1>
          <p style={{ color: 'var(--text-muted)' }}>Analiz edilmiş tüm adayları ve değerlendirmeleri görüntüleyin.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Filter size={18} /> Filtrele</button>
           <button className="btn-primary">Dışa Aktar</button>
        </div>
      </div>

      <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', background: 'var(--glass)', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Aday ismi veya yetkinlik ara..." 
            style={{ background: 'none', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '1.25rem 1.5rem' }}>Aday Bilgisi</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>Başvurulan Pozisyon</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>AI Puanı</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>Statü</th>
              <th style={{ padding: '1.25rem 1.5rem' }}>Tarih</th>
              <th style={{ padding: '1.25rem 1.5rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}>
                  <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => (
                <tr 
                  key={candidate.id} 
                  className="glass-hover" 
                  style={{ borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}
                  onClick={() => router.push(`/candidates/${candidate.id}`)}
                >
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                        <User size={20} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{candidate.name}</div>
                           {candidate.analysis?.technicalScore >= 85 && (
                             <span style={{ fontSize: '0.6rem', background: 'var(--accent)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
                               <Sparkles size={8} /> PARLAYAN YILDIZ
                             </span>
                           )}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{candidate.email || 'Email belirtilmedi'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{candidate.job.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{candidate.job.department}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: getScoreColor(candidate.analysis?.technicalScore || 0) }}>
                        %{candidate.analysis?.technicalScore || 0}
                      </div>
                      <div style={{ width: '60px', height: '4px', background: 'var(--glass-border)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: getScoreColor(candidate.analysis?.technicalScore || 0), width: `${candidate.analysis?.technicalScore || 0}%` }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      padding: '4px 10px', 
                      borderRadius: '100px', 
                      background: `${getStatusColor(candidate.status)}20`, 
                      color: getStatusColor(candidate.status),
                      border: `1px solid ${getStatusColor(candidate.status)}40`
                    }}>
                      {candidate.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {new Date(candidate.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
