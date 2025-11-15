import { motion } from "framer-motion";
import "@styles/tobacco-families-info.css";

const columnVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * i, duration: 0.4 }
  })
};

export default function TobaccoFamiliesInfo() {
  return (
    <motion.div
      className="tobacco-info-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="tobacco-info-title">Tobacco Families Guide</h1>
      <p className="tobacco-info-subtitle">
        The main tobacco families define how a blend will burn, smell and taste.
        Here are their real characteristics.
      </p>

      <div className="tobacco-info-grid">
        {/* Labels */}
        <motion.div
          className="tobacco-info-column tobacco-info-labels"
          custom={0}
          variants={columnVariants}
          initial="hidden"
          animate="visible"
        >
          <p>CURING</p>
          <p>COLOR</p>
          <p>AROMA</p>
          <p>COMBUSTION</p>
          <p>CHARACTERISTIC</p>
          <p>FLAVOR</p>
        </motion.div>

        {/* Kentucky */}
        <motion.div
          className="tobacco-info-column"
          custom={1}
          variants={columnVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="tobacco-info-header">KENTUCKY</h3>
          <p>Fire</p>
          <p>Dark brown</p>
          <p>Smoky</p>
          <p>Slow</p>
          <p>Strong</p>
          <p>Aromatic and robust</p>
        </motion.div>

        {/* Burley */}
        <motion.div
          className="tobacco-info-column"
          custom={2}
          variants={columnVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="tobacco-info-header">BURLEY</h3>
          <p>Air</p>
          <p>Brown</p>
          <p>Chocolate-like</p>
          <p>Fast</p>
          <p>Savory</p>
          <p>Full and nutty</p>
        </motion.div>

        {/* Virginia */}
        <motion.div
          className="tobacco-info-column"
          custom={3}
          variants={columnVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="tobacco-info-header">VIRGINIA</h3>
          <p>Hot air / flue</p>
          <p>Yellow to golden</p>
          <p>Mild, sweet</p>
          <p>Slow</p>
          <p>Aromatic</p>
          <p>Natural sweetness</p>
        </motion.div>

        {/* Oriental */}
        <motion.div
          className="tobacco-info-column"
          custom={4}
          variants={columnVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="tobacco-info-header">ORIENTAL</h3>
          <p>Sun</p>
          <p>Yellow–greenish</p>
          <p>Highly aromatic</p>
          <p>Medium</p>
          <p>Exotic</p>
          <p>Very aromatic</p>
        </motion.div>
      </div>

      <p className="tobacco-info-footer">
        A master blender combines these families to create a balanced, pleasant
        and aromatic cigar.
      </p>
    </motion.div>
  );
}
