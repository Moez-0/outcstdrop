import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeroSectionProps {
  onPreOrderClick: () => void;
}

const HeroSection = ({ onPreOrderClick }: HeroSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Video Background */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%230a0a0a' width='1920' height='1080'/%3E%3C/svg%3E"
        >
          <source
            src="/vid.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        <div className="absolute inset-0 bg-background/30" />
      </motion.div>

      {/* Hero Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="font-mono text-xs tracking-[0.5em] text-muted-foreground mb-4">
            DROP_001
          </p>
          
          <h1 className="font-display text-[15vw] md:text-[12vw] leading-[0.85] tracking-tight text-foreground mb-6">
            OUTCST
          </h1>

          <p className="font-mono text-xs tracking-[0.4em] text-primary mb-12 animate-pulse-glow">
            LIMITED RUN
          </p>

          <motion.button
            onClick={onPreOrderClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="button-primary px-12 py-4 text-lg tracking-[0.2em]"
          >
            PRE-ORDER
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            SCROLL
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-12 bg-gradient-to-b from-primary/50 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
