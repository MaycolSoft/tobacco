
import React, { useEffect } from "react";
import { motion } from "framer-motion";

export default function MixingAnimation({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2600);
    return () => clearTimeout(timer);
  }, [onFinish]);

  const leafSVG = (
    <svg
      width="55"
      height="55"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 2C20 14 6 26 6 40c0 14 12 22 26 22s26-8 26-22C58 26 44 14 32 2z"
        fill="#5FA14A"
        stroke="#3F6F2E"
        strokeWidth="3"
      />
    </svg>
  );

  const genLeafAnimation = (index) => ({
    initial: { opacity: 0, scale: 0.6 },
    animate: {
      opacity: [0.3, 1, 0.3],
      scale: [0.7, 1, 0.8, 1],
      rotateX: [0, 180, 360],
      rotateY: [0, 90, 180],
      rotateZ: [0, 45, -45, 0],
      x: [0, Math.sin(index) * 60, Math.cos(index) * -60, 0],
      y: [0, Math.cos(index) * 40, Math.sin(index) * -40, 0]
    },
    transition: {
      duration: 2.2,
      ease: "easeInOut",
      repeat: Infinity
    }
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,10,10,0.92)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(6px)",
        zIndex: 99999
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: "22px",
          marginBottom: "28px",
          letterSpacing: "0.7px",
        }}
      >
        Mixing your tobacco blend…
      </div>

      {/* Contenedor */}
      <div
        style={{
          position: "relative",
          width: 200,
          height: 200,
          perspective: "800px"
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transformStyle: "preserve-3d",
              x: "-50%",
              y: "-50%",
            }}
            {...genLeafAnimation(i)}
          >
            {leafSVG}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
