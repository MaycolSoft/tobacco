import LeafCard from "./LeafCard";
import "@/styles/leaf-grid.css";

export default function LeafGrid({ leaves, selectedLeaves, onSelect }) {
  return (
    <div style={{padding: "20px"}}>
      <h2>Leaves</h2>
      <div className="image-grid">
        {leaves.map(leaf => (
          <div className="image-grid-item" key={leaf.id}>
            <LeafCard
              leaf={leaf}
              isSelected={selectedLeaves.includes(leaf.id)}
              onSelect={onSelect}
              />
          </div>
        ))}
      </div>
    </div>
  );
}
