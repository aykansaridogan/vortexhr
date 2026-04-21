"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase, Users, PieChart, Settings, Search, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const menuItems = [
  { name: "Panel", icon: <LayoutDashboard size={20} />, href: "/" },
  { name: "İş İlanları", icon: <Briefcase size={20} />, href: "/jobs" },
  { name: "Adaylar", icon: <Users size={20} />, href: "/candidates" },
  { name: "Personel & Takip", icon: <LayoutDashboard size={20} />, href: "/staff" },
  { name: "Analiz Raporları", icon: <PieChart size={20} />, href: "/reports" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ 
      width: '280px', 
      height: '100vh', 
      position: 'fixed', 
      left: 0, 
      top: 0, 
      background: 'rgba(0,0,0,0.05)', 
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--glass-border)',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem',
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '8px' }} />
          <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
            VORTEX <span style={{ color: 'var(--accent)' }}>HR</span>
          </span>
        </div>
        <ThemeToggle />
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={isActive ? "glass" : "glass-hover"} style={{ 
                padding: '0.75rem 1rem', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                color: isActive ? 'var(--foreground)' : 'var(--text-muted)',
                background: isActive ? 'var(--accent-soft)' : 'transparent',
                borderColor: isActive ? 'var(--accent)' : 'transparent',
                transition: 'all 0.2s ease',
                fontWeight: isActive ? 600 : 500
              }}>
                <span style={{ color: isActive ? 'var(--accent)' : 'inherit' }}>{item.icon}</span>
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-hover" style={{ padding: '0.75rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <Settings size={20} /> Ayarlar
        </div>
        <div 
          className="glass-hover" 
          style={{ padding: '0.75rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', color: '#e74c3c', cursor: 'pointer' }} 
          onClick={() => {
            document.cookie = "isLoggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/login";
          }}
        >
          <LogOut size={20} /> Güvenli Çıkış
        </div>
        <div style={{ padding: '1rem', background: 'var(--glass)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Yapay Zeka Kotası</div>
          <div style={{ height: '4px', background: 'var(--glass-border)', borderRadius: '2px', marginBottom: '8px' }}>
            <div style={{ width: '65%', height: '100%', background: 'var(--accent)', borderRadius: '2px' }} />
          </div>
          <div style={{ fontSize: '0.7rem', fontWeight: 600 }}>6.5k / 10k token</div>
        </div>
      </div>
    </aside>
  );
}
