"use client";

import { useState, useEffect } from "react";
import { Users, Clock, LogIn, LogOut, Search, MoreHorizontal, UserCheck, UserX, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function StaffPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [empRes, attRes] = await Promise.all([
        fetch("/api/employees"),
        fetch("/api/attendance")
      ]);
      setEmployees(await empRes.json());
      setAttendances(await attRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttendance = async (employeeId: string, type: 'CHECK_IN' | 'CHECK_OUT') => {
    try {
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, type })
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Bu personeli silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEmployees(employees.filter(emp => emp.id !== id));
      } else {
        alert('Silme işlemi başarısız oldu.');
      }
    } catch (err) {
      console.error(err);
      alert('Silme sırasında bir hata oluştu.');
    }
  };

  const getAttendanceForEmployee = (empId: string) => {
    return attendances.find(a => a.employeeId === empId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>Personel & Devam Takibi</h1>
          <p style={{ color: 'var(--text-muted)' }}>Çalışanların mesai saatlerini ve durumlarını anlık takip edin.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div className="glass" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.2rem' }}>{attendances.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bugün Giriş<br/>Yapanlar</div>
           </div>
        </div>
      </div>

      <div style={{ gridTemplateColumns: '1fr', display: 'grid', gap: '1.5rem' }}>
        <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', background: 'var(--glass)', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Personel ismi veya departman ara..." 
              style={{ background: 'none', border: 'none', color: '#fff', width: '100%', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1.25rem 1.5rem' }}>Personel</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Departman / Rol</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Bugünkü Durum</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>Giriş / Çıkış</th>
                <th style={{ padding: '1.25rem 1.5rem' }}>İşlem</th>
                <th style={{ padding: '1.25rem 1.5rem' }}></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center' }}><Loader2 className="animate-spin" /></td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Henüz personel bulunmuyor. Adayı "İşe Al" diyerek personel yapabilirsiniz.</td></tr>
              ) : (
                employees.map((emp) => {
                  const att = getAttendanceForEmployee(emp.id);
                  return (
                    <tr key={emp.id} className="glass-hover" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{emp.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ fontSize: '0.85rem' }}>{emp.role}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{emp.department}</div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {att ? (
                          <span style={{ fontSize: '0.7rem', color: att.checkOut ? '#94a3b8' : 'var(--accent)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {att.checkOut ? <UserX size={14}/> : <UserCheck size={14} />}
                            {att.checkOut ? 'MESAİ BİTTİ' : 'ŞU AN ÇALIŞIYOR'}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.7rem', color: '#e74c3c', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertCircle size={14} /> HENÜZ GELMEDİ
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.8rem' }}>
                         <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>{att?.checkIn ? new Date(att.checkIn).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
                            <span style={{ color: 'var(--text-muted)' }}>{att?.checkOut ? new Date(att.checkOut).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span>
                         </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        {att ? (
                          !att.checkOut && (
                            <button onClick={() => handleAttendance(emp.id, 'CHECK_OUT')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', color: '#e74c3c' }}>
                              <LogOut size={12} /> Çıkış Yap
                            </button>
                          )
                        ) : (
                          <button onClick={() => handleAttendance(emp.id, 'CHECK_IN')} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <LogIn size={12} /> Giriş Yap
                          </button>
                        )}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <button
                          onClick={(e) => handleDelete(emp.id, e)}
                          title="Sil"
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
