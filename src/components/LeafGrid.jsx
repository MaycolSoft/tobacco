import "@styles/leaf-grid.css";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LeafGrid({ leaves = [], selectedLeaves = [], onSelect }) {
  const [activeCategory, setActiveCategory] = useState("ALL");

  const categories = useMemo(() => {
    const unique = new Set(leaves.map((leaf) => leaf.category).filter(Boolean));
    return ["ALL", ...Array.from(unique)];
  }, [leaves]);

  const filteredLeaves = useMemo(() => {
    if (activeCategory === "ALL") return leaves;
    return leaves.filter((leaf) => leaf.category === activeCategory);
  }, [leaves, activeCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <section className="ls-grid-section">
      <div className="ls-grid-header">
        <h2 className="ls-grid-title">Materia Prima</h2>
        <span className="ls-grid-subtitle">Select exceptional leaves to craft your master legacy blend</span>
      </div>

      <div className="ls-filter-bar">
        {categories.map((category) => (
          <button
            key={category}
            className={`ls-filter-btn ${activeCategory === category ? "active" : ""}`}
            onClick={() => setActiveCategory(category)}
          >
            <span className="ls-filter-text">{category}</span>
            {activeCategory === category && (
              <motion.div layoutId="ls-active-pill" className="ls-filter-pill" />
            )}
          </button>
        ))}
      </div>

      <motion.div
        className="ls-grid-container"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredLeaves.map((leaf) => {
            const isSelected = selectedLeaves.includes(leaf.id);
            return (
              <motion.div
                key={leaf.id}
                className={`ls-grid-item ${isSelected ? "active" : ""}`}
                variants={itemVariants}
                layout
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect && onSelect(leaf.id)}
              >
                <div className="ls-card-frame">
                  <div className="ls-card-badge">{leaf.category}</div>

                  <div className="ls-image-wrapper">
                    <img
                      src={leaf.thumbImg || leaf.image}
                      alt={leaf.name}
                      className="ls-card-img"
                      loading="lazy"
                    />
                  </div>

                  <div className="ls-card-content">
                    <div className="ls-card-meta">
                      <h3 className="ls-card-title">{leaf.name}</h3>
                      <span className="ls-card-origin">{leaf.origin}</span>
                    </div>
                    <p className="ls-card-desc">{leaf.description}</p>
                  </div>

                  {leaf.hasInmersive && (
                    <div className="ls-immersive-indicator">
                      <span className="ls-indicator-dot" />
                      <span className="ls-indicator-text">Inmersive Experience Available</span>
                    </div>
                  )}

                  <div className="ls-selection-overlay">
                    <div className="ls-selection-status">
                      <span className="ls-status-icon">✓</span>
                      <span className="ls-status-text">Selected Leaf</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}