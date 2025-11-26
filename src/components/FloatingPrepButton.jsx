
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import "@styles/floatingPrepButton.css";

export default function FloatingPrepButton({ visible, onClick }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="prep-button-container"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{
            duration: 0.45,
            ease: "easeOut"
          }}
        >
          <button
            className="prep-button"
            onClick={onClick}
          >
            Iniciar preparación
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

