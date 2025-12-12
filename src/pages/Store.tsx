import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import GrainOverlay from "@/components/GrainOverlay";
import HeroSection from "@/components/HeroSection";
import TShirtViewer from "@/components/TShirtViewer";
import ProductDetails from "@/components/ProductDetails";
import SizeSelector from "@/components/SizeSelector";
import Footer from "@/components/Footer";

const Store = () => {
  const [isSizeSelectorOpen, setIsSizeSelectorOpen] = useState(false);

  const scrollToProduct = () => {
    const productSection = document.getElementById("product");
    if (productSection) {
      productSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <GrainOverlay />
      <Navbar />

      <HeroSection onPreOrderClick={scrollToProduct} />

      <section id="product" className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <TShirtViewer />
        </motion.div>

        <ProductDetails onSelectSize={() => setIsSizeSelectorOpen(true)} />
      </section>

      <Footer />

      <SizeSelector
        isOpen={isSizeSelectorOpen}
        onClose={() => setIsSizeSelectorOpen(false)}
      />
    </main>
  );
};

export default Store;
