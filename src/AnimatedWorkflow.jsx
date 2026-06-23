import { useState, useEffect, useRef, Fragment } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Lenis from "lenis";

// Hero showcase video
import automationVideo from "./assets/Automation-video.mp4";

// Step videos
import step01 from "./assets/videos/step-01.mp4";
import step02 from "./assets/videos/step-02.mp4";
import step03 from "./assets/videos/step-03.mp4";
import step04 from "./assets/videos/step-04.mp4";
import step05 from "./assets/videos/step-05.mp4";
import step06 from "./assets/videos/step-06.mp4";
import step07 from "./assets/videos/step-07.mp4";

// Tool icons
import iconWhatsapp from "./assets/icons/whatsapp.svg";
import iconEmail from "./assets/icons/email.svg";
import iconGoogleForms from "./assets/icons/google-forms.svg";
import iconSlack from "./assets/icons/slack.svg";
import iconNotion from "./assets/icons/notion.svg";
import iconOpenAI from "./assets/icons/openai.svg";
import iconN8n from "./assets/icons/n8n.svg";
import iconMongo from "./assets/icons/mongodb.svg";
import iconGemini from "./assets/icons/gemini.svg";
import iconReact from "./assets/icons/react.svg";

// ============ SMOOTH SCROLL ============
function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}

// ============ FLOATING ICONS (Vibrant + Random) ============
// Each icon has brand color glow for prominence
const iconPool = [
  { src: iconWhatsapp, glow: "#25D366", label: "WhatsApp" },
  { src: iconEmail, glow: "#EA4335", label: "Email" },
  { src: iconGoogleForms, glow: "#7248B9", label: "Forms" },
  { src: iconSlack, glow: "#4A154B", label: "Slack" },
  { src: iconNotion, glow: "#FFFFFF", label: "Notion" },
  { src: iconOpenAI, glow: "#10A37F", label: "OpenAI" },
  { src: iconN8n, glow: "#EA4B71", label: "n8n" },
  { src: iconMongo, glow: "#47A248", label: "MongoDB" },
  { src: iconGemini, glow: "#4285F4", label: "Gemini" },
  { src: iconReact, glow: "#61DAFB", label: "React" },
];

// ============ GRID-BASED, NO-OVERLAP ICON PLACER ============
// Divide screen into a grid. Each icon claims one cell + random offset within it.
// Total icons = pool size (10) → each tool shown exactly once.
function generateGridIcons(seed = 0) {
  const cols = 5;
  const rows = 4;
  const cellW = 100 / cols; // % width per cell
  const cellH = 100 / rows; // % height per cell

  // Build all cell coords, shuffle them deterministically with seed
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ r, c });
    }
  }
  // Simple seeded shuffle (Fisher-Yates with seeded pseudo-random)
  const rand = (s) => {
    let x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rand(seed + i) * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  // Assign each unique icon to one cell
  return iconPool.map((pool, i) => {
    const cell = cells[i];
    // Add small random offset inside cell (10–80% of cell size)
    const insetX = 0.15 + rand(seed + i * 3) * 0.55;
    const insetY = 0.15 + rand(seed + i * 5) * 0.55;
    const top = `${cell.r * cellH + insetY * cellH}%`;
    const left = `${cell.c * cellW + insetX * cellW}%`;

    return {
      ...pool,
      id: `${seed}-${i}`,
      top,
      left,
      size: 44 + rand(seed + i * 7) * 28, // 44 → 72px
      delay: rand(seed + i * 11) * 4,
      duration: 8 + rand(seed + i * 13) * 6,
      opacity: 0.6 + rand(seed + i * 17) * 0.3,
      yRange: 18 + rand(seed + i * 19) * 22,
      xRange: 12 + rand(seed + i * 23) * 18,
      rotateRange: 6 + rand(seed + i * 29) * 10,
    };
  });
}

function FloatingIconsBackground({ seed = 0 }) {
  const [icons] = useState(() => generateGridIcons(seed));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1,
      }}
    >
      {icons.map((icon) => (
        <motion.img
          key={icon.id}
          src={icon.src}
          alt={icon.label}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{
            opacity: [0, icon.opacity, icon.opacity * 0.6, icon.opacity, 0],
            scale: [0.7, 1, 0.95, 1, 0.7],
            y: [0, -icon.yRange, 0, -icon.yRange * 0.4, 0],
            x: [0, icon.xRange, -icon.xRange * 0.7, icon.xRange * 0.3, 0],
            rotate: [
              0,
              icon.rotateRange,
              -icon.rotateRange,
              icon.rotateRange * 0.4,
              0,
            ],
          }}
          transition={{
            duration: icon.duration,
            delay: icon.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: icon.top,
            left: icon.left,
            width: `${icon.size}px`,
            height: `${icon.size}px`,
            transform: "translate(-50%, -50%)", // ⬅ anchor at center, prevents edge clipping
            filter: `drop-shadow(0 0 18px ${icon.glow}AA) drop-shadow(0 0 35px ${icon.glow}55) brightness(1.5) saturate(1.3)`,
          }}
        />
      ))}
    </div>
  );
}

// ============ SECTION DATA ============
const sections = [
  {
    id: "hero",
    badge: "✦ AI-POWERED · END-TO-END WORKFLOW",
    title: "Workflow Automation,\nReimagined.",
    subtitle:
      "User Action → AI Graph → Automated Execution → Real-Time Dashboard → Notifications → AI Evaluation → Reports. All in one platform.",
    cta: "See How It Works ↓",
    color: "#A78BFA",
  },
  {
    step: "01",
    title: "Your Dashboard. Your Data.",
    subtitle: "USER INPUT LAYER",
    desc: "Multi-tenant secure login. Provide AI prompts in natural language or build with basic form fields. Text, number, date, file uploads, checkboxes, radio buttons — all supported.",
    bullets: [
      "AI prompt or manual field entry",
      "Live editing without affecting active respondents",
      "All inputs encrypted, authenticated & validated",
    ],
    pain: "No more juggling 5 different tools.",
    color: "#0EA5E9",
    video: step01,
  },
  {
    step: "02",
    title: "Describe It. AI Builds It.",
    subtitle: "AI WORKFLOW ENGINE",
    desc: "NLP engine (OpenAI / Gemini) parses your prompt and converts it into a workflow graph JSON. Input → Processing → Output nodes, each mapped to an automation task.",
    bullets: [
      "Natural language → workflow graph",
      "AI suggests missing fields & optimizes sequence",
      "Stored in MongoDB with multi-tenant isolation",
    ],
    pain: "Stop manually designing complex workflows.",
    color: "#10B981",
    video: step02,
  },
  {
    step: "03",
    title: "Automate Everything.",
    subtitle: "WORKFLOW AUTOMATION",
    desc: "WebSockets for live updates. Node-by-node execution in real time. n8n integration for cross-platform automation with WhatsApp, email & in-app notifications.",
    bullets: [
      "Real-time input collection & processing",
      "Cross-platform via n8n integrations",
      "WhatsApp, email & in-app alerts",
    ],
    pain: "No manual dragging, no tool juggling, no re-publishing.",
    color: "#F59E0B",
    video: step03,
  },
  {
    step: "04",
    title: "Secure. Scalable. Versioned.",
    subtitle: "DATA STORAGE LAYER",
    desc: "MongoDB collections for Users, Workflows & Responses. All data encrypted. Version history preserved for every edit. Scalable to future cloud deployment.",
    bullets: [
      "Users, Workflows & Responses collections",
      "Full version history on every edit",
      "Scalable cloud-ready architecture",
    ],
    pain: "Your data is always safe and recoverable.",
    color: "#8B5CF6",
    video: step04,
  },
  {
    step: "05",
    title: "See Everything. Live.",
    subtitle: "LIVE DASHBOARD & UI",
    desc: "Real-time dashboard showing active workflows, live submissions, and node-by-node execution status. Track responses completed, tasks executed & workflow efficiency.",
    bullets: [
      "Active workflows & live submissions",
      "Node-by-node execution status",
      "Responses, tasks & efficiency metrics",
    ],
    pain: "Full visibility into every running workflow.",
    color: "#EAB308",
    video: step05,
  },
  {
    step: "06",
    title: "AI Evaluates. You Act.",
    subtitle: "EVALUATION & REPORTING",
    desc: "AI evaluates collected responses, flags missing information, and generates insights & recommendations. Real-time notifications via WhatsApp, email & in-app alerts.",
    bullets: [
      "AI flags gaps & generates insights",
      "Real-time multi-channel notifications",
      "Reports stored, versioned & exportable",
    ],
    pain: "Stop manually sorting thousands of responses.",
    color: "#3B82F6",
    video: step06,
  },
  {
    step: "07",
    title: "Locked Down. Fully Audited.",
    subtitle: "SECURITY & COMPLIANCE",
    desc: "All data encrypted in transit & at rest. JWT + session authentication. Role-based access control. Complete audit logs for every workflow and AI action.",
    bullets: [
      "End-to-end encryption (transit & rest)",
      "JWT + session-based authentication",
      "RBAC & full audit trail on all actions",
    ],
    pain: "Enterprise-grade security from day one.",
    color: "#EF4444",
    video: step07,
  },
  {
    id: "cta",
    badge: "READY TO TRANSFORM YOUR WORKFLOW?",
    title: "Stop Building Forms.\nStart Building Workflows.",
    subtitle:
      "Live editing, full AI-driven creation, multi-channel notifications, end-to-end automation — multi-industry ready, scalable & secure.",
    cta: "Start Free Trial →",
    cta2: "Book a Demo",
    color: "#EC4899",
  },
];

// ============ STEP VIDEO BLOCK (Restart on scroll-in) ============
function VideoBlock({ src, color, step }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.4 });

  useEffect(() => {
    const vid = ref.current;
    if (!vid) return;

    if (inView) {
      vid.currentTime = 0; // ⟲ restart from beginning
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [inView]);

  return (
    <>
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${color}20 0%, transparent 50%, ${color}10 100%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "clamp(16px, 2vw, 24px)",
          left: "clamp(16px, 2vw, 24px)",
          fontSize: "clamp(60px, 10vw, 120px)",
          fontWeight: 900,
          color: `${color}30`,
          lineHeight: 1,
          pointerEvents: "none",
          textShadow: `0 0 30px ${color}80`,
        }}
      >
        {step}
      </div>
    </>
  );
}

// ============ SECTION COMPONENT ============
function Section({ data, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, margin: "200px" });
  const isLeft = index % 2 === 0;

  // HERO / CTA
  if (data.id === "hero" || data.id === "cta") {
    return (
      <section
        ref={ref}
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          padding: "clamp(40px, 8vw, 80px) clamp(16px, 5vw, 40px)",
        }}
      >
        {/* Bright floating tool icons — hero AND CTA */}
        {data.id === "hero" && <FloatingIconsBackground seed={1} />}
        {data.id === "cta" && <FloatingIconsBackground seed={7} />}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: "center",
            zIndex: 10,
            maxWidth: "900px",
            width: "100%",
            position: "relative",
          }}
        >
          {/* Subtle dark blur behind text for readability over bright icons */}
          <div
            style={{
              position: "absolute",
              inset: "-40px -60px",
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)",
              zIndex: -1,
              filter: "blur(20px)",
            }}
          />

          <div
            style={{
              display: "inline-block",
              padding: "clamp(5px, 1vw, 6px) clamp(12px, 2vw, 18px)",
              background: `${data.color}20`,
              border: `1px solid ${data.color}40`,
              borderRadius: "100px",
              fontSize: "clamp(9px, 1.1vw, 11px)",
              color: data.color,
              letterSpacing: "clamp(1.5px, 0.3vw, 2.5px)",
              fontWeight: 600,
              marginBottom: "clamp(16px, 3vw, 24px)",
              backdropFilter: "blur(10px)",
            }}
          >
            {data.badge}
          </div>

          <h1
            style={{
              fontSize: "clamp(32px, 8vw, 84px)",
              fontWeight: 800,
              background: `linear-gradient(135deg, #fff 0%, ${data.color} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              margin: "0 0 clamp(14px, 2.5vw, 20px) 0",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              whiteSpace: "pre-line",
            }}
          >
            {data.title}
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: "clamp(14px, 1.8vw, 20px)",
              maxWidth: "600px",
              margin: "0 auto clamp(24px, 4vw, 36px)",
              lineHeight: 1.6,
              padding: "0 16px",
              textShadow: "0 2px 20px rgba(0,0,0,0.8)",
            }}
          >
            {data.subtitle}
          </p>

          <div
            style={{
              display: "flex",
              gap: "clamp(8px, 1.5vw, 12px)",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                padding: "clamp(12px, 1.8vw, 14px) clamp(22px, 4vw, 32px)",
                background: `linear-gradient(135deg, ${data.color}, #EC4899)`,
                border: "none",
                borderRadius: "100px",
                color: "white",
                fontWeight: 600,
                fontSize: "clamp(13px, 1.4vw, 15px)",
                cursor: "pointer",
                boxShadow: `0 10px 40px ${data.color}50`,
                whiteSpace: "nowrap",
              }}
            >
              {data.cta}
            </button>
            {data.cta2 && (
              <button
                style={{
                  padding: "clamp(12px, 1.8vw, 14px) clamp(22px, 4vw, 32px)",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "100px",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "clamp(13px, 1.4vw, 15px)",
                  cursor: "pointer",
                  backdropFilter: "blur(10px)",
                  whiteSpace: "nowrap",
                }}
              >
                {data.cta2}
              </button>
            )}
          </div>
        </motion.div>
      </section>
    );
  }

  // FEATURE / STEP SECTIONS
  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "clamp(60px, 10vw, 100px) clamp(20px, 6vw, 80px)",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
          gap: "clamp(32px, 5vw, 60px)",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
          animate={
            inView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -60 : 60 }
          }
          transition={{ duration: 0.8 }}
          style={{ order: isLeft ? 1 : 2, minWidth: 0 }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: "clamp(10px, 1.1vw, 11px)",
              color: data.color,
              letterSpacing: "clamp(2px, 0.3vw, 3px)",
              fontWeight: 700,
              marginBottom: "clamp(10px, 1.5vw, 12px)",
            }}
          >
            STEP {data.step} · {data.subtitle}
          </div>

          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 56px)",
              fontWeight: 800,
              margin: "0 0 clamp(14px, 2.5vw, 20px) 0",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              background: `linear-gradient(135deg, #fff 0%, ${data.color}CC 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {data.title}
          </h2>

          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "clamp(14px, 1.4vw, 17px)",
              lineHeight: 1.7,
              marginBottom: "clamp(20px, 3vw, 28px)",
            }}
          >
            {data.desc}
          </p>

          <div style={{ marginBottom: "clamp(20px, 3.5vw, 32px)" }}>
            {data.bullets.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "clamp(10px, 1.2vw, 12px)",
                  marginBottom: "clamp(10px, 1.5vw, 12px)",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "clamp(13px, 1.3vw, 15px)",
                  lineHeight: 1.5,
                }}
              >
                <div
                  style={{
                    width: "clamp(18px, 2vw, 20px)",
                    height: "clamp(18px, 2vw, 20px)",
                    borderRadius: "50%",
                    background: `${data.color}25`,
                    border: `1.5px solid ${data.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: data.color,
                    fontSize: "clamp(10px, 1.1vw, 11px)",
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  ✓
                </div>
                <span>{b}</span>
              </motion.div>
            ))}
          </div>

          <div
            style={{
              padding: "clamp(14px, 1.8vw, 16px) clamp(16px, 2vw, 20px)",
              background: `${data.color}10`,
              border: `1px solid ${data.color}30`,
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              gap: "clamp(10px, 1.2vw, 12px)",
            }}
          >
            <div
              style={{ fontSize: "clamp(18px, 2.2vw, 22px)", flexShrink: 0 }}
            >
              💡
            </div>
            <div
              style={{
                color: "white",
                fontSize: "clamp(12px, 1.3vw, 14px)",
                fontWeight: 600,
                fontStyle: "italic",
                lineHeight: 1.4,
              }}
            >
              {data.pain}
            </div>
          </div>
        </motion.div>

        {/* VIDEO (auto-restart on scroll-in) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={
            inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }
          }
          transition={{ duration: 1 }}
          style={{
            order: isLeft ? 2 : 1,
            height: "clamp(280px, 45vw, 500px)",
            width: "100%",
            position: "relative",
            borderRadius: "clamp(16px, 2vw, 24px)",
            overflow: "hidden",
            background: `radial-gradient(circle at center, ${data.color}15 0%, #000 70%)`,
            border: `1px solid ${data.color}40`,
            boxShadow: `0 20px 60px ${data.color}25, 0 0 80px ${data.color}10`,
            minWidth: 0,
          }}
        >
          <VideoBlock src={data.video} color={data.color} step={data.step} />
        </motion.div>
      </div>
    </section>
  );
}

// ============ VIDEO SHOWCASE (with controls) ============
function VideoShowcase() {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-replay on scroll-in
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (inView) {
      vid.currentTime = 0;
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [inView]);

  // Track progress
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const update = () => {
      if (!isDragging && vid.duration) {
        setProgress((vid.currentTime / vid.duration) * 100);
      }
    };
    vid.addEventListener("timeupdate", update);
    return () => vid.removeEventListener("timeupdate", update);
  }, [isDragging]);

  // Click/drag on progress bar to seek
  const handleSeek = (e) => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    const bar = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - bar.left;
    const pct = Math.max(0, Math.min(1, clickX / bar.width));
    vid.currentTime = pct * vid.duration;
    setProgress(pct * 100);
  };

  return (
    <section
      ref={ref}
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "clamp(40px, 8vw, 80px) clamp(16px, 5vw, 40px)",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7 }}
        style={{
          textAlign: "center",
          marginBottom: "clamp(24px, 4vw, 48px)",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 18px",
            background: "rgba(167, 139, 250, 0.12)",
            border: "1px solid rgba(167, 139, 250, 0.3)",
            borderRadius: "100px",
            fontSize: "clamp(9px, 1.1vw, 11px)",
            color: "#A78BFA",
            letterSpacing: "2.5px",
            fontWeight: 600,
            marginBottom: "clamp(12px, 2vw, 20px)",
            backdropFilter: "blur(10px)",
          }}
        >
          ▶ PLATFORM DEMO
        </div>
        <h2
          style={{
            fontSize: "clamp(26px, 5vw, 52px)",
            fontWeight: 800,
            background: "linear-gradient(135deg, #fff 0%, #A78BFA 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: 0,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          See It in Action
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={
          inView
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 0.92, y: 40 }
        }
        transition={{ duration: 0.9, ease: "easeOut" }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "960px",
          borderRadius: "clamp(12px, 2vw, 24px)",
          padding: "2px",
          background: "linear-gradient(135deg, #A78BFA, #EC4899, #0EA5E9)",
          boxShadow:
            "0 0 60px rgba(167, 139, 250, 0.25), 0 0 120px rgba(236, 72, 153, 0.1)",
          zIndex: 2,
        }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: "calc(clamp(12px, 2vw, 24px) - 2px)",
            overflow: "hidden",
            background: "#0a0a0a",
          }}
        >
          <video
            ref={videoRef}
            src={automationVideo}
            muted
            loop
            playsInline
            autoPlay
            disablePictureInPicture
            style={{
              width: "100%",
              display: "block",
              borderRadius: "calc(clamp(12px, 2vw, 24px) - 2px)",
              pointerEvents: "none", // prevent right-click menu on video
            }}
          />

          {/* CUSTOM PROGRESS BAR — only thing visible */}
          <div
            onMouseDown={(e) => {
              setIsDragging(true);
              handleSeek(e);
            }}
            onMouseMove={(e) => {
              if (isDragging) handleSeek(e);
            }}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onClick={handleSeek}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "8px",
              background: "rgba(255,255,255,0.15)",
              cursor: "pointer",
              transition: "height 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.height = "12px")}
            onMouseOut={(e) => {
              if (!isDragging) e.currentTarget.style.height = "8px";
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #A78BFA, #EC4899)",
                boxShadow: "0 0 12px rgba(167, 139, 250, 0.8)",
                transition: isDragging ? "none" : "width 0.15s linear",
              }}
            />
          </div>
        </div>
      </motion.div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70%",
          height: "70%",
          background:
            "radial-gradient(circle, rgba(167, 139, 250, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </section>
  );
}

// ============ PROGRESS BAR ============
function ProgressNav() {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        background: "linear-gradient(90deg, #8B5CF6, #EC4899)",
        width,
        zIndex: 100,
        boxShadow: "0 0 20px #8B5CF6",
      }}
    />
  );
}

// ============ FLOATING NAV DOTS ============
function FloatingNav() {
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    const handler = () => {
      const secs = document.querySelectorAll("section");
      secs.forEach((s, i) => {
        const rect = s.getBoundingClientRect();
        if (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        ) {
          setActive(i);
        }
      });
    };
    window.addEventListener("scroll", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div
      style={{
        position: "fixed",
        right: "clamp(16px, 2.5vw, 30px)",
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        zIndex: 100,
      }}
    >
      {sections.map((s, i) => (
        <div
          key={i}
          style={{
            width: active === i ? "12px" : "6px",
            height: active === i ? "12px" : "6px",
            borderRadius: "50%",
            background:
              active === i ? s.color || "#A78BFA" : "rgba(255,255,255,0.2)",
            transition: "all 0.3s",
            cursor: "pointer",
            boxShadow:
              active === i ? `0 0 12px ${s.color || "#A78BFA"}` : "none",
          }}
        />
      ))}
    </div>
  );
}

// ============ MAIN ============
export default function AnimatedWorkflow() {
  useSmoothScroll();

  return (
    <div
      style={{
        background: "#000",
        color: "white",
        fontFamily: "Inter, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      <ProgressNav />
      <FloatingNav />

      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at top, #1e1b4b 0%, #0f172a 40%, #000 100%)",
          zIndex: -1,
        }}
      />

      {sections.map((s, i) => (
        <Fragment key={i}>
          <Section data={s} index={i} />
          {s.id === "hero" && <VideoShowcase />}
        </Fragment>
      ))}

      <footer
        style={{
          padding: "40px",
          textAlign: "center",
          color: "rgba(255,255,255,0.4)",
          fontSize: "13px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        © 2026 EzeeFlow · AI-Powered Workflow Automation Platform
      </footer>
    </div>
  );
}
