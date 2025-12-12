import { motion } from "framer-motion";

interface ProductDetailsProps {
  onSelectSize: () => void;
}

const ProductDetails = ({ onSelectSize }: ProductDetailsProps) => {
  const specs = [
    { label: "PRINT", value: "SCREEN" },
    { label: "MADE FOR", value: "LATE NIGHTS" },
  ];

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 lg:px-12">
      <div className="container mx-auto max-w-4xl">
        {/* Product specs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16"
        >
          {specs.map((spec, index) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground mb-2">
                {spec.label}
              </p>
              <p className="font-display text-2xl tracking-wide text-foreground">
                {spec.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-border mb-12 md:mb-16" />

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl tracking-tight mb-4">
            DROP_001
          </h2>
          <p className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-muted-foreground mb-8 md:mb-12 max-w-md px-4">
            LIMITED QUANTITY / NO RESTOCK / PRE-ORDER ONLY
          </p>

          <motion.button
            onClick={onSelectSize}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="button-mechanical px-8 md:px-12 py-3 md:py-4 font-mono text-xs md:text-sm tracking-[0.2em] min-h-[44px]"
          >
            SELECT SIZE
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductDetails;
