import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sizes = ["XS", "S", "M", "L", "XL"];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Invalid email address";
      }
    }
    if (!phone.trim()) newErrors.phone = "Phone is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!selectedSize) newErrors.size = "Please select a size";
    if (quantity < 1 || quantity > 10) newErrors.quantity = "Quantity must be between 1 and 10";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        size: selectedSize,
        phone: phone.trim(),
        address: address.trim(),
        quantity,
        status: "PENDING" as const,
      };

      const { error } = await supabase
        .from("pre_orders")
        .insert(payload as never);

      if (error) throw error;

      onClose();
      setSelectedSize(null);
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setQuantity(1);
      setErrors({});
      navigate("/success");
    } catch (error) {
      console.error("Error submitting pre-order:", error);
      setErrors({ submit: "Failed to submit pre-order. Please try again." });
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
    setQuantity(1);
    setErrors({});
  };

  const isFormComplete =
    !!selectedSize && !!name.trim() && !!email.trim() && !!phone.trim() && !!address.trim() && quantity >= 1 && quantity <= 10;

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
            className="mb-4 md:mb-96 fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 w-auto md:w-full md:max-w-md"
          >
            <div className="bg-card border border-border p-6 md:p-8 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 md:mb-8">
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

              {/* Global error */}
              {errors.submit && (
                <div className="mb-6 p-3 border border-destructive/50 bg-destructive/10">
                  <p className="font-mono text-xs text-destructive">{errors.submit}</p>
                </div>
              )}

              {/* Full name input */}
              <div className="mb-4 md:mb-6">
                <label className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground block mb-2">
                  FULL NAME
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  placeholder="Enter your full name"
                  className={`w-full bg-transparent border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                    errors.name ? "border-destructive" : "border-border focus:border-primary"
                  }`}
                />
                {errors.name && (
                  <p className="font-mono text-[10px] text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email input */}
              <div className="mb-4 md:mb-6">
                <label className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground block mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  placeholder="Enter your email"
                  className={`w-full bg-transparent border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                    errors.email ? "border-destructive" : "border-border focus:border-primary"
                  }`}
                />
                {errors.email && (
                  <p className="font-mono text-[10px] text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone input */}
              <div className="mb-4 md:mb-6">
                <label className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground block mb-2">
                  PHONE
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  placeholder="Enter your phone number"
                  className={`w-full bg-transparent border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors ${
                    errors.phone ? "border-destructive" : "border-border focus:border-primary"
                  }`}
                />
                {errors.phone && (
                  <p className="font-mono text-[10px] text-destructive mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Address input */}
              <div className="mb-4 md:mb-6">
                <label className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground block mb-2">
                  ADDRESS
                </label>
                <textarea
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors({ ...errors, address: "" });
                  }}
                  placeholder="Enter your shipping address"
                  className={`w-full bg-transparent border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors min-h-[80px] resize-none ${
                    errors.address ? "border-destructive" : "border-border focus:border-primary"
                  }`}
                />
                {errors.address && (
                  <p className="font-mono text-[10px] text-destructive mt-1">{errors.address}</p>
                )}
              </div>

              {/* Quantity input */}
              <div className="mb-4 md:mb-6">
                <label className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground block mb-2">
                  QUANTITY
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.max(1, Math.min(10, val)));
                    if (errors.quantity) setErrors({ ...errors, quantity: "" });
                  }}
                  className={`w-full bg-transparent border px-4 py-3 font-mono text-sm text-foreground focus:outline-none transition-colors ${
                    errors.quantity ? "border-destructive" : "border-border focus:border-primary"
                  }`}
                />
                {errors.quantity && (
                  <p className="font-mono text-[10px] text-destructive mt-1">{errors.quantity}</p>
                )}
                <p className="font-mono text-[9px] text-muted-foreground mt-1">Max 10 per order</p>
              </div>

              {/* Size selection */}
              <div className="mb-6 md:mb-8">
                <label className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground block mb-3">
                  SELECT SIZE
                </label>
                <div className="grid grid-cols-5 gap-2 md:gap-3">
                  {sizes.map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        if (errors.size) setErrors({ ...errors, size: "" });
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        py-3 md:py-4 font-mono text-sm tracking-wider border transition-all duration-200
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
                {errors.size && (
                  <p className="font-mono text-[10px] text-destructive mt-2">{errors.size}</p>
                )}
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
