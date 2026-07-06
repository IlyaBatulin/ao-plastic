import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroBlockProps {
  title: string;
  subtitle: string;
  textSlides: string[];
  scrollHint?: string;
  imageAlt?: string;
}

const HeroBlock22 = ({ title, subtitle, textSlides, scrollHint = "Прокрутите вниз", imageAlt = "АО Пластик производство" }: HeroBlockProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Image stays fixed, only dims slightly at end
  const imageOpacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.6]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  
  // Title fades out as we scroll
  const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  // Scroll indicator fades out quickly
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Text slides appear and disappear sequentially
  const slideCount = textSlides.length;
  const slideTransforms = textSlides.map((_, index) => {
    const start = 0.15 + (index * 0.7) / slideCount;
    const peak = start + 0.35 / slideCount;
    const end = start + 0.7 / slideCount;
    
    return {
      opacity: useTransform(scrollYProgress, [start, peak, end], [0, 1, 0]),
      y: useTransform(scrollYProgress, [start, peak, end], [60, 0, -60])
    };
  });

  return (
    <>
    <section className="relative overflow-hidden md:hidden">
      <div className="relative min-h-[100svh] px-5 py-20 flex flex-col justify-center">
        <img
          src="/images/history/history-hero.jpeg"
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover image-industrial"
        />
        <div className="absolute inset-0 overlay-gradient" />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground mb-5">
            {title}
          </h1>
          <p className="text-lg font-light leading-relaxed text-foreground/90">
            {subtitle}
          </p>
          <div className="mt-8 space-y-4">
            {textSlides.map((text, index) => (
              <p key={index} className="text-base leading-relaxed text-foreground/85">
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>

    <div 
      ref={containerRef} 
      className="relative hidden md:block"
      style={{ height: `${150 + slideCount * 50}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background image */}
        <motion.div 
          className="absolute inset-0"
          style={{ opacity: imageOpacity, scale: imageScale }}
        >
          <img
            src="/images/history/history-hero.jpeg"
            alt={imageAlt}
            className="w-full h-full object-cover image-industrial"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 overlay-gradient" />
        </motion.div>

        {/* Title and subtitle - visible at start */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          style={{ opacity: titleOpacity, y: titleY }}
        >
          <motion.h1 
            className="text-hero-title text-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h1>
          <motion.p 
            className="text-hero-subtitle text-center max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: indicatorOpacity }}
        >
          <span className="text-caption text-muted-foreground">
            {scrollHint}
          </span>
          <ChevronDown className="scroll-indicator w-6 h-6" />
        </motion.div>

        {/* Scrolling text slides */}
        <div className="absolute inset-0 flex items-center justify-center px-6">
          {textSlides.map((text, index) => (
            <motion.div
              key={index}
              className="absolute max-w-3xl text-center"
              style={{
                opacity: slideTransforms[index].opacity,
                y: slideTransforms[index].y
              }}
            >
              <p className="text-xl md:text-2xl lg:text-3xl font-light leading-relaxed text-foreground/90">
                {text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default HeroBlock22;
