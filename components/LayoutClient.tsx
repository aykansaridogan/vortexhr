"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <main style={{ minHeight: "100vh", width: "100%" }}>{children}</main>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        marginLeft: "280px", 
        padding: "2rem 3rem", 
        background: "var(--background)", 
        color: "var(--foreground)" 
      }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Hoş Geldiniz, İK Yöneticisi</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Sistemdeki tüm süreçler güncel.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <div className="glass" style={{ padding: "8px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "8px", height: "8px", background: "var(--accent)", borderRadius: "50%" }} />
              <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Sistem Aktif</span>
            </div>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--glass)", border: "1px solid var(--glass-border)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
              A
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
