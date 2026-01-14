"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ShieldCheck, Zap, Search, Navigation, MapPin, MessageCircle, Users } from "lucide-react"
import { useEffect, useRef } from "react"

function Globe() {
    const brazilianStates = [
      // Região Norte
      { t: '12%', l: '35%', d: 0.2, s: 'teal', label: 'RR' },
      { t: '15%', l: '58%', d: 0.4, s: 'teal', label: 'AP' },
      { t: '28%', l: '30%', d: 0.6, s: 'teal', label: 'AM' },
      { t: '28%', l: '52%', d: 0.8, s: 'teal', label: 'PA' },
      { t: '42%', l: '12%', d: 1.0, s: 'teal', label: 'AC' },
      { t: '44%', l: '28%', d: 1.2, s: 'teal', label: 'RO' },
      { t: '45%', l: '55%', d: 1.4, s: 'teal', label: 'TO' },
      
      // Região Nordeste
      { t: '28%', l: '65%', d: 1.6, s: 'orange', label: 'MA' },
      { t: '32%', l: '70%', d: 1.8, s: 'orange', label: 'PI' },
      { t: '28%', l: '75%', d: 2.0, s: 'orange', label: 'CE' },
      { t: '30%', l: '82%', d: 2.2, s: 'orange', label: 'RN' },
      { t: '35%', l: '83%', d: 2.4, s: 'orange', label: 'PB' },
      { t: '38%', l: '81%', d: 2.6, s: 'orange', label: 'PE' },
      { t: '41%', l: '80%', d: 2.8, s: 'orange', label: 'AL' },
      { t: '44%', l: '79%', d: 3.0, s: 'orange', label: 'SE' },
      { t: '48%', l: '70%', d: 3.2, s: 'orange', label: 'BA' },
      
      // Região Centro-Oeste
      { t: '48%', l: '40%', d: 3.4, s: 'blue', label: 'MT' },
      { t: '56%', l: '54%', d: 3.6, s: 'blue', label: 'GO' },
      { t: '56%', l: '58%', d: 3.8, s: 'blue', label: 'DF' },
      { t: '65%', l: '42%', d: 4.0, s: 'blue', label: 'MS' },
      
      // Região Sudeste
      { t: '62%', l: '62%', d: 4.2, s: 'purple', label: 'MG' },
      { t: '63%', l: '72%', d: 4.4, s: 'purple', label: 'ES' },
      { t: '70%', l: '68%', d: 4.6, s: 'purple', label: 'RJ' },
      { t: '72%', l: '58%', d: 4.8, s: 'purple', label: 'SP' },
      
      // Região Sul
      { t: '78%', l: '54%', d: 5.0, s: 'pink', label: 'PR' },
      { t: '84%', l: '56%', d: 5.2, s: 'pink', label: 'SC' },
      { t: '90%', l: '50%', d: 5.4, s: 'pink', label: 'RS' },
    ]

  return (
    <div className="globe-container">
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="globe-atmosphere atmosphere-outer"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.05, 0.2, 0.05],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="globe-atmosphere atmosphere-inner"
      />
      
      <div className="globe-sphere">
        <div className="globe-gradient-1" />
        <div className="globe-gradient-2" />
        <div className="globe-gradient-3" />
        
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="globe-map"
          style={{ 
            backgroundImage: `radial-gradient(circle, #2dd4bf 2px, transparent 2px)`, 
            backgroundSize: '40px 40px' 
          }} 
        />
        
        <svg className="globe-lines" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
            </linearGradient>
            <filter id="lineGlow">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {[...Array(4)].map((_, i) => (
            <motion.path
              key={i}
              d={`M ${20 + i * 10} ${30 + i * 5} Q 50 50 ${80 - i * 10} ${70 - i * 5}`}
              fill="none"
              stroke="url(#flowGradient)"
              strokeWidth="0.5"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="1"
              filter="url(#lineGlow)"
              animate={{ strokeDashoffset: [1, -1] }}
              transition={{ 
                duration: 7 + i, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 0.5 
              }}
            />
          ))}
        </svg>

        {brazilianStates.map((m, i) => (
          <div key={i} className="marker-container" style={{ top: m.t, left: m.l }}>
            <motion.div
              animate={{ 
                scale: [1, 2.5, 1], 
                opacity: [0.6, 0.1, 0.6],
                boxShadow: [
                  "0 0 0px var(--marker-color)",
                  "0 0 15px var(--marker-color)",
                  "0 0 0px var(--marker-color)"
                ]
              }}
              transition={{ duration: 3 + i % 2, repeat: Infinity, delay: m.d }}
              className={`marker-pulse ${m.s}`}
              style={{ '--marker-color': `var(--${m.s}-glow)` }}
            />
            <div className={`marker-dot ${m.s}`} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="marker-label-wrapper"
            >
              <span className="marker-label">{m.label}</span>
              <div className="marker-label-line" />
            </motion.div>
          </div>
        ))}
      </div>
      
      {[1.1, 1.3, 1.5].map((scale, i) => (
        <motion.div
          key={i}
          className={`globe-orbit orbit-${i+1}`}
          style={{ width: `${100 * scale}%`, height: `${100 * scale}%` }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 50 + i * 15, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {[
        { duration: 20, delay: 0, color: '#2dd4bf', orbit: 1.2 },
        { duration: 30, delay: 5, color: '#3b82f6', orbit: 1.4 },
      ].map((sat, i) => (
        <motion.div
          key={i}
          className="satellite-wrapper"
          style={{ width: `${100 * sat.orbit}%`, height: `${100 * sat.orbit}%` }}
          animate={{ rotate: 360 }}
          transition={{ duration: sat.duration, repeat: Infinity, ease: "linear", delay: sat.delay }}
        >
          <div className="satellite" style={{ top: '0', left: '50%' }}>
            <div className="satellite-dot" style={{ backgroundColor: sat.color }} />
            <div className="satellite-ping" style={{ backgroundColor: sat.color }} />
          </div>
        </motion.div>
      ))}

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="globe-particle"
          initial={{ 
            x: Math.random() * 600 - 300, 
            y: Math.random() * 600 - 300,
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: [0, -60, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0, 0.3, 0],
          }}
          transition={{ 
            duration: 8 + Math.random() * 10, 
            repeat: Infinity,
            delay: Math.random() * 10
          }}
          style={{
            backgroundColor: ['#2dd4bf', '#3b82f6', '#a855f7'][i % 3]
          }}
        />
      ))}
    </div>
  )
}

export default function Pagina() {
  const containerRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  const rotateX = useTransform(y, [-300, 300], [10, -10])
  const rotateY = useTransform(x, [-300, 300], [-10, 10])
  
  const floatX = useTransform(x, [-300, 300], [-20, 20])
  const floatY = useTransform(y, [-300, 300], [-20, 20])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      mouseX.set(e.clientX - centerX)
      mouseY.set(e.clientY - centerY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  }

  const features = [
    { 
      icon: <MapPin className="w-6 h-6" />, 
      title: "Localização Inteligente", 
      desc: "O SolidarBairro detecta sua vizinhança e mostra o que está acontecendo em um raio seguro de 2km.",
      color: "blue",
      tag: "Proximidade"
    },
    { 
      icon: <MessageCircle className="w-6 h-6" />, 
      title: "Conexão de Impacto", 
      desc: "Escolha entre ajudar alguém próximo ou pedir um auxílio. Nossa interface facilita o primeiro contato.",
      color: "pink",
      tag: "Diálogo"
    },
    { 
      icon: <Users className="w-6 h-6" />, 
      title: "Comunidade Viva", 
      desc: "A ajuda sai do digital para o presencial. Vizinhos se conhecem, se ajudam e o bairro se fortalece.",
      color: "green",
      tag: "União"
    },
    { 
      icon: <Search className="w-6 h-6" />, 
      title: "Busca Amigável", 
      desc: "Encontre ajuda ou vizinhos sem complicações.",
      color: "teal",
      tag: "Intuitivo"
    },
    { 
      icon: <ShieldCheck className="w-6 h-6" />, 
      title: "Dados Protegidos", 
      desc: "Sua localização nunca é exposta publicamente.",
      color: "orange",
      tag: "Seguro"
    },
    { 
      icon: <Navigation className="w-6 h-6" />, 
      title: "Raio Personalizado", 
      desc: "Veja apenas o que importa no seu bairro.",
      color: "purple",
      tag: "Focado"
    }
  ]

  return (
    <main className="home-container" ref={containerRef}>
      <section className="hero-section">
        <div className="bg-blobs">
          <motion.div style={{ x: floatX, y: floatY }} className="blob-1" />
          <motion.div 
            style={{ 
              x: useTransform(floatX, (v) => v * -1.5), 
              y: useTransform(floatY, (v) => v * -1.5) 
            }}
            className="blob-2" 
          />
        </div>

        <div className="content-wrapper">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="header-group"
          >
            <motion.div variants={itemVariants} className="badge-wrapper">
              <div className="tech-badge">
                <Zap className="tech-badge-icon" />
                <span className="tech-badge-text">
                  Tecnologia de Proximidade
                </span>
              </div>
            </motion.div>

            <motion.h2 variants={itemVariants} className="main-title">
              Sua vizinhança na <br />
              <span className="gradient-text">palma da mão</span>
            </motion.h2>

            <motion.p variants={itemVariants} className="main-desc">
              O SolidarBairro foi desenhado para ser intuitivo. Nossa plataforma ajusta a experiência para o que está acontecendo <strong>realmente perto de você</strong>.
            </motion.p>
          </motion.div>

          <motion.div 
            style={{ rotateX, rotateY, perspective: 1200 }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="globe-wrapper"
          >
            <div className="globe-card">
              <div className="globe-overlay" />
              <Globe />
            </div>
          </motion.div>

          <div className="features-grid">
            {features.map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="feature-card"
              >
                <div className="feature-number">
                  {(i + 1).toString().padStart(2, '0')}
                </div>

                <div className={`icon-box ${item.color}`}>
                  {item.icon}
                </div>
                
                <div className="feature-info">
                  <div className="feature-tag">
                    {item.tag}
                  </div>
                  <h3 className="feature-title">
                    {item.title}
                  </h3>
                  <p className="feature-desc">
                    {item.desc}
                  </p>
                </div>

                <div className="progress-container">
                  <div className="progress-bar" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
