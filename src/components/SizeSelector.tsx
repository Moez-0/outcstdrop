import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SizeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeSelector = ({ isOpen, onClose }: SizeSelectorProps) => {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sizes = ["XS", "S", "M", "L", "XL"];

  const handleSubmit = async () => {
    if (!selectedSize || !name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      toast({
        title: "MISSING DETAILS",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "INVALID EMAIL",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        // "name" is treated as full name in the dashboard
        name: name.trim(),
        email: email.trim(),
        size: selectedSize,
        phone: phone.trim(),
        address: address.trim(),
        status: "PENDING" as const,
      };

      const { error } = await supabase
        .from("pre_orders")
        // Cast to never to bypass current generated Supabase types until the schema is updated
        .insert(payload as never);

      if (error) throw error;

      onClose();
      setSelectedSize(null);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      navigate("/success");
    } catch (error) {
      console.error("Error submitting pre-order:", error);
      toast({
        title: "SYSTEM ERROR",
        description: "Failed to submit pre-order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedSize(null);
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
  };

  const isFormComplete =
    !!selectedSize && !!name.trim() && !!email.trim() && !!phone.trim() && !!address.trim();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-auto md:w-full md:max-w-md"
          >
            <div className="bg-card border border-border p-8 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground">
                  PRE-ORDER DETAILS
                </p>
                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Full name input */}
              <div className="mb-6">
                <label className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground block mb-2">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-transparent border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Email input */}
              <div className="mb-6">
                <label className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground block mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Phone input */}
              <div className="mb-6">
                <label className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground block mb-2">
                  PHONE
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full bg-transparent border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Address input */}
              <div className="mb-6">
                <label className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground block mb-2">
                  ADDRESS
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your shipping address"
                  className="w-full bg-transparent border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors min-h-[80px] resize-none"
                />
              </div>

              {/* Size selection */}
              <div className="mb-8">
                <label className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground block mb-3">
                  SELECT SIZE
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {sizes.map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        py-4 font-mono text-sm tracking-wider border transition-all duration-200
                        ${
                          selectedSize === size
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-transparent text-foreground border-border hover:border-foreground"
                        }
                      `}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Submit button */}
              <motion.button
                onClick={handleSubmit}
                disabled={!isFormComplete || isSubmitting}
                whileHover={isFormComplete ? { scale: 1.01 } : {}}
                whileTap={isFormComplete ? { scale: 0.99 } : {}}
                className={`
                  w-full py-4 font-display text-lg tracking-[0.15em] transition-all duration-300
                  ${
                    isFormComplete
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }
                `}
              >
                {isSubmitting ? "PROCESSING..." : "SUBMIT TO SYSTEM"}
              </motion.button>

              {/* Notice */}
              <p className="font-mono text-[10px] tracking-wider text-muted-foreground text-center mt-6">
                PRE-ORDER ONLY / NO PAYMENT REQUIRED
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SizeSelector;
