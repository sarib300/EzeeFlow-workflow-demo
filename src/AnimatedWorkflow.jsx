import { useState, useEffect, useRef, Suspense, Fragment } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, Environment, MeshDistortMaterial, 
  Stars, Sparkles as DreiSparkles
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import Lenis from 'lenis';
import automationVideo from './assets/Automation-video.mp4';

// ============ SMOOTH SCROLL ============
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}

// ============ 3D OBJECTS (native mesh, no drei shapes) ============

function MorphingOrb({ color }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.x = s.clock.elapsedTime * 0.3;
    ref.current.rotation.y = s.clock.elapsedTime * 0.2;
  });
  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={2}>
      <mesh ref={ref}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <MeshDistortMaterial 
          color={color} 
          distort={0.5} 
          speed={3} 
          metalness={0.9} 
          roughness={0.1} 
          emissive={color} 
          emissiveIntensity={0.4} 
        />
      </mesh>
    </Float>
  );
}

function FloatingCube({ color }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.x = s.clock.elapsedTime * 0.4;
    ref.current.rotation.y = s.clock.elapsedTime * 0.5;
  });
  return (
    <Float speed={1.5} floatIntensity={3}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.4, 1]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.95} 
          roughness={0.05} 
          emissive={color} 
          emissiveIntensity={0.3} 
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>
    </Float>
  );
}

function TorusRing({ color }) {
  const ref = useRef();
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.x = s.clock.elapsedTime * 0.5;
    ref.current.rotation.z = s.clock.elapsedTime * 0.3;
  });
  return (
    <Float speed={2}>
      <mesh ref={ref}>
        <torusGeometry args={[1.3, 0.4, 32, 100]} />
        <MeshDistortMaterial 
          color={color} 
          distort={0.3} 
          speed={2} 
          metalness={0.9} 
          roughness={0.1} 
          emissive={color} 
          emissiveIntensity={0.4} 
        />
      </mesh>
    </Float>
  );
}

function SceneWrapper({ children, color }) {
  const isLowPower = typeof navigator !== 'undefined' && 
    (navigator.hardwareConcurrency < 4 || /Mobile/.test(navigator.userAgent));

  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 50 }} 
      gl={{ antialias: !isLowPower, alpha: true, powerPreference: 'high-performance' }}
      dpr={isLowPower ? 1 : [1, 2]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color={color} />
        <pointLight position={[-5, -5, 5]} intensity={1} color="#fff" />
        <Stars radius={30} depth={50} count={600} factor={3} fade speed={1} />
        <DreiSparkles count={40} scale={[6, 6, 4]} size={2} speed={0.5} color={color} />
        {children}
        <Environment preset="city" />
        {!isLowPower && (
          <EffectComposer>
            <Bloom intensity={1} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
            <ChromaticAberration offset={[0.0006, 0.0006]} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}

// ============ SECTION DATA ============
const sections = [
  {
    id: 'hero',
    badge: '✦ AI-POWERED · END-TO-END WORKFLOW',
    title: 'Workflow Automation,\nReimagined.',
    subtitle: 'User Action → AI Graph → Automated Execution → Real-Time Dashboard → Notifications → AI Evaluation → Reports. All in one platform.',
    cta: 'See How It Works ↓',
    color: '#A78BFA',
    scene: 'orb'
  },
  {
    step: '01',
    title: 'Your Dashboard. Your Data.',
    subtitle: 'USER INPUT LAYER',
    desc: 'Multi-tenant secure login. Provide AI prompts in natural language or build with basic form fields. Text, number, date, file uploads, checkboxes, radio buttons — all supported.',
    bullets: ['AI prompt or manual field entry', 'Live editing without affecting active respondents', 'All inputs encrypted, authenticated & validated'],
    pain: 'No more juggling 5 different tools.',
    color: '#0EA5E9',
    scene: 'cube'
  },
  {
    step: '02',
    title: 'Describe It. AI Builds It.',
    subtitle: 'AI WORKFLOW ENGINE',
    desc: 'NLP engine (OpenAI / Gemini) parses your prompt and converts it into a workflow graph JSON. Input → Processing → Output nodes, each mapped to an automation task.',
    bullets: ['Natural language → workflow graph', 'AI suggests missing fields & optimizes sequence', 'Stored in MongoDB with multi-tenant isolation'],
    pain: 'Stop manually designing complex workflows.',
    color: '#10B981',
    scene: 'orb'
  },
  {
    step: '03',
    title: 'Automate Everything.',
    subtitle: 'WORKFLOW AUTOMATION',
    desc: 'WebSockets for live updates. Node-by-node execution in real time. n8n integration for cross-platform automation with WhatsApp, email & in-app notifications.',
    bullets: ['Real-time input collection & processing', 'Cross-platform via n8n integrations', 'WhatsApp, email & in-app alerts'],
    pain: 'No manual dragging, no tool juggling, no re-publishing.',
    color: '#F59E0B',
    scene: 'torus'
  },
  {
    step: '04',
    title: 'Secure. Scalable. Versioned.',
    subtitle: 'DATA STORAGE LAYER',
    desc: 'MongoDB collections for Users, Workflows & Responses. All data encrypted. Version history preserved for every edit. Scalable to future cloud deployment.',
    bullets: ['Users, Workflows & Responses collections', 'Full version history on every edit', 'Scalable cloud-ready architecture'],
    pain: 'Your data is always safe and recoverable.',
    color: '#8B5CF6',
    scene: 'cube'
  },
  {
    step: '05',
    title: 'See Everything. Live.',
    subtitle: 'LIVE DASHBOARD & UI',
    desc: 'Real-time dashboard showing active workflows, live submissions, and node-by-node execution status. Track responses completed, tasks executed & workflow efficiency.',
    bullets: ['Active workflows & live submissions', 'Node-by-node execution status', 'Responses, tasks & efficiency metrics'],
    pain: 'Full visibility into every running workflow.',
    color: '#EAB308',
    scene: 'torus'
  },
  {
    step: '06',
    title: 'AI Evaluates. You Act.',
    subtitle: 'EVALUATION & REPORTING',
    desc: 'AI evaluates collected responses, flags missing information, and generates insights & recommendations. Real-time notifications via WhatsApp, email & in-app alerts.',
    bullets: ['AI flags gaps & generates insights', 'Real-time multi-channel notifications', 'Reports stored, versioned & exportable'],
    pain: 'Stop manually sorting thousands of responses.',
    color: '#3B82F6',
    scene: 'orb'
  },
  {
    step: '07',
    title: 'Locked Down. Fully Audited.',
    subtitle: 'SECURITY & COMPLIANCE',
    desc: 'All data encrypted in transit & at rest. JWT + session authentication. Role-based access control. Complete audit logs for every workflow and AI action.',
    bullets: ['End-to-end encryption (transit & rest)', 'JWT + session-based authentication', 'RBAC & full audit trail on all actions'],
    pain: 'Enterprise-grade security from day one.',
    color: '#EF4444',
    scene: 'cube'
  },
  {
    id: 'cta',
    badge: 'READY TO TRANSFORM YOUR WORKFLOW?',
    title: 'Stop Building Forms.\nStart Building Workflows.',
    subtitle: 'Live editing, full AI-driven creation, multi-channel notifications, end-to-end automation — multi-industry ready, scalable & secure.',
    cta: 'Start Free Trial →',
    cta2: 'Book a Demo',
    color: '#EC4899',
    scene: 'orb'
  }
];

// ============ SECTION COMPONENT ============
function Section({ data, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, margin: '200px' });
  const isLeft = index % 2 === 0;

  const renderScene = () => {
    if (data.scene === 'orb') return <MorphingOrb color={data.color} />;
    if (data.scene === 'cube') return <FloatingCube color={data.color} />;
    if (data.scene === 'torus') return <TorusRing color={data.color} />;
    return <MorphingOrb color={data.color} />;
  };

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
          {inView && <SceneWrapper color={data.color}>{renderScene()}</SceneWrapper>}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', zIndex: 10, maxWidth: '900px', width: '100%' }}
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
          <div style={{ display: 'flex', gap: 'clamp(8px, 1.5vw, 12px)', justifyContent: 'center', flexWrap: 'wrap' }}>
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
            }}>{data.cta}</button>
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
              }}>{data.cta2}</button>
            )}
          </div>
        </motion.div>
      </section>
    );
  }

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
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -60 : 60 }}
          transition={{ duration: 0.8 }}
          style={{ order: isLeft ? 1 : 2, minWidth: 0 }}
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
            margin: '0 0 clamp(14px, 2.5vw, 20px) 0',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            background: `linear-gradient(135deg, #fff 0%, ${data.color}CC 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>{data.title}</h2>
          <p style={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: 'clamp(14px, 1.4vw, 17px)',
            lineHeight: 1.7,
            marginBottom: 'clamp(20px, 3vw, 28px)'
          }}>{data.desc}</p>

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
            }}>{data.pain}</div>
          </div>
        </motion.div>

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
          }}>{data.step}</div>
        </motion.div>
      </div>
    </section>
  );
}

// ============ VIDEO SHOWCASE ============
function VideoShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2 });

  return (
    <section
      ref={ref}
      style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: 'clamp(40px, 8vw, 80px) clamp(16px, 5vw, 40px)',
        overflow: 'hidden',
      }}
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7 }}
        style={{ textAlign: 'center', marginBottom: 'clamp(24px, 4vw, 48px)', zIndex: 2 }}
      >
        <div style={{
          display: 'inline-block',
          padding: '6px 18px',
          background: 'rgba(167, 139, 250, 0.12)',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          borderRadius: '100px',
          fontSize: 'clamp(9px, 1.1vw, 11px)',
          color: '#A78BFA',
          letterSpacing: '2.5px',
          fontWeight: 600,
          marginBottom: 'clamp(12px, 2vw, 20px)',
          backdropFilter: 'blur(10px)',
        }}>
          ▶ PLATFORM DEMO
        </div>
        <h2 style={{
          fontSize: 'clamp(26px, 5vw, 52px)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #fff 0%, #A78BFA 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
        }}>
          See It in Action
        </h2>
      </motion.div>

      {/* Video Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.92, y: 40 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '960px',
          borderRadius: 'clamp(12px, 2vw, 24px)',
          padding: '2px',
          background: 'linear-gradient(135deg, #A78BFA, #EC4899, #0EA5E9)',
          boxShadow: '0 0 60px rgba(167, 139, 250, 0.25), 0 0 120px rgba(236, 72, 153, 0.1)',
          zIndex: 2,
        }}
      >
        <div style={{
          borderRadius: 'calc(clamp(12px, 2vw, 24px) - 2px)',
          overflow: 'hidden',
          background: '#0a0a0a',
        }}>
          <video
            src={automationVideo}
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: '100%',
              display: 'block',
              borderRadius: 'calc(clamp(12px, 2vw, 24px) - 2px)',
            }}
          />
        </div>
      </motion.div>

      {/* Ambient glow behind video */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        height: '70%',
        background: 'radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />
    </section>
  );
}

// ============ PROGRESS BAR ============
function ProgressNav() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return (
    <motion.div style={{
      position: 'fixed', top: 0, left: 0, height: '3px',
      background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
      width, zIndex: 100, boxShadow: '0 0 20px #8B5CF6'
    }} />
  );
}

// ============ FLOATING NAV DOTS ============
function FloatingNav() {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    const handler = () => {
      const secs = document.querySelectorAll('section');
      secs.forEach((s, i) => {
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
      position: 'fixed', right: 'clamp(16px, 2.5vw, 30px)',
      top: '50%', transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', gap: '12px', zIndex: 100
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

// ============ MAIN ============
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

      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 40%, #000 100%)',
        zIndex: -1
      }} />

      {sections.map((s, i) => (
        <Fragment key={i}>
          <Section data={s} index={i} />
          {s.id === 'hero' && <VideoShowcase />}
        </Fragment>
      ))}

      <footer style={{
        padding: '40px', textAlign: 'center',
        color: 'rgba(255,255,255,0.4)', fontSize: '13px',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        © 2026 EzeeFlow · AI-Powered Workflow Automation Platform
      </footer>
    </div>
  );
}