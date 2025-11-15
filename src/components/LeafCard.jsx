import { motion } from "framer-motion";
import "@styles/leaf-card.css";

export default function LeafCard({ leaf, isSelected, onSelect }) {
  return (
    <motion.div
      className={`image-card ${isSelected ? "image-card-selected" : ""}`}
      onClick={() => onSelect(leaf.id)}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <img src={leaf.image} alt={leaf.name} className="image-card-image" />
      <p className="image-card-title">{leaf.name}</p>
    </motion.div>
  );
}
