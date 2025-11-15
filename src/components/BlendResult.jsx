import { motion } from "framer-motion";
import "../styles/blend-result.css";

export default function BlendResult({ blend }) {
  if (!blend) return null;

  return (
    <motion.div
      className="blend-result"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <h2 className="blend-result-title">{blend.name}</h2>
      <p className="blend-result-description">{blend.description}</p>
    </motion.div>
  );
}
