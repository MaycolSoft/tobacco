import { motion } from "framer-motion";
import TobaccoFamiliesInfo from "./TobaccoFamiliesInfo";
import TobaccoFamilyGallery from "./TobaccoFamilyGallery";
import "@styles/tobacco-guide-page.css";

export default function TobaccoGuidePage() {
  return (
    <motion.div
      className="tobacco-guide-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4 }}
    >
      <TobaccoFamiliesInfo />
      <TobaccoFamilyGallery />
    </motion.div>
  );
}
