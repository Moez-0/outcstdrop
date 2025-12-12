import { useRef } from "react";
import { motion, useMotionValue, useScroll, useTransform } from "framer-motion";

const TShirtViewer = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1.05]);
  const tiltX = useTransform(mouseY, [-1, 1], [15, -15]);
  const tiltY = useTransform(mouseX, [-1, 1], [-20, 20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="relative h-[70vh] w-full flex items-center justify-center">
      <motion.div
        ref={containerRef}
        style={{ scale }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full max-w-xl px-6 cursor-pointer"
      >
        {/* Glow background */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        </div>

        {/* 2.5D card with shirt image */}
        <motion.div
          style={{
            rotateX: tiltX,
            rotateY: tiltY,
          }}
          className="relative mx-auto aspect-[3/4] w-full max-w-md rounded-[32px] border border-border/80 bg-gradient-to-br from-background/80 via-background/60 to-background/40 shadow-[0_40px_120px_rgba(0,0,0,0.7)] will-change-transform [transform-style:preserve-3d]"
        >
          {/* Shirt image */}
          <div
            className="absolute inset-[8%] rounded-[24px] bg-cover bg-center bg-no-repeat [transform:translateZ(40px)]"
            style={{ backgroundImage: "url(/shirt.jpeg)" }}
          />

          {/* Specular highlight */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl [transform:translateZ(60px)]" />
          <div className="pointer-events-none absolute -right-8 bottom-4 h-32 w-32 rounded-full bg-secondary/10 blur-3xl [transform:translateZ(30px)]" />

          {/* Frame accents */}
          <div className="pointer-events-none absolute inset-4 rounded-[26px] border border-white/5 [transform:translateZ(20px)]" />
        </motion.div>

        {/* Instruction text */}
        <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
            Move cursor to tilt
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TShirtViewer;
