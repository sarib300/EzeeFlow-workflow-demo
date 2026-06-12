import { useState, useEffect, useRef, Suspense, lazy } from 'react';

import { motion, useScroll, useTransform,  } from 'framer-motion';
import { useInView } from 'framer-motion';
import Lenis from 'lenis';



const ThreeScenes = lazy(() => import('./ThreeScenes'));


// ============ SMOOTH SCROLL SETUP ============
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}





// ============ SECTION DATA ============
const sections = [
  {
    id: 'hero',
    badge: '✦ AI-POWERED · ENTERPRISE GRADE',
    title: 'Form Automation,\nReimagined.',
    subtitle: 'From prompt to insight in 30 seconds. AI builds, evaluates, and improves your forms — autonomously.',
    cta: 'See How It Works ↓',
    color: '#A78BFA',
    scene: 'orb'
  },
  {
    step: '01',
    title: 'Any Input. Any Format.',
    subtitle: 'INPUT FLEXIBILITY',
    desc: 'Upload media, capture signatures, collect files, or simple text. 15+ input types supported out of the box.',
    bullets: ['Media uploads (image, video, audio)', 'Checkboxes, ratings, signatures', 'File attachments up to 100MB'],
    pain: 'No more juggling 5 different form tools.',
    color: '#0EA5E9',
    scene: 'cube'
  },
  {
    step: '02',
    title: 'Describe it. AI Builds it.',
    subtitle: 'AI FORM GENERATOR',
    desc: 'Type what you need. AI generates the entire form structure, validation rules, and field logic in seconds.',
    bullets: ['Natural language → working form', 'Auto-detects required fields', 'Smart validation built-in'],
    pain: 'Stop spending 2 hours dragging fields.',
    color: '#10B981',
    scene: 'orb'
  },
  {
    step: '03',
    title: 'Right People. Right Access.',
    subtitle: 'ROLE-BASED CONTROL',
    desc: 'Creator + selected users only. Granular permissions for editing and evaluating responses.',
    bullets: ['Owner-only edit rights by default', 'Invite specific evaluators', 'Full audit trail of changes'],
    pain: 'No more accidental edits by random users.',
    color: '#F59E0B',
    scene: 'torus'
  },
  {
    step: '04',
    title: 'Go Live in One Click.',
    subtitle: 'INSTANT PUBLISHING',
    desc: 'Shareable link generated instantly. Embed anywhere or send directly via WhatsApp & email.',
    bullets: ['Mobile-responsive by default', 'Custom domain support', 'No-code embedding'],
    pain: 'No developer needed to launch.',
    color: '#8B5CF6',
    scene: 'cube'
  },
  {
    step: '05',
    title: 'Edit Live. Zero Downtime.',
    subtitle: 'LIVE FORM EDITING',
    desc: 'Add fields, change types, update validations — even while form is collecting responses. Industry first.',
    bullets: ['Real-time field updates', 'No respondent disruption', 'Version history preserved'],
    pain: 'No more "republish & lose data" nightmare.',
    color: '#EAB308',
    scene: 'torus'
  },
  {
    step: '06',
    title: 'AI Evaluates. Per Role.',
    subtitle: 'INTELLIGENT EVALUATION',
    desc: 'HR sees candidate fit. CEO sees KPIs. Developers see technical scores. One submission → multiple insights.',
    bullets: ['Role-specific dashboards', 'Auto-categorization of responses', 'Custom scoring per role'],
    pain: 'Stop manually sorting 1000s of responses.',
    color: '#3B82F6',
    scene: 'orb'
  },
  {
    step: '07',
    title: 'AI Recommends. You Improve.',
    subtitle: 'AUTONOMOUS OPTIMIZATION',
    desc: 'After analyzing responses, AI suggests new fields to capture better data. Your forms get smarter weekly.',
    bullets: ['Auto-detect missing data points', 'A/B test recommendations', 'Continuous improvement loop'],
    pain: 'Your form gets better while you sleep.',
    color: '#EF4444',
    scene: 'cube'
  },
  {
    id: 'cta',
    badge: 'READY TO TRANSFORM YOUR WORKFLOW?',
    title: 'Stop Building Forms.\nStart Building Insights.',
    subtitle: 'Join 12,000+ teams replacing Typeform, Google Forms, and Jotform.',
    cta: 'Start Free Trial →',
    cta2: 'Book a Demo',
    color: '#EC4899',
    scene: 'orb'
  }
];

// ============ SECTION COMPONENT ============
function Section({ data, index }) {
const ref = useRef(null);
const inView = useInView(ref, { amount: 0.3 });
  const isLeft = index % 2 === 0;

function renderSceneFromLazy(ThreeScenes, data) {
  if (data.scene === 'orb') return <ThreeScenes.MorphingOrb color={data.color} />;
  if (data.scene === 'cube') return <ThreeScenes.FloatingCube color={data.color} />;
  if (data.scene === 'torus') return <ThreeScenes.TorusRing color={data.color} />;
  return <ThreeScenes.MorphingOrb color={data.color} />;
}

  // HERO and CTA sections (centered)
  if (data.id === 'hero' || data.id === 'cta') {
  return (
    <section ref={ref} style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 40px)'
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: inView ? 1 : 0.3, transition: 'opacity 1s' }}>
       {inView && (
  <Suspense fallback={null}>
    <ThreeScenes.SceneWrapper color={data.color}>
      {renderSceneFromLazy(ThreeScenes, data)}
    </ThreeScenes.SceneWrapper>
  </Suspense>
)}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8 }}
        style={{ 
          textAlign: 'center', 
          zIndex: 10, 
          maxWidth: '900px',
          width: '100%'
        }}
      >
        <div style={{
          display: 'inline-block',
          padding: 'clamp(5px, 1vw, 6px) clamp(12px, 2vw, 18px)',
          background: `${data.color}20`,
          border: `1px solid ${data.color}40`,
          borderRadius: '100px',
          fontSize: 'clamp(9px, 1.1vw, 11px)',
          color: data.color,
          letterSpacing: 'clamp(1.5px, 0.3vw, 2.5px)',
          fontWeight: 600,
          marginBottom: 'clamp(16px, 3vw, 24px)',
          backdropFilter: 'blur(10px)'
        }}>
          {data.badge}
        </div>
        <h1 style={{
          fontSize: 'clamp(32px, 8vw, 84px)',
          fontWeight: 800,
          background: `linear-gradient(135deg, #fff 0%, ${data.color} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 clamp(14px, 2.5vw, 20px) 0',
          letterSpacing: '-0.04em',
          lineHeight: 1.05,
          whiteSpace: 'pre-line'
        }}>
          {data.title}
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.6)',
          fontSize: 'clamp(14px, 1.8vw, 20px)',
          maxWidth: '600px',
          margin: '0 auto clamp(24px, 4vw, 36px)',
          lineHeight: 1.6,
          padding: '0 16px'
        }}>
          {data.subtitle}
        </p>
        <div style={{ 
          display: 'flex', 
          gap: 'clamp(8px, 1.5vw, 12px)', 
          justifyContent: 'center', 
          flexWrap: 'wrap' 
        }}>
          <button style={{
            padding: 'clamp(12px, 1.8vw, 14px) clamp(22px, 4vw, 32px)',
            background: `linear-gradient(135deg, ${data.color}, #EC4899)`,
            border: 'none',
            borderRadius: '100px',
            color: 'white',
            fontWeight: 600,
            fontSize: 'clamp(13px, 1.4vw, 15px)',
            cursor: 'pointer',
            boxShadow: `0 10px 40px ${data.color}50`,
            whiteSpace: 'nowrap'
          }}>
            {data.cta}
          </button>
          {data.cta2 && (
            <button style={{
              padding: 'clamp(12px, 1.8vw, 14px) clamp(22px, 4vw, 32px)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '100px',
              color: 'white',
              fontWeight: 600,
              fontSize: 'clamp(13px, 1.4vw, 15px)',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              whiteSpace: 'nowrap'
            }}>
              {data.cta2}
            </button>
          )}
        </div>
      </motion.div>
    </section>
  );
}

  // FEATURE sections (split layout)
 return (
  <section ref={ref} style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    padding: 'clamp(60px, 10vw, 100px) clamp(20px, 6vw, 80px)',
    position: 'relative'
  }}>
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
      gap: 'clamp(32px, 5vw, 60px)',
      alignItems: 'center',
      width: '100%'
    }}>
      {/* TEXT SIDE */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -60 : 60 }}
        transition={{ duration: 0.8 }}
        style={{ 
          order: isLeft ? 1 : 2,
          minWidth: 0
        }}
      >
        <div style={{
          display: 'inline-block',
          fontSize: 'clamp(10px, 1.1vw, 11px)',
          color: data.color,
          letterSpacing: 'clamp(2px, 0.3vw, 3px)',
          fontWeight: 700,
          marginBottom: 'clamp(10px, 1.5vw, 12px)'
        }}>
          STEP {data.step} · {data.subtitle}
        </div>
        <h2 style={{
          fontSize: 'clamp(28px, 5vw, 56px)',
          fontWeight: 800,
          color: 'white',
          margin: '0 0 clamp(14px, 2.5vw, 20px) 0',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          background: `linear-gradient(135deg, #fff 0%, ${data.color}CC 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          {data.title}
        </h2>
        <p style={{
          color: 'rgba(255,255,255,0.65)',
          fontSize: 'clamp(14px, 1.4vw, 17px)',
          lineHeight: 1.7,
          marginBottom: 'clamp(20px, 3vw, 28px)'
        }}>
          {data.desc}
        </p>

        <div style={{ marginBottom: 'clamp(20px, 3.5vw, 32px)' }}>
          {data.bullets.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'clamp(10px, 1.2vw, 12px)',
                marginBottom: 'clamp(10px, 1.5vw, 12px)',
                color: 'rgba(255,255,255,0.85)',
                fontSize: 'clamp(13px, 1.3vw, 15px)',
                lineHeight: 1.5
              }}
            >
              <div style={{
                width: 'clamp(18px, 2vw, 20px)',
                height: 'clamp(18px, 2vw, 20px)',
                borderRadius: '50%',
                background: `${data.color}25`,
                border: `1.5px solid ${data.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: data.color,
                fontSize: 'clamp(10px, 1.1vw, 11px)',
                fontWeight: 700,
                flexShrink: 0,
                marginTop: '2px'
              }}>✓</div>
              <span>{b}</span>
            </motion.div>
          ))}
        </div>

        <div style={{
          padding: 'clamp(14px, 1.8vw, 16px) clamp(16px, 2vw, 20px)',
          background: `${data.color}10`,
          border: `1px solid ${data.color}30`,
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(10px, 1.2vw, 12px)'
        }}>
          <div style={{ fontSize: 'clamp(18px, 2.2vw, 22px)', flexShrink: 0 }}>💡</div>
          <div style={{
            color: 'white',
            fontSize: 'clamp(12px, 1.3vw, 14px)',
            fontWeight: 600,
            fontStyle: 'italic',
            lineHeight: 1.4
          }}>
            {data.pain}
          </div>
        </div>
      </motion.div>

      {/* 3D SIDE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 1 }}
        style={{
          order: isLeft ? 2 : 1,
          height: 'clamp(280px, 45vw, 500px)',
          width: '100%',
          position: 'relative',
          borderRadius: 'clamp(16px, 2vw, 24px)',
          overflow: 'hidden',
          background: `radial-gradient(circle at center, ${data.color}15 0%, transparent 70%)`,
          border: `1px solid ${data.color}20`,
          minWidth: 0
        }}
      >
        {inView && <SceneWrapper color={data.color}>{renderScene()}</SceneWrapper>}
        
        <div style={{
          position: 'absolute',
          top: 'clamp(16px, 2vw, 24px)',
          left: 'clamp(16px, 2vw, 24px)',
          fontSize: 'clamp(60px, 10vw, 120px)',
          fontWeight: 900,
          color: `${data.color}15`,
          lineHeight: 1,
          pointerEvents: 'none',
          zIndex: 10
        }}>
          {data.step}
        </div>
      </motion.div>
    </div>
  </section>
);
}

// ============ PROGRESS INDICATOR ============
function ProgressNav() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  
  return (
    <motion.div style={{
      position: 'fixed',
      top: 0, left: 0,
      height: '3px',
      background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
      width,
      zIndex: 100,
      boxShadow: '0 0 20px #8B5CF6'
    }} />
  );
}

// ============ FLOATING NAV ============
function FloatingNav() {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handler = () => {
      const sections = document.querySelectorAll('section');
      sections.forEach((s, i) => {
        const rect = s.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          setActive(i);
        }
      });
    };
    window.addEventListener('scroll', handler);
    return () => {
      window.removeEventListener('scroll', handler);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div style={{
      position: 'fixed',
      right: 'clamp(16px, 2.5vw, 30px)',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 100
    }}>
      {sections.map((s, i) => (
        <div key={i} style={{
          width: active === i ? '12px' : '6px',
          height: active === i ? '12px' : '6px',
          borderRadius: '50%',
          background: active === i ? (s.color || '#A78BFA') : 'rgba(255,255,255,0.2)',
          transition: 'all 0.3s',
          cursor: 'pointer',
          boxShadow: active === i ? `0 0 12px ${s.color || '#A78BFA'}` : 'none'
        }} />
      ))}
    </div>
  );
}

// ============ MAIN COMPONENT ============
export default function AnimatedWorkflow() {
  useSmoothScroll();

  return (
    <div style={{
      background: '#000',
      color: 'white',
      fontFamily: 'Inter, -apple-system, sans-serif',
      overflow: 'hidden'
    }}>
      <ProgressNav />
      <FloatingNav />

      {/* Persistent background gradient */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 40%, #000 100%)',
        zIndex: -1
      }} />

      {sections.map((s, i) => (
        <Section key={i} data={s} index={i} />
      ))}

      {/* Footer */}
      <footer style={{
        padding: '40px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '13px',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        © 2025 EzeeFlow · AI Form Automation Platform
      </footer>
    </div>
  );
}