import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Factory, History as HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/history/hero.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Производство АО Пластик"
          className="w-full h-full object-cover opacity-40 image-industrial"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Factory className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">АО «Пластик»</h2>
            <p className="text-muted-foreground">С 1959 года</p>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-hero-title text-center mb-6"
        >
          Инновации.<br />Качество.<br />Традиции.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-hero-subtitle text-center max-w-2xl mb-12"
        >
          Ведущий производитель полимерных изделий в России с более чем 60-летней историей
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/about/history")}
            className="group px-8 py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-300 hover:scale-105"
          >
            <HistoryIcon className="w-5 h-5 mr-3" />
            Узнать нашу историю
            <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex gap-8 text-muted-foreground text-sm">
            <span>65+ лет опыта</span>
            <span className="text-primary">•</span>
            <span>Инновации</span>
            <span className="text-primary">•</span>
            <span>Устойчивое развитие</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
