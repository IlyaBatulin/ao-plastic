import { motion } from "framer-motion";
import type { InfographicItem } from "@/data/historyPeriods22";

interface InfographicProps {
  items: InfographicItem[];
}

const Infographic22 = ({ items }: InfographicProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6">
      {items.map((item, index) => (
        <motion.div
          key={`${item.label}-${index}`}
          className="card-industrial p-4 md:p-6 rounded-lg text-center"
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.3 + index * 0.1,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">
            {item.value}
          </div>
          <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Infographic22;
