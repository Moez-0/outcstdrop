import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import GrainOverlay from "@/components/GrainOverlay";

const DashboardLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const expectedUser = import.meta.env.VITE_DASHBOARD_USER;
    const expectedPass = import.meta.env.VITE_DASHBOARD_PASSWORD;

    if (!expectedUser || !expectedPass) {
      setError(
        "Dashboard credentials are not configured. Set VITE_DASHBOARD_USER and VITE_DASHBOARD_PASSWORD in your environment.",
      );
      return;
    }

    if (username === expectedUser && password === expectedPass) {
      localStorage.setItem("dashboard_authed", "true");
      navigate("/dashboard", { replace: true });
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6">
      <GrainOverlay />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md border border-border bg-card/80 p-8"
      >
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground mb-2">
              ACCESS CONTROL
            </p>
            <h1 className="font-display text-2xl tracking-wider">DASHBOARD LOGIN</h1>
          </div>
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground block mb-2">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="Enter dashboard username"
            />
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground block mb-2">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-border px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="Enter dashboard password"
            />
          </div>

          {error && (
            <p className="font-mono text-[10px] tracking-[0.2em] text-destructive">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3 font-display text-lg tracking-[0.2em] bg-primary text-primary-foreground transition-colors"
          >
            ENTER DASHBOARD
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
};

export default DashboardLogin;
