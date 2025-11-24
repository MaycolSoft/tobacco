import "../styles/blend-profiles.css";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function BlendCarouselPro({ blends, onSelectCombo }) {

  return (
    <>
      <h2 style={{padding:"20px"}}> Blends </h2>
      
      <div className="blend-carousel-wrapper">
        <BlendCarouselRow 
          items={blends} 
          onSelectCombo={onSelectCombo} 
        />
      </div>
    </>
  );
}


/// ROW COMPONENT WITH ALL FEATURES
function BlendCarouselRow({ items, onSelectCombo }) {

  const isMobile = window.innerWidth < 768;
  const leftConstraint = isMobile ? -3040 : -2050;


  const [selected, setSelected] = useState(null);
  const scrollRef = useRef(null);
  const cardWidth = 260;

  // Auto-snap to closest
  const onDragEnd = () => {
    const row = scrollRef.current;
    const scroll = row.scrollLeft;

    const index = Math.round(scroll / cardWidth);

    row.scrollTo({
      left: index * cardWidth,
      behavior: "smooth"
    });
  };

  const handleSelect = (index, blend) => {
    setSelected(index);
    onSelectCombo(blend.combination);

    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: "smooth"
    });
  };

  return (
    <div className="blend-carousel-row-wrapper">
      <motion.div
        className="blend-carousel-row"
        ref={scrollRef}
        drag="x"
        dragConstraints={{ left: leftConstraint, right: 0 }}
        dragElastic={0.04}
        onDragEnd={onDragEnd}
      >
        {items.map((blend, index) => (
          <motion.div
            key={index}
            className={`blend-carousel-card ${
              selected === index ? "blend-carousel-card-selected" : ""
            }`}
            whileHover={{ rotateY: 8, rotateX: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => handleSelect(index, blend)}
          >
            <div className="blend-carousel-card-bg">
              <img src={blend.image} alt={blend.name} />
            </div>

            <div className="blend-carousel-card-content">
              <h3>{blend.name}</h3>
              <p>{blend.description}</p>
              <div className="blend-carousel-badges">
                {blend.combination.map(id => (
                  <span key={id}>{id}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
