import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/Navbar";
import GrainOverlay from "@/components/GrainOverlay";
import Footer from "@/components/Footer";

const Info = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const statements = [
    { text: "OUTCST", subtitle: "IS A DJ COLLECTIVE" },
    { text: "THIS IS", subtitle: "A LIMITED DROP" },
    { text: "NO", subtitle: "RESTOCK" },
    { text: "WORN", subtitle: "AT NIGHT" },
  ];

  return (
    <main ref={containerRef} className="min-h-screen bg-background">
      <GrainOverlay />
      <Navbar />

      {/* Hero spacer */}
      <div className="h-32" />

      {/* Statements */}
      <section className="py-24">
        {statements.map((statement, index) => (
          <StatementBlock
            key={index}
            text={statement.text}
            subtitle={statement.subtitle}
            index={index}
          />
        ))}
      </section>

      {/* Contact section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground mb-6">
              CONTACT
            </p>
            <a
              href="mailto:info@outcst.io"
              className="font-display text-3xl md:text-5xl tracking-wide text-foreground hover:text-primary transition-colors duration-300 glitch-hover"
            >
              INFO@OUTCST.IO
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

interface StatementBlockProps {
  text: string;
  subtitle: string;
  index: number;
}

const StatementBlock = ({ text, subtitle, index }: StatementBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="h-[60vh] flex items-center justify-center px-6">
      <motion.div style={{ y, opacity }} className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="font-display text-[18vw] md:text-[12vw] leading-none tracking-tight text-foreground"
        >
          {text}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="font-mono text-sm md:text-base tracking-[0.4em] text-primary mt-4"
        >
          {subtitle}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Info;
