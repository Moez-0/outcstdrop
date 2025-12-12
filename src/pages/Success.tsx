import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import GrainOverlay from "@/components/GrainOverlay";

const Success = () => {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <GrainOverlay />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-lg"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-8 border border-primary flex items-center justify-center"
        >
          <Check className="w-10 h-10 text-primary" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="font-mono text-xs tracking-[0.4em] text-muted-foreground mb-4"
        >
          SUBMISSION RECEIVED
        </motion.p>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-display text-5xl md:text-7xl tracking-tight text-foreground mb-6"
        >
          YOU'RE IN
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-mono text-sm tracking-wider text-muted-foreground mb-12 leading-relaxed"
        >
          YOUR PRE-ORDER HAS BEEN LOGGED INTO THE SYSTEM.<br />
          YOU WILL BE CONTACTED WHEN DROP_001 IS READY.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link
            to="/"
            className="button-mechanical inline-block px-10 py-4 font-mono text-xs tracking-[0.2em]"
          >
            RETURN TO SYSTEM
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default Success;
