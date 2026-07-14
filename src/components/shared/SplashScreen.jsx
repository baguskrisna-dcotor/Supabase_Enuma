import React, { useEffect, useState } from 'react';
import { BrandLogo } from './BrandLogo';

// ─── Self-contained keyframe animations ────────────────────────────────────
const SPLASH_STYLES = `
  @keyframes splash-bg-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes splash-fade-out {
    0%   { opacity: 1; }
    100% { opacity: 0; }
  }
  @keyframes splash-logo-in {
    0%   { opacity: 0; transform: scale(0.82) translateY(8px); filter: blur(6px); }
    60%  { opacity: 1; transform: scale(1.03) translateY(-2px); filter: blur(0); }
    100% { opacity: 1; transform: scale(1)   translateY(0);     filter: blur(0); }
  }
  @keyframes splash-rise {
    0%   { opacity: 0; transform: translateY(24px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes splash-fade-in {
    0%   { opacity: 0; }
    100% { opacity: 1; }
  }
  @keyframes splash-slide-up {
    0%   { opacity: 0; transform: translateY(16px); filter: blur(4px); }
    100% { opacity: 1; transform: translateY(0);    filter: blur(0); }
  }
  @keyframes particle-float-1 {
    0%,100% { transform: translateY(0)   translateX(0)   scale(1);   opacity: 0.12; }
    50%     { transform: translateY(-32px) translateX(14px) scale(1.15); opacity: 0.3;  }
  }
  @keyframes particle-float-2 {
    0%,100% { transform: translateY(0)  translateX(0)    scale(1);   opacity: 0.09; }
    50%     { transform: translateY(26px) translateX(-18px) scale(0.88); opacity: 0.24; }
  }
  @keyframes particle-float-3 {
    0%,100% { transform: translateY(0)    translateX(0)  scale(1);   opacity: 0.07; }
    60%     { transform: translateY(-20px) translateX(10px) scale(1.25); opacity: 0.2;  }
  }
  @keyframes glow-pulse {
    0%,100% { opacity: 0.14; transform: scale(1); }
    50%     { opacity: 0.28; transform: scale(1.08); }
  }
  @keyframes ring-pulse {
    0%   { transform: translate(-50%,-50%) scale(0.8); opacity: 0.4; }
    100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; }
  }
  @keyframes divider-in {
    0%   { width: 0; opacity: 0; }
    100% { width: 64px; opacity: 1; }
  }
  @keyframes progress-fill {
    0%   { width: 0%; }
    100% { width: 100%; }
  }
`;

// ─── Particles ──────────────────────────────────────────────────────────────
const PARTICLES = [
  { s: 5,  t: '10%', l: '7%',  a: 'particle-float-1', d: '7.2s', dl: '0s'   },
  { s: 3,  t: '20%', l: '90%', a: 'particle-float-2', d: '9.1s', dl: '1.2s' },
  { s: 7,  t: '74%', l: '13%', a: 'particle-float-3', d: '8.0s', dl: '0.6s' },
  { s: 4,  t: '82%', l: '80%', a: 'particle-float-1', d: '10.5s',dl: '2.1s' },
  { s: 3,  t: '42%', l: '4%',  a: 'particle-float-2', d: '6.3s', dl: '1.7s' },
  { s: 6,  t: '33%', l: '94%', a: 'particle-float-3', d: '11.2s',dl: '0.9s' },
  { s: 4,  t: '60%', l: '52%', a: 'particle-float-1', d: '8.7s', dl: '3.2s' },
  { s: 8,  t: '4%',  l: '57%', a: 'particle-float-2', d: '7.8s', dl: '0.4s' },
  { s: 3,  t: '92%', l: '44%', a: 'particle-float-3', d: '9.8s', dl: '2.4s' },
  { s: 5,  t: '68%', l: '72%', a: 'particle-float-1', d: '6.8s', dl: '1.9s' },
  { s: 9,  t: '25%', l: '35%', a: 'particle-float-2', d: '12s',  dl: '0.7s' },
  { s: 4,  t: '55%', l: '18%', a: 'particle-float-3', d: '7.5s', dl: '3.8s' },
];

// ─── Timeline (ms) ──────────────────────────────────────────────────────────
// Adjusted for 5–6 second cinematic experience per spec:
// 0.0s bg in → 0.8s logo → 1.8s WELCOME ABOARD → 2.6s Flight title
// → 3.5s tagline → 4.3s quote → 5.4s fade out → 6.0s done
const T = {
  logo:    650,
  welcome: 1650,
  title:   2450,
  tagline: 3350,
  quote:   4050,
  fadeOut: 5350,
  done:    6000,
};

export const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase]       = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), T.logo),
      setTimeout(() => setPhase(2), T.welcome),
      setTimeout(() => setPhase(3), T.title),
      setTimeout(() => setPhase(4), T.tagline),
      setTimeout(() => setPhase(5), T.quote),
      setTimeout(() => setFadingOut(true), T.fadeOut),
      setTimeout(() => onComplete?.(), T.done),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const show = (n) => phase >= n;

  return (
    <>
      <style>{SPLASH_STYLES}</style>

      {/* ── Root ──────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse 90% 70% at 50% 42%, #171a35 0%, #0c0e1a 52%, #05060b 100%)',
          animation: fadingOut
            ? 'splash-fade-out 0.65s ease-in forwards'
            : 'splash-bg-in 0.5s ease-out forwards',
        }}
      >
        {/* ── Ambient glow ──────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 760, height: 760, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.20) 0%, rgba(99,102,241,0.05) 45%, transparent 70%)',
          animation: 'glow-pulse 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />

        {/* ── Outer glow ring ───────────────────────────────── */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800, height: 800, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)',
          animation: 'glow-pulse 6s ease-in-out infinite',
          animationDelay: '1s',
          pointerEvents: 'none',
        }} />

        {/* ── Ripple rings ──────────────────────────────────── */}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 340, height: 340, borderRadius: '50%',
            border: `1px solid rgba(99,102,241,${0.2 - i * 0.04})`,
            animation: `ring-pulse ${2.8 + i * 0.9}s ease-out infinite`,
            animationDelay: `${i * 0.85}s`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* ── Grid texture ──────────────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
          pointerEvents: 'none',
        }} />

        {/* ── Particles ─────────────────────────────────────── */}
        {PARTICLES.map((p, i) => (
          <div key={i} style={{
            position: 'absolute', top: p.t, left: p.l,
            width: p.s, height: p.s, borderRadius: '50%',
            background: i % 3 === 0
              ? 'rgba(99,102,241,0.65)'
              : i % 3 === 1
              ? 'rgba(139,92,246,0.55)'
              : 'rgba(168,85,247,0.48)',
            boxShadow: `0 0 ${p.s * 2.5}px rgba(99,102,241,0.45)`,
            animation: `${p.a} ${p.d} ease-in-out infinite`,
            animationDelay: p.dl,
            pointerEvents: 'none',
          }} />
        ))}

        {/* ── Main content ──────────────────────────────────── */}
        <div style={{
          position: 'relative', zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', textAlign: 'center',
          padding: '0 24px', maxWidth: 920, width: '100%',
          gap: 0,
        }}>

          {/* LOGO — large, centered, prominent */}
          <div style={{
            marginBottom: 34,
            opacity:   show(1) ? 1 : 0,
            animation: show(1) ? 'splash-logo-in 0.85s cubic-bezier(0.34,1.4,0.64,1) forwards' : 'none',
          }}>
            <BrandLogo
              size="hero"
              className="shadow-[0_0_70px_rgba(99,102,241,0.18)]"
              imgClassName="w-[min(82vw,560px)] h-auto"
            />
          </div>

          {/* WELCOME ABOARD */}
          <div style={{
            marginBottom: 20,
            opacity:   show(2) ? 1 : 0,
            animation: show(2) ? 'splash-rise 0.7s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
          }}>
            <p style={{
              margin: 0,
              fontSize: 'clamp(11px, 1.6vw, 14px)',
              fontWeight: 700,
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: 'rgba(165,180,252,0.7)',
              fontFamily: '"Inter", system-ui, sans-serif',
            }}>
              Welcome Aboard
            </p>
          </div>

          {/* FLIGHT — very large title */}
          <div style={{
            marginBottom: 28,
            opacity:   show(3) ? 1 : 0,
            animation: show(3) ? 'splash-slide-up 0.75s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
          }}>
            <span style={{
              display: 'block',
              fontSize: 'clamp(56px, 11vw, 96px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              background: 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 40%, #818cf8 75%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontFamily: '"Inter", system-ui, sans-serif',
              textShadow: 'none',
            }}>
              Flight
            </span>
          </div>

          {/* Animated divider */}
          <div style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.7), rgba(139,92,246,0.5), transparent)',
            marginBottom: 24,
            opacity:   show(4) ? 1 : 0,
            animation: show(4) ? 'divider-in 0.6s ease-out forwards' : 'none',
            width: 0,
          }} />

          {/* TAGLINE */}
          <div style={{
            marginBottom: 36,
            opacity:   show(4) ? 1 : 0,
            animation: show(4) ? 'splash-fade-in 0.65s ease-out forwards' : 'none',
          }}>
            <p style={{
              margin: 0,
              fontSize: 'clamp(14px, 2.4vw, 20px)',
              fontWeight: 400,
              color: 'rgba(209,213,219,0.65)',
              letterSpacing: '0.05em',
              fontFamily: '"Inter", system-ui, sans-serif',
              lineHeight: 1.5,
            }}>
              Where Projects Take Flight
            </p>
          </div>

          {/* QUOTE CARD */}
          <div style={{
            opacity:   show(5) ? 1 : 0,
            animation: show(5) ? 'splash-slide-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards' : 'none',
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 16,
            padding: 'clamp(18px, 3vw, 28px) clamp(22px, 4vw, 40px)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            maxWidth: 560,
            width: '100%',
            boxShadow: '0 0 52px rgba(99,102,241,0.10)',
          }}>
            <p style={{
              margin: 0,
              fontSize: 'clamp(18px, 3.2vw, 28px)',
              fontWeight: 300,
              color: 'rgba(229,231,235,0.88)',
              lineHeight: 1.7,
              fontStyle: 'italic',
              fontFamily: '"Inter", system-ui, sans-serif',
              letterSpacing: '0.01em',
            }}>
              "If Google has Drive,
              <br />
              I Have{' '}
              <span style={{
                fontStyle: 'normal',
                fontWeight: 700,
                color: 'rgba(165,180,252,1)',
                background: 'linear-gradient(135deg, #a5b4fc, #818cf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Flight.
              </span>"
            </p>
          </div>
        </div>

        {/* ── Progress bar ──────────────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 2,
          background: 'rgba(99,102,241,0.1)',
          opacity: show(1) ? 1 : 0,
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #6366f1, #a5b4fc)',
            animation: show(1) ? `progress-fill ${(T.fadeOut - T.logo) / 1000}s linear forwards` : 'none',
          }} />
        </div>

        {/* ── Page dots ─────────────────────────────────────── */}
        <div style={{
          position: 'absolute', bottom: 28, left: '50%',
          transform: 'translateX(-50%)',
          opacity: show(2) ? 0.5 : 0,
          animation: show(2) ? 'splash-fade-in 0.5s ease-out forwards' : 'none',
          display: 'flex', gap: 7, alignItems: 'center',
        }}>
          {[0,1,2,3,4].map((i) => (
            <div key={i} style={{
              width:  i < phase - 1 ? 8  : i === phase - 1 ? 22 : 8,
              height: 4,
              borderRadius: 2,
              background: i < phase - 1
                ? 'rgba(99,102,241,0.9)'
                : i === phase - 1
                ? 'rgba(165,180,252,0.85)'
                : 'rgba(99,102,241,0.2)',
              transition: 'all 0.45s cubic-bezier(0.34,1.56,0.64,1)',
            }} />
          ))}
        </div>
      </div>
    </>
  );
};
