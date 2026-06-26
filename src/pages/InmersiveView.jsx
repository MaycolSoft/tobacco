import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import '@/styles/AnatomiaHoja.css';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const InmersiveView = ({ leaf }) => {
  const containerRef = useRef(null);
  const leafRef = useRef(null);
  const svgRef = useRef(null);
  const autoScrollRef = useRef(null);

  const markersRef = useRef([]);
  const textBlocksRef = useRef([]);

  const [isPlaying, setIsPlaying] = useState(false);

  // Default marker positions
  const defaultCoords = [
    { x: 50, y: 15 },
    { x: 45, y: 40 },
    { x: 55, y: 65 },
    { x: 50, y: 85 },
  ];

  const [coords, setCoords] = useState(() => {
    const saved = localStorage.getItem('leaf-marker-final');
    return saved ? JSON.parse(saved) : defaultCoords;
  });

  // Leaf information sections
  const sections = [
    {
      title: 'Identidad Premium',
      tag: 'APARIENCIA',
      desc: 'Presenta una apariencia brillante y aceitosa. Es el estándar de oro en estética para cigarros de alta gama.',
      stats: ['Brillo Intenso', 'Textura Fina'],
      side: 'right',
    },
    {
      title: 'Perfil Aromático',
      tag: 'SABORES',
      desc: 'Aporta un dulzor natural elegante con notas marcadas de madera tostada, cacao y tierra.',
      stats: ['Pimienta', 'Madera', 'Cacao'],
      side: 'left',
    },
    {
      title: 'Cuerpo y Humo',
      tag: 'ESTRUCTURA',
      desc: 'Proporciona una fuerza media–alta con un humo denso y altamente aromático que llena el paladar.',
      stats: ['Cuerpo Denso', 'Fuerza 4/5'],
      side: 'right',
    },
    {
      title: 'Combustión',
      tag: 'DINÁMICA',
      desc: 'Su quema es moderada–lenta, permitiendo que la evolución del sabor sea constante y placentera.',
      stats: ['Quema Lenta', 'Ceniza Firme'],
      side: 'left',
    },
  ];

  // Pause automatic scroll
  const pauseAutoScroll = () => {
    autoScrollRef.current?.pause();
    setIsPlaying(false);
  };

  // Resume automatic scroll
  const playAutoScroll = () => {
    autoScrollRef.current?.play();
    setIsPlaying(true);
  };

  // Toggle play / pause
  const toggleAutoScroll = () => {
    if (isPlaying) {
      pauseAutoScroll();
    } else {
      playAutoScroll();
    }
  };

  // Marker drag handler
  const handleDrag = (index, e) => {
    const svg = svgRef.current;
    if (!svg) return;

    const point = svg.createSVGPoint();

    point.x = e.clientX;
    point.y = e.clientY;

    const cursorPoint = point.matrixTransform(svg.getScreenCTM().inverse());

    setCoords((prevCoords) => {
      const newCoords = [...prevCoords];

      newCoords[index] = {
        x: Math.max(5, Math.min(95, cursorPoint.x)),
        y: Math.max(5, Math.min(95, cursorPoint.y)),
      };

      localStorage.setItem('leaf-marker-final', JSON.stringify(newCoords));

      return newCoords;
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=500%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Initial leaf entrance
      tl.fromTo(
        leafRef.current,
        { scale: 0.8, opacity: 1 },
        { scale: 1, opacity: 1, duration: 2 }
      );

      // Marker and text sequence
      sections.forEach((_, i) => {
        gsap.set(markersRef.current[i], {
          opacity: 0,
          scale: 0,
        });

        gsap.set(textBlocksRef.current[i], {
          opacity: 0,
          x: i % 2 === 0 ? 40 : -40,
          filter: 'blur(12px)',
        });

        tl.to(markersRef.current[i], {
          opacity: 1,
          scale: 1,
          duration: 1,
        })
          .to(
            textBlocksRef.current[i],
            {
              opacity: 1,
              x: 0,
              filter: 'blur(0px)',
              duration: 1.5,
            },
            '<'
          )
          .to(
            [markersRef.current[i], textBlocksRef.current[i]],
            {
              opacity: 0,
              duration: 1,
            },
            '+=1.8'
          );
      });

      // Final leaf exit
      tl.to(leafRef.current, {
        scale: 1.1,
        opacity: 0,
        filter: 'blur(20px)',
        duration: 2,
      });

      // Start automatic cinematic scroll
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();

        setTimeout(() => {
          const st = tl.scrollTrigger;

          if (!st) return;

          autoScrollRef.current = gsap.to(window, {
            scrollTo: st.end,
            duration: 18,
            ease: 'power1.inOut',
            paused: true, // 👈 CLAVE
          });
        }, 500);
      });
    }, containerRef.current);

    return () => {
      autoScrollRef.current?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <section className="th-section">
      <button className="th-play-toggle btn btn-primary btn-pill" onClick={toggleAutoScroll}>
        {isPlaying ? 'Pausar' : 'Continuar'}
      </button>

      <div
        ref={containerRef}
        className="th-viewport"
      >
        <div className="th-dev-hint">
          Editor de Anatomía: {sections.length} Puntos Activos
        </div>

        <div className="th-canvas">
          <div className="th-leaf-wrapper">
            <div className="th-leaf-img-wrap">
              <img
                ref={leafRef}
                src={
                  leaf?.fullImg ??
                  'https://png.pngtree.com/png-clipart/20220716/ourmid/pngtree-banana-yellow-fruit-banana-skewers-png-image_5944324.png'
                }
                alt="Hoja de Tabaco"
                className="th-leaf-main"
                onLoad={(e) => {
                  e.currentTarget.classList.add('loaded');
                  ScrollTrigger.refresh();
                }}
              />

              <div className="th-leaf-skeleton" />
            </div>

            <svg
              ref={svgRef}
              className="th-svg-overlay"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {sections.map((s, i) => (
                <g
                  key={s.title}
                  ref={(el) => {
                    markersRef.current[i] = el;
                  }}
                  className="th-marker-group"
                  onMouseDown={(e) => {
                    e.preventDefault();

                    const moveHandler = (ev) => handleDrag(i, ev);

                    window.addEventListener('mousemove', moveHandler);
                    window.addEventListener(
                      'mouseup',
                      () => window.removeEventListener('mousemove', moveHandler),
                      { once: true }
                    );
                  }}
                >
                  <circle cx={coords[i].x} cy={coords[i].y} r="7" fill="transparent" />
                  <circle cx={coords[i].x} cy={coords[i].y} r="1.2" fill="#d4af37" />
                  <circle
                    cx={coords[i].x}
                    cy={coords[i].y}
                    r="3"
                    stroke="#d4af37"
                    strokeWidth="0.5"
                    fill="none"
                    className="th-pulse-ring"
                  />
                </g>
              ))}
            </svg>
          </div>

          <div className="th-overlay-content">
            {sections.map((s, i) => {
              const isRight = s.side === 'right';

              return (
                <div
                  key={s.title}
                  ref={(el) => {
                    textBlocksRef.current[i] = el;
                  }}
                  className={`th-floating-text th-side-${s.side}`}
                  style={{
                    top: `${coords[i].y}%`,
                    left: isRight ? `${coords[i].x + 6}%` : 'auto',
                    right: !isRight ? `${100 - coords[i].x + 6}%` : 'auto',
                  }}
                >
                  <div className="th-text-box">
                    <span className="th-tag-label">{s.tag}</span>
                    <h2>{s.title}</h2>
                    <p>{s.desc}</p>

                    <div className="th-stats-chips">
                      {s.stats.map((stat) => (
                        <span key={stat} className="th-chip">
                          {stat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InmersiveView;