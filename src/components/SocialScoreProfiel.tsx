'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Beoordeling {
  aanbevolen: boolean;
  reden: string | null;
  created_at: string;
}

interface SocialScoreProfielProps {
  userId: string;
  score: number | null;
  aantalBeoordelingen: number;
}

function ScoreRing({ score }: { score: number | null }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const pct = score !== null ? score / 10 : 0;
  const offset = circumference * (1 - pct);

  const kleur =
    score === null ? 'rgba(28,21,16,0.15)'
    : score >= 8 ? '#16a34a'
    : score >= 6.5 ? '#ea580c'
    : '#dc2626';

  return (
    <div style={{ position: 'relative', width: 88, height: 88 }}>
      <svg width={88} height={88} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={44} cy={44} r={radius} fill="none" stroke="rgba(28,21,16,0.06)" strokeWidth={6} />
        {score !== null && (
          <circle
            cx={44}
            cy={44}
            r={radius}
            fill="none"
            stroke={kleur}
            strokeWidth={6}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        )}
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '1.5rem',
            letterSpacing: '1px',
            color: score !== null ? kleur : 'rgba(28,21,16,0.25)',
            lineHeight: 1,
          }}
        >
          {score !== null ? score.toFixed(1) : '—'}
        </span>
        <span
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.6rem',
            fontWeight: 500,
            color: 'rgba(28,21,16,0.35)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          /10
        </span>
      </div>
    </div>
  );
}

export default function SocialScoreProfiel({
  userId,
  score,
  aantalBeoordelingen,
}: SocialScoreProfielProps) {
  const [recente, setRecente] = useState<Beoordeling[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function laadBeoordelingen() {
      const { data } = await supabase
        .from('beoordelingen')
        .select('aanbevolen, reden, created_at')
        .eq('beoordeelde_id', userId)
        .eq('aanbevolen', true)
        .not('reden', 'is', null)
        .order('created_at', { ascending: false })
        .limit(3);

      if (data) setRecente(data);
    }
    laadBeoordelingen();
  }, [userId]);

  const positief = aantalBeoordelingen > 0
    ? Math.round((score ?? 0) * aantalBeoordelingen / 10)
    : 0;

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid rgba(28,21,16,0.08)',
        padding: '1.5rem',
      }}
    >
      {/* Header */}
      <h3
        style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '1.1rem',
          letterSpacing: '2px',
          color: '#1C1510',
          marginBottom: '1.25rem',
        }}
      >
        Social Score
      </h3>

      {/* Score sectie */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <ScoreRing score={score} />
        <div>
          {aantalBeoordelingen === 0 ? (
            <>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#1C1510',
                  marginBottom: '0.25rem',
                }}
              >
                Nog geen beoordelingen
              </p>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 300,
                  color: 'rgba(28,21,16,0.5)',
                  lineHeight: 1.5,
                }}
              >
                Na elk uitje kunnen deelnemers<br />een anonieme beoordeling geven.
              </p>
            </>
          ) : (
            <>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: '#1C1510',
                  marginBottom: '0.2rem',
                }}
              >
                {aantalBeoordelingen} beoordeling{aantalBeoordelingen !== 1 ? 'en' : ''}
              </p>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 300,
                  color: 'rgba(28,21,16,0.5)',
                }}
              >
                {positief} positief · {aantalBeoordelingen - positief} kritisch
              </p>
              {/* Legenda */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                {[
                  { kleur: '#16a34a', label: '8–10 Uitstekend' },
                  { kleur: '#ea580c', label: '6.5–7.9 Goed' },
                  { kleur: '#dc2626', label: '<6.5 Matig' },
                ].map(({ kleur, label }) => (
                  <span
                    key={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '0.7rem',
                      color: 'rgba(28,21,16,0.5)',
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: kleur,
                        flexShrink: 0,
                      }}
                    />
                    {label}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recente aanbevelingen */}
      {recente.length > 0 && (
        <>
          <div
            style={{
              height: '1px',
              backgroundColor: 'rgba(28,21,16,0.06)',
              marginBottom: '1rem',
            }}
          />
          <p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(28,21,16,0.35)',
              marginBottom: '0.75rem',
            }}
          >
            Recente aanbevelingen
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {recente.map((b, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: 'rgba(34,197,94,0.05)',
                  border: '1px solid rgba(34,197,94,0.15)',
                  borderRadius: '8px',
                  padding: '0.625rem 0.875rem',
                }}
              >
                <p
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.825rem',
                    fontWeight: 300,
                    color: 'rgba(28,21,16,0.7)',
                    lineHeight: 1.5,
                    fontStyle: 'italic',
                  }}
                >
                  "{b.reden}"
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
