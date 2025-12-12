import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import GrainOverlay from "@/components/GrainOverlay";

interface PreOrder {
  id: string;
  name: string;
  email: string;
  size: string;
  created_at: string;
  phone?: string | null;
  address?: string | null;
  status?: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [preOrders, setPreOrders] = useState<PreOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Simple client-side gate using localStorage flag set by the dashboard login page
  useEffect(() => {
    const isAuthed = localStorage.getItem("dashboard_authed") === "true";
    if (!isAuthed) {
      navigate("/dashboard/login", { replace: true });
    }
  }, [navigate]);

  const fetchPreOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("pre_orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPreOrders((data || []) as PreOrder[]);
    } catch (error) {
      console.error("Error fetching pre-orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPreOrders();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sizeCounts = preOrders.reduce((acc, order) => {
    acc[order.size] = (acc[order.size] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const updatePayload = { status } as const;

      const { error } = await supabase
        .from("pre_orders")
        // Cast to never to bypass current generated Supabase types until the schema is updated
        .update(updatePayload as never)
        .eq("id", id);

      if (error) throw error;

      setPreOrders((current) =>
        current.map((order) =>
          order.id === id
            ? {
                ...order,
                status,
              }
            : order,
        ),
      );
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("dashboard_authed");
    navigate("/dashboard/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-background">
      <GrainOverlay />

      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 md:px-12 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-display text-2xl tracking-wider">
                  DASHBOARD
                </h1>
                <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
                  DROP_001 PRE-ORDERS
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchPreOrders}
                disabled={isLoading}
                className="button-mechanical p-3"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-none border border-border px-3 py-2 font-mono text-[10px] tracking-[0.25em] text-muted-foreground hover:bg-border/20 hover:text-foreground transition-colors"
              >
                <LogOut className="h-3 w-3" />
                LOG OUT
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 md:px-12 py-12">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-12"
        >
          <div className="bg-card border border-border p-6">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground mb-2">
              TOTAL
            </p>
            <p className="font-display text-4xl">{preOrders.length}</p>
          </div>
          {["XS", "S", "M", "L", "XL"].map((size) => (
            <div key={size} className="bg-card border border-border p-6">
              <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground mb-2">
                {size}
              </p>
              <p className="font-display text-4xl">{sizeCounts[size] || 0}</p>
            </div>
          ))}
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="border border-border overflow-x-auto"
        >
          {/* Table Header */}
          <div className="grid min-w-[900px] grid-cols-7 gap-4 p-4 border-b border-border bg-card">
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              NAME
            </p>
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              EMAIL
            </p>
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              SIZE
            </p>
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              PHONE
            </p>
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              ADDRESS
            </p>
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              STATUS
            </p>
            <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
              DATE
            </p>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="p-12 text-center">
              <p className="font-mono text-sm text-muted-foreground">
                LOADING...
              </p>
            </div>
          ) : preOrders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="font-mono text-sm text-muted-foreground">
                NO PRE-ORDERS YET
              </p>
            </div>
          ) : (
            preOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="grid min-w-[900px] grid-cols-7 gap-4 p-4 border-b border-border last:border-b-0 hover:bg-card/50 transition-colors"
              >
                <p className="font-mono text-sm text-foreground truncate">
                  {order.name}
                </p>
                <p className="font-mono text-sm text-muted-foreground truncate">
                  {order.email}
                </p>
                <p className="font-display text-lg">{order.size}</p>
                <p className="font-mono text-sm text-muted-foreground truncate">
                  {order.phone || "-"}
                </p>
                <p className="font-mono text-xs text-muted-foreground truncate">
                  {order.address || "-"}
                </p>
                <div className="flex flex-col gap-2">
                  <span className="inline-flex w-fit rounded-full border border-border px-2 py-1 font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
                    {order.status || "PENDING"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateStatus(order.id, "CONTACTED")}
                      disabled={updatingId === order.id}
                      className="border border-border px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-muted-foreground hover:bg-border/30 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      CONTACTED
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, "CONFIRMED")}
                      disabled={updatingId === order.id}
                      className="border border-border px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-muted-foreground hover:bg-border/30 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      CONFIRMED
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, "CANCELLED")}
                      disabled={updatingId === order.id}
                      className="border border-destructive/60 px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-destructive hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      CANCELLED
                    </button>
                  </div>
                </div>
                <p className="font-mono text-xs text-muted-foreground">
                  {formatDate(order.created_at)}
                </p>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default Dashboard;
