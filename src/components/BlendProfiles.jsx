import "../styles/blend-profiles.css"; 
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BlendProfiles({ blends = [], onSelectCombo }) {
  return (
    <section className="ls-blend-section">
      <div className="ls-blend-header">
        <h2 className="ls-blend-section-title">Master Blends</h2>
        <span className="ls-blend-section-subtitle">Curated exceptional configurations by our Master Blenders</span>
      </div>

      <div className="ls-blend-carousel-wrapper">
        <BlendCarouselRow
          items={blends}
          onSelectCombo={onSelectCombo}
        />
      </div>
    </section>
  );
}

function BlendCarouselRow({ items, onSelectCombo }) {
  const [selected, setSelected] = useState(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const scrollRef = useRef(null);
  const containerRef = useRef(null);

  const cardWidth = 290; // Card width (260px) + gap (30px)

  useEffect(() => {
    const calculateConstraints = () => {
      if (containerRef.current && scrollRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const scrollWidth = items.length * cardWidth;
        const maxDrag = containerWidth - scrollWidth;
        setDragConstraints({ left: maxDrag < 0 ? maxDrag : 0, right: 0 });
      }
    };

    calculateConstraints();
    window.addEventListener("resize", calculateConstraints);
    return () => window.removeEventListener("resize", calculateConstraints);
  }, [items.length]);

  const onDragEnd = (event, info) => {
    const currentX = info.point.x;
    const row = scrollRef.current;
    if (!row) return;

    // Fallback alignment utilizing native/calculated matrix parsing or direct offset snapping
    const currentTransform = window.getComputedStyle(row).transform;
    let matrixX = 0;
    if (currentTransform && currentTransform !== "none") {
      const values = currentTransform.split('(')[1].split(')')[0].split(',');
      matrixX = parseFloat(values[4]);
    }

    const index = Math.round(Math.abs(matrixX) / cardWidth);
    const snapTarget = -(index * cardWidth);

    // Smooth boundary clamp fallback logic if constraints leak
    const finalSnap = Math.max(dragConstraints.left, Math.min(0, snapTarget));
  };

  const handleSelect = (index, blend) => {
    if (selected === index) {
      setSelected(null);
      if (onSelectCombo) onSelectCombo([]);
      return;
    }

    setSelected(index);
    if (onSelectCombo) onSelectCombo(blend.combination);
  };

  return (
    <div className="ls-blend-carousel-row-wrapper" ref={containerRef}>
      <motion.div
        className="ls-blend-carousel-row"
        ref={scrollRef}
        drag="x"
        dragConstraints={dragConstraints}
        dragElastic={0.05}
        onDragEnd={onDragEnd}
        style={{ display: "flex", gap: "30px", width: "max-content" }}
      >
        {items.map((blend, index) => {
          const isSelected = selected === index;
          return (
            <motion.div
              key={index}
              className={`ls-blend-carousel-card ${isSelected ? "active" : ""}`}
              whileHover={{
                rotateY: 1,
                // rotateX: -1,
                // y: -1,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              style={{ transformStyle: "preserve-3d" }}
              onClick={() => handleSelect(index, blend)}
            >
              <div className="ls-blend-card-frame">
                <div className="ls-blend-card-bg">
                  {blend.image ? (
                    <img src={blend.image} alt={blend.name} className="ls-blend-img" />
                  ) : (
                    <div className="ls-blend-img-placeholder" />
                  )}
                </div>

                <div className="ls-blend-card-content">
                  <h3 className="ls-blend-card-title">{blend.name}</h3>
                  <p className="ls-blend-card-desc">{blend.description}</p>

                  <div className="ls-blend-badges">
                    {blend.combination.map((id) => (
                      <span key={id} className="ls-blend-badge-item">
                        ID: {id}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="ls-blend-selection-indicator">
                  <span className="ls-blend-indicator-text">Active Combination</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}