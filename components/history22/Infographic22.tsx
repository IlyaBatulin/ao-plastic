import { motion } from "framer-motion";
import type { InfographicItem } from "@/data/historyPeriods22";

interface InfographicProps {
  items: InfographicItem[];
  isVisible: boolean;
}

const Infographic22 = ({ items, isVisible }: InfographicProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
      {items.map((item, index) => (
        <motion.div
          key={`${item.label}-${index}`}
          className="relative bg-card border border-border shadow-lg hover:shadow-xl p-6 md:p-8 lg:p-10 rounded-xl text-center transition-all overflow-hidden group"
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={isVisible ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: 60, scale: 0.9 }}
          transition={{
            duration: 0.5,
            delay: 0.3 + index * 0.1,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          {/* Анимированная синяя полоса сверху */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-600 to-primary animate-pulse" />
          
          {/* Дополнительная анимированная линия */}
          <div className="absolute top-0 left-0 h-1 bg-primary animate-[slide_3s_ease-in-out_infinite]" 
               style={{ 
                 width: '30%',
                 animationDelay: `${index * 0.5}s`
               }} 
          />
          
          <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform">
            {item.value}
          </div>
          <div className="text-sm md:text-base lg:text-lg text-muted-foreground uppercase tracking-wider font-medium">
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Infographic22;
