import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="font-display text-xl tracking-wider">OUTCST</p>
          
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            © 2024 / ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
