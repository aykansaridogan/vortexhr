"use client";

import { motion } from "framer-motion";

const funnelData = [
  { label: "Toplam Başvuru", count: 1240, color: "var(--accent)", width: "100%" },
  { label: "AI Filtreleme", count: 450, color: "var(--accent)", width: "80%" },
  { label: "Teknik Mülakat", count: 120, color: "var(--accent)", width: "60%" },
  { label: "Son Görüşme", count: 45, color: "var(--accent)", width: "40%" },
  { label: "Teklif", count: 12, color: "var(--accent)", width: "20%" },
];

export default function HiringFunnel() {
  return (
    <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h3 style={{ fontSize: '1.1rem' }}>İşe Alım Hunisi</h3>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        {funnelData.map((step, i) => (
          <div key={i} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              style={{ 
                width: step.width, 
                height: '40px', 
                background: `linear-gradient(90deg, transparent, ${step.color}40, transparent)`, 
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
               <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{step.count}</div>
            </motion.div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{step.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
