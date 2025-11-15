import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { leaves } from "@/data/leaves";
import "@styles/tobacco-family-gallery.css";

const families = ["Kentucky", "Burley", "Virginia", "Oriental"];

export default function TobaccoFamilyGallery() {
  const [activeFamily, setActiveFamily] = useState("Kentucky");

  const filteredLeaves = useMemo(
    () => leaves.filter((leaf) => leaf.family === activeFamily),
    [activeFamily]
  );

  return (
    <div className="tobacco-gallery-container">
      <h2 className="tobacco-gallery-title">Tobacco Leaves by Family</h2>
      <p className="tobacco-gallery-subtitle">
        Select a family to explore real leaves, their appearance and role in a blend.
      </p>

      <div className="tobacco-gallery-tabs">
        {families.map((family) => (
          <button
            key={family}
            className={`tobacco-gallery-tab ${
              family === activeFamily ? "tobacco-gallery-tab-active" : ""
            }`}
            onClick={() => setActiveFamily(family)}
          >
            {family}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFamily}
          className="tobacco-gallery-grid"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          {filteredLeaves.map((leaf) => (
            <motion.div
              key={leaf.id}
              className="tobacco-gallery-card"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <div className="tobacco-gallery-image-wrapper">
                <img
                  src={leaf.image}
                  alt={leaf.name}
                  className="tobacco-gallery-image"
                />
              </div>
              <div className="tobacco-gallery-card-body">
                <h3 className="tobacco-gallery-card-title">{leaf.name}</h3>
                <p className="tobacco-gallery-card-meta">
                  Family: {leaf.family} • Role: {leaf.role}
                </p>
                <p className="tobacco-gallery-card-meta">
                  Curing: {leaf.curing} • Color: {leaf.color}
                </p>
                <p className="tobacco-gallery-card-description">
                  {leaf.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
