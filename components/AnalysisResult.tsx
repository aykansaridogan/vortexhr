"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, ArrowUpRight } from "lucide-react";

interface ScoreDetail {
  score: number;
  reasoning: string;
}

interface AnalysisProps {
  data: {
    summary: string;
    scores: {
      technicalFit: ScoreDetail;
      architecture: ScoreDetail;
      experience: ScoreDetail;
      softSkills: ScoreDetail;
    };
    chainOfThought: string[];
    decision: string;
    keyStrengths: string[];
    gaps: string[];
  };
}

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function AnalysisResult({ data }: AnalysisProps) {
  const radarData = {
    labels: ['Teknik', 'Mimari', 'Deneyim', 'Soft Skills'],
    datasets: [
      {
        label: 'Aday Yetkinliği',
        data: [
          data.scores.technicalFit.score,
          data.scores.architecture.score,
          data.scores.experience.score,
          data.scores.softSkills.score,
        ],
        backgroundColor: 'rgba(46, 204, 113, 0.2)',
        borderColor: 'rgba(46, 204, 113, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(46, 204, 113, 1)',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } },
        ticks: { display: false, stepSize: 20 },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "var(--accent)";
    if (score >= 50) return "#f1c40f";
    return "#e74c3c";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass"
      style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
    >
      {/* Header & Decision */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', gap: '2rem', flex: 1 }}>
          <div style={{ width: '200px', height: '200px' }}>
            <Radar data={radarData} options={radarOptions} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Analiz Sonucu</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: '600px' }}>{data.summary}</p>
          </div>
        </div>
        <div className="glass" style={{ padding: '1rem 1.5rem', background: 'var(--accent-soft)', borderColor: 'var(--accent)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, marginBottom: '4px' }}>Karar</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{data.decision}</div>
        </div>
      </div>

      {/* Scores Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {Object.entries(data.scores).map(([key, value]) => (
          <div key={key} className="glass" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', textTransform: 'capitalize' }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span style={{ color: getScoreColor(value.score), fontWeight: 700, fontSize: '1.1rem' }}>%{value.score}</span>
            </div>
            <div style={{ height: '6px', background: 'var(--glass-border)', borderRadius: '3px', overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${value.score}%` }}
                style={{ height: '100%', background: getScoreColor(value.score) }}
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{value.reasoning}</p>
          </div>
        ))}
      </div>

      {/* Key Details (Strengths & Gaps) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
            <CheckCircle2 size={18} color="var(--accent)" /> Güçlü Yanlar
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.keyStrengths.map((str, i) => (
              <li key={i} style={{ fontSize: '0.9rem', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '4px', height: '4px', background: 'var(--accent)', borderRadius: '50%' }} />
                {str}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
            <AlertCircle size={18} color="#e74c3c" /> Gelişim Alanları
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.gaps.map((gap, i) => (
              <li key={i} style={{ fontSize: '0.9rem', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '4px', height: '4px', background: '#e74c3c', borderRadius: '50%' }} />
                {gap}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Chain of Thought (Transparency) */}
      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          <Info size={18} color="var(--text-muted)" /> Düşünce Zinciri (AI Süreci)
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.chainOfThought.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '4px 8px', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                {i + 1}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingTop: '4px' }}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
