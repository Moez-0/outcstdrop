import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GrainOverlay from "@/components/GrainOverlay";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <GrainOverlay />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-6"
      >
        <h1 className="font-display text-[30vw] md:text-[20vw] leading-none text-foreground mb-4">
          404
        </h1>
        <p className="font-mono text-xs tracking-[0.4em] text-muted-foreground mb-12">
          SIGNAL LOST
        </p>
        <Link
          to="/"
          className="button-mechanical inline-block px-8 py-3 font-mono text-xs tracking-[0.2em]"
        >
          RETURN TO SYSTEM
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
