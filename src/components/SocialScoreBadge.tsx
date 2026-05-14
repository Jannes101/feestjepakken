'use client';

interface SocialScoreBadgeProps {
  score: number | null;
  aantalBeoordelingen: number;
  size?: 'sm' | 'md';
}

function getScoreKleur(score: number | null): { bg: string; text: string; label: string } {
  if (score === null) return { bg: 'rgba(28,21,16,0.08)', text: 'rgba(28,21,16,0.4)', label: 'Nieuw' };
  if (score >= 8) return { bg: 'rgba(34,197,94,0.12)', text: '#16a34a', label: score.toFixed(1) };
  if (score >= 6.5) return { bg: 'rgba(251,146,60,0.12)', text: '#ea580c', label: score.toFixed(1) };
  return { bg: 'rgba(239,68,68,0.1)', text: '#dc2626', label: score.toFixed(1) };
}

export default function SocialScoreBadge({
  score,
  aantalBeoordelingen,
  size = 'sm',
}: SocialScoreBadgeProps) {
  const { bg, text, label } = getScoreKleur(score);
  const isSm = size === 'sm';

  const badge = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        backgroundColor: bg,
        color: text,
        borderRadius: '6px',
        padding: isSm ? '2px 7px' : '4px 10px',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: isSm ? '0.75rem' : '0.875rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      ★ {label}
    </span>
  );

  if (aantalBeoordelingen === 0 || score === null) return badge;

  return (
    <span
      title={`${aantalBeoordelingen} beoordeling${aantalBeoordelingen !== 1 ? 'en' : ''}`}
      style={{ cursor: 'default' }}
    >
      {badge}
    </span>
  );
}
