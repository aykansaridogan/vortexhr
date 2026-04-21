"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ChevronRight, Loader2, Zap } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Admin Doğrulaması
    setTimeout(() => {
      if (email === "admin@vortex.hr" && password === "vortex123") {
        document.cookie = "isLoggedIn=true; path=/";
        router.push("/");
      } else {
        alert("Hatalı giriş! Lütfen bilgileri kontrol edin.\n(admin@vortex.hr / vortex123)");
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at top right, #3b82f620, transparent), radial-gradient(circle at bottom left, #8b5cf620, transparent)',
      overflow: 'hidden'
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{ 
          width: '100%', 
          maxWidth: '420px', 
          padding: '3rem', 
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '48px', height: '48px', background: 'var(--accent)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
             <Zap color="white" size={24} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '1rem' }}>VORTEX <span style={{ color: 'var(--accent)' }}>HR</span></h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Giriş yaparak yönetim paneline erişin.</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              placeholder="E-posta adresi" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="glass"
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none', background: 'rgba(255,255,255,0.03)' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Şifre" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="glass"
              style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 3rem', borderRadius: '12px', border: '1px solid var(--glass-border)', outline: 'none', background: 'rgba(255,255,255,0.03)' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', justifyContent: 'center' }}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Giriş Yap <ChevronRight size={18} /></>}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Şifremi Unuttum? <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>Yardım Merkezi</span>
        </div>
      </motion.div>
    </div>
  );
}
