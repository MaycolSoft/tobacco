import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import leafImage from '@/assets/capa-habana.webp';
// import leafImage from '@/assets/capa-habana2.png';
import '@/styles/AnatomiaHoja.css';



gsap.registerPlugin(ScrollTrigger);

const AnatomiaHoja = ({ leaf }) => {
  const containerRef = useRef(null);
  const leafRef = useRef(null);
  const svgRef = useRef(null);
  const markersRef = useRef([]);
  const textBlocksRef = useRef([]);

  // Coordenadas optimizadas para los 4 pilares del tabaco
  const defaultCoords = [
    { x: 50, y: 15 }, // Punto 1: Identidad
    { x: 45, y: 40 }, // Punto 2: Sabor/Notas
    { x: 55, y: 65 }, // Punto 3: Fortaleza/Humo
    { x: 50, y: 85 }  // Punto 4: Combustión
  ];

  const [coords, setCoords] = useState(() => {
    const saved = localStorage.getItem('leaf-marker-final');
    return saved ? JSON.parse(saved) : defaultCoords;
  });

  // Mapeo de la información del experto en puntos de interés
  const sections = [
    { 
      title: "Identidad Premium", 
      tag: "APARIENCIA",
      desc: "Presenta una apariencia brillante y aceitosa. Es el estándar de oro en estética para cigarros de alta gama.",
      stats: ["Brillo Intenso", "Textura Fina"],
      side: "right" 
    },
    { 
      title: "Perfil Aromático", 
      tag: "SABORES",
      desc: "Aporta un dulzor natural elegante con notas marcadas de madera tostada, cacao y tierra.",
      stats: ["Pimienta", "Madera", "Cacao"],
      side: "left" 
    },
    { 
      title: "Cuerpo y Humo", 
      tag: "ESTRUCTURA",
      desc: "Proporciona una fuerza media–alta con un humo denso y altamente aromático que llena el paladar.",
      stats: ["Cuerpo Denso", "Fuerza 4/5"],
      side: "right" 
    },
    { 
      title: "Combustión", 
      tag: "DINÁMICA",
      desc: "Su quema es moderada–lenta, permitiendo que la evolución del sabor sea constante y placentera.",
      stats: ["Quema Lenta", "Ceniza Firme"],
      side: "left" 
    }
  ];

  const handleDrag = (index, e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const point = svg.createSVGPoint();
    point.x = e.clientX; point.y = e.clientY;
    const cursorpt = point.matrixTransform(svg.getScreenCTM().inverse());
    
    setCoords(prevCoords => {
      const newCoords = [...prevCoords];
      newCoords[index] = {
        x: Math.max(5, Math.min(95, cursorpt.x)),
        y: Math.max(5, Math.min(95, cursorpt.y))
      };
      localStorage.setItem('leaf-marker-final', JSON.stringify(newCoords));
      return newCoords;
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=500%",
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      tl.fromTo(leafRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 2 });

      sections.forEach((_, i) => {
        gsap.set(markersRef.current[i], { opacity: 0, scale: 0 });
        gsap.set(textBlocksRef.current[i], { opacity: 0, x: i % 2 === 0 ? 40 : -40, filter: "blur(12px)" });

        tl.to(markersRef.current[i], { opacity: 1, scale: 1, duration: 1 })
          .to(textBlocksRef.current[i], { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.5 }, "<")
          .to([markersRef.current[i], textBlocksRef.current[i]], { opacity: 0, duration: 1 }, "+=1.8");
      });

      tl.to(leafRef.current, { scale: 1.1, opacity: 0, filter: "blur(20px)", duration: 2 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="th-viewport">
      <div className="th-dev-hint">Editor de Anatomía: {sections.length} Puntos Activos</div>

      <div className="th-canvas">
        <div className="th-leaf-wrapper">
          <img ref={leafRef} src={leaf?.fullImg} alt="Hoja de Tabaco" className="th-leaf-main" />
          
          <svg ref={svgRef} className="th-svg-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
            {sections.map((s, i) => (
              <g 
                key={i} 
                ref={el => markersRef.current[i] = el} 
                className="th-marker-group"
                onMouseDown={(e) => {
                  e.preventDefault();
                  const moveHandler = (ev) => handleDrag(i, ev);
                  window.addEventListener('mousemove', moveHandler);
                  window.addEventListener('mouseup', () => window.removeEventListener('mousemove', moveHandler), { once: true });
                }}
              >
                <circle cx={coords[i].x} cy={coords[i].y} r="7" fill="transparent" />
                <circle cx={coords[i].x} cy={coords[i].y} r="1.2" fill="#d4af37" />
                <circle cx={coords[i].x} cy={coords[i].y} r="3" stroke="#d4af37" strokeWidth="0.5" fill="none" className="th-pulse-ring" />
              </g>
            ))}
          </svg>
        </div>

        <div className="th-overlay-content">
          {sections.map((s, i) => {
            const isRight = s.side === 'right';
            return (
              <div 
                key={i} 
                ref={el => textBlocksRef.current[i] = el}
                className={`th-floating-text th-side-${s.side}`}
                style={{ 
                  top: `${coords[i].y}%`, 
                  left: isRight ? `${coords[i].x + 6}%` : 'auto',
                  right: !isRight ? `${(100 - coords[i].x) + 6}%` : 'auto',
                }}
              >
                <div className="th-text-box">
                  <span className="th-tag-label">{s.tag}</span>
                  <h2>{s.title}</h2>
                  <p>{s.desc}</p>
                  <div className="th-stats-chips">
                    {s.stats.map(stat => <span key={stat} className="th-chip">{stat}</span>)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnatomiaHoja;