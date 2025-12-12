import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const TShirtViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.05]);

  return (
    <div className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center">
      <motion.div
        ref={containerRef}
        style={{ scale }}
        className="relative w-full max-w-xl px-4 md:px-6"
      >
        {/* Glow background */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        </div>

        {/* Card with shirt image */}
        <div className="relative mx-auto aspect-[3/4] w-full max-w-md rounded-[32px] border border-border/80 bg-gradient-to-br from-background/80 via-background/60 to-background/40 shadow-[0_40px_120px_rgba(0,0,0,0.7)]">
          {/* Shirt image */}
          <div
            className="absolute inset-[8%] rounded-[24px] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/shirt.jpeg)" }}
          />

          {/* Frame accents */}
          <div className="pointer-events-none absolute inset-4 rounded-[26px] border border-white/5" />
        </div>
      </motion.div>
    </div>
  );
};

export default TShirtViewer;
