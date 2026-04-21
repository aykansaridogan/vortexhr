"use client";

import { motion } from "framer-motion";

interface FunnelProps {
  data?: {
    total: number;
    initial: number;
    analyzed: number;
    interview: number;
    offer: number;
  }
}

export default function HiringFunnel({ data }: FunnelProps) {
  const funnelSteps = [
    { label: "Toplam Başvuru", count: data?.total || 0, width: "100%" },
    { label: "Ön Eleme", count: (data?.initial || 0) + (data?.analyzed || 0), width: "80%" },
    { label: "AI Analized", count: data?.analyzed || 0, width: "60%" },
    { label: "Mülakat", count: data?.interview || 0, width: "40%" },
    { label: "Teklif", count: data?.offer || 0, width: "20%" },
  ];

  return (
    <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h3 style={{ fontSize: '1.1rem' }}>İşe Alım Hunisi</h3>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        {funnelSteps.map((step, i) => (
          <div key={i} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              style={{ 
                width: step.width, 
                height: '40px', 
                background: `linear-gradient(90deg, transparent, var(--accent)40, transparent)`, 
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
