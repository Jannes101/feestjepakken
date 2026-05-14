'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface BeoordelingsFormulierProps {
  uitjeId: string;
  beoordeeldeUserId: string;
  beoordeeldeNaam: string;
  onClose: () => void;
  onSuccess?: () => void;
}

type Stap = 'vraag' | 'reden' | 'bevestiging';

const MIN_REDEN_LENGTE = 25;

export default function BeoordelingsFormulier({
  uitjeId,
  beoordeeldeUserId,
  beoordeeldeNaam,
  onClose,
  onSuccess,
}: BeoordelingsFormulierProps) {
  const [stap, setStap] = useState<Stap>('vraag');
  const [aanbevolen, setAanbevolen] = useState<boolean | null>(null);
  const [reden, setReden] = useState('');
  const [loading, setLoading] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  const supabase = createClient();

  const handleJa = () => {
    setAanbevolen(true);
    handleVerstuur(true, '');
  };

  const handleNee = () => {
    setAanbevolen(false);
    setStap('reden');
  };

  const handleVerstuur = async (aanbevolenWaarde: boolean, redenWaarde: string) => {
    setLoading(true);
    setFout(null);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setFout('Je moet ingelogd zijn om een beoordeling te geven.');
        setLoading(false);
        return;
      }

      const { error } = await supabase.from('beoordelingen').insert({
        beoordelaar_id: user.id,
        beoordeelde_id: beoordeeldeUserId,
        uitje_id: uitjeId,
        aanbevolen: aanbevolenWaarde,
        reden: redenWaarde || null,
      });

      if (error) {
        if (error.code === '23505') {
          setFout('Je hebt deze persoon voor dit uitje al beoordeeld.');
        } else {
          setFout('Er ging iets mis. Probeer het opnieuw.');
        }
        setLoading(false);
        return;
      }

      setStap('bevestiging');
      onSuccess?.();
    } catch {
      setFout('Er ging iets mis. Probeer het opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  const redenGeldig = reden.trim().length >= MIN_REDEN_LENGTE;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(28, 21, 16, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '1rem',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#FAF7F4',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(28,21,16,0.15)',
        }}
      >
        {/* Stap 1: Hoofdvraag */}
        {stap === 'vraag' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(28,21,16,0.4)',
                  marginBottom: '0.5rem',
                }}
              >
                Beoordeling
              </p>
              <h2
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1.75rem',
                  letterSpacing: '2px',
                  color: '#1C1510',
                  lineHeight: 1.1,
                }}
              >
                Raad je{' '}
                <span style={{ color: '#FF6B2B' }}>{beoordeeldeNaam}</span> aan
                om mee op stap te gaan?
              </h2>
            </div>

            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 300,
                color: 'rgba(28,21,16,0.6)',
                marginBottom: '1.75rem',
                lineHeight: 1.6,
              }}
            >
              Jouw beoordeling is anoniem en helpt anderen een goede keuze te maken.
            </p>

            {fout && (
              <div
                style={{
                  backgroundColor: 'rgba(255,107,43,0.08)',
                  border: '1px solid rgba(255,107,43,0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.25rem',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.875rem',
                  color: '#FF6B2B',
                }}
              >
                {fout}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleJa}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  backgroundColor: '#1C1510',
                  color: '#FAF7F4',
                  border: 'none',
                  borderRadius: '10px',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1.1rem',
                  letterSpacing: '2px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'opacity 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>✅</span> Ja, ik raad aan
              </button>
              <button
                onClick={handleNee}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  backgroundColor: 'transparent',
                  color: '#1C1510',
                  border: '1.5px solid rgba(28,21,16,0.2)',
                  borderRadius: '10px',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1.1rem',
                  letterSpacing: '2px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  transition: 'border-color 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>❌</span> Nee
              </button>
            </div>

            <button
              onClick={onClose}
              style={{
                marginTop: '1rem',
                width: '100%',
                padding: '0.625rem',
                backgroundColor: 'transparent',
                border: 'none',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.8rem',
                color: 'rgba(28,21,16,0.4)',
                cursor: 'pointer',
              }}
            >
              Sla over
            </button>
          </>
        )}

        {/* Stap 2: Reden bij Nee */}
        {stap === 'reden' && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(28,21,16,0.4)',
                  marginBottom: '0.5rem',
                }}
              >
                Verplichte toelichting
              </p>
              <h2
                style={{
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1.75rem',
                  letterSpacing: '2px',
                  color: '#1C1510',
                  lineHeight: 1.1,
                }}
              >
                Waarom raad je{' '}
                <span style={{ color: '#FF6B2B' }}>{beoordeeldeNaam}</span> niet
                aan?
              </h2>
            </div>

            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 300,
                color: 'rgba(28,21,16,0.6)',
                marginBottom: '1.25rem',
                lineHeight: 1.6,
              }}
            >
              Beschrijf kort wat er niet goed ging. Dit helpt de gemeenschap en is anoniem.
            </p>

            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <textarea
                value={reden}
                onChange={(e) => setReden(e.target.value)}
                placeholder="Beschrijf je ervaring..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  backgroundColor: 'white',
                  border: `1.5px solid ${redenGeldig ? 'rgba(28,21,16,0.2)' : 'rgba(28,21,16,0.12)'}`,
                  borderRadius: '10px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: 300,
                  color: '#1C1510',
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '0.625rem',
                  right: '0.75rem',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: redenGeldig ? '#FF6B2B' : 'rgba(28,21,16,0.3)',
                  transition: 'color 0.2s',
                }}
              >
                {reden.trim().length}/{MIN_REDEN_LENGTE}
              </div>
            </div>

            {fout && (
              <div
                style={{
                  backgroundColor: 'rgba(255,107,43,0.08)',
                  border: '1px solid rgba(255,107,43,0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  marginBottom: '1.25rem',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.875rem',
                  color: '#FF6B2B',
                }}
              >
                {fout}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setStap('vraag')}
                style={{
                  padding: '0.875rem 1.25rem',
                  backgroundColor: 'transparent',
                  color: 'rgba(28,21,16,0.5)',
                  border: '1.5px solid rgba(28,21,16,0.14)',
                  borderRadius: '10px',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                ← Terug
              </button>
              <button
                onClick={() => handleVerstuur(false, reden)}
                disabled={!redenGeldig || loading}
                style={{
                  flex: 1,
                  padding: '0.875rem',
                  backgroundColor: redenGeldig ? '#1C1510' : 'rgba(28,21,16,0.12)',
                  color: redenGeldig ? '#FAF7F4' : 'rgba(28,21,16,0.3)',
                  border: 'none',
                  borderRadius: '10px',
                  fontFamily: 'Bebas Neue, sans-serif',
                  fontSize: '1.1rem',
                  letterSpacing: '2px',
                  cursor: redenGeldig && !loading ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s, color 0.2s',
                }}
              >
                {loading ? 'Versturen...' : 'Verstuur beoordeling'}
              </button>
            </div>
          </>
        )}

        {/* Stap 3: Bevestiging */}
        {stap === 'bevestiging' && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                backgroundColor: aanbevolen ? 'rgba(34,197,94,0.1)' : 'rgba(28,21,16,0.06)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '1.75rem',
              }}
            >
              {aanbevolen ? '✅' : '👍'}
            </div>
            <h2
              style={{
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '1.75rem',
                letterSpacing: '2px',
                color: '#1C1510',
                marginBottom: '0.75rem',
              }}
            >
              Beoordeling verstuurd
            </h2>
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '0.9rem',
                fontWeight: 300,
                color: 'rgba(28,21,16,0.6)',
                lineHeight: 1.6,
                marginBottom: '1.75rem',
              }}
            >
              Bedankt! Jouw anonieme beoordeling helpt de gemeenschap van Feestjepakken.
            </p>
            <button
              onClick={onClose}
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: '#FF6B2B',
                color: '#FAF7F4',
                border: 'none',
                borderRadius: '10px',
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '1.1rem',
                letterSpacing: '2px',
                cursor: 'pointer',
              }}
            >
              Sluiten
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
