import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShieldCheck, Zap, Search, Navigation, MapPin, MessageCircle, Users } from "lucide-react";
import { Globe } from "./Globe";
import { useEffect, useRef } from "react";
import "./home.css";

export default function GlobeFeatureSection() {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const rotateX = useTransform(y, [-300, 300], [5, -5]);
  const rotateY = useTransform(x, [-300, 300], [-5, 5]);
  
  const floatX = useTransform(x, [-300, 300], [-30, 30]);
  const floatY = useTransform(y, [-300, 300], [-30, 30]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const features = [
    { 
      icon: <MapPin className="w-8 h-8" />, 
      title: "Localização Inteligente", 
      desc: "O SolidarBairro detecta sua vizinhança e mostra o que está acontecendo em um raio seguro de 2km.",
      color: "blue",
      tag: "Proximidade"
    },
    { 
      icon: <MessageCircle className="w-8 h-8" />, 
      title: "Conexão de Impacto", 
      desc: "Escolha entre ajudar alguém próximo ou pedir um auxílio. Nossa interface facilita o primeiro contato.",
      color: "pink",
      tag: "Diálogo"
    },
    { 
      icon: <Navigation className="w-8 h-8" />, 
      title: "Raio Personalizado", 
      desc: "Veja apenas o que importa no seu bairro. Filtre por distância, tipo de ajuda ou urgência.",
      color: "purple",
      tag: "Focado"
    },
    { 
      icon: <Search className="w-8 h-8" />, 
      title: "Busca Amigável", 
      desc: "Encontre ajuda ou vizinhos sem complicações com nossa busca semântica por necessidade.",
      color: "teal",
      tag: "Intuitivo"
    }
  ];

  return (
    <main className="home-container" ref={containerRef}>
      <div className="bg-blobs">
        <motion.div style={{ x: floatX, y: floatY }} className="blob-1" />
        <motion.div 
          style={{ 
            x: useTransform(floatX, (v) => v * -1.2), 
            y: useTransform(floatY, (v) => v * -1.2) 
          }}
          className="blob-2" 
        />
        <motion.div 
          style={{ 
            x: useTransform(floatX, (v) => v * 0.8), 
            y: useTransform(floatY, (v) => v * -0.5) 
          }}
          className="blob-3" 
        />
      </div>

      <div className="ornament ornament-1" />
      <div className="ornament ornament-2" />

      <section className="hero-section">
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
                  Solidariedade Hiper-Local
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

          <div className="main-layout">
            <motion.div 
              style={{ rotateX, rotateY, perspective: 1200 }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="globe-column"
            >
              <div className="globe-wrapper">
                <div className="globe-card">
                  <Globe />
                </div>
              </div>
            </motion.div>

            <div className="features-column">
              <div className="features-staggered">
                {features.map((item, i) => (
                  <motion.div
                    key={i}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
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
          </div>
        </div>
      </section>
    </main>
  );
}
