import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogIn, Zap } from "lucide-react";
import { toast } from "sonner";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);

    // Simulate a short delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Generate a mock token
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

    // Save to localStorage
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);

    const hasDoneSetup = localStorage.getItem("has_done_setup") === "true";

    toast.success("Welcome back!");
    setLoading(false);

    if (hasDoneSetup) {
      navigate("/");
    } else {
      navigate("/onboarding");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        <motion.div variants={item} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Zap className="h-7 w-7 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            No-Human
          </h1>
          <p className="text-sm text-muted-foreground">
            Autonomous AI Marketing Platform
          </p>
        </motion.div>

        <motion.div variants={item} className="glass-card p-8">
          <h2 className="text-xl font-display font-semibold text-foreground mb-6">
            Sign In
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50">
            <p className="text-xs text-center text-muted-foreground">
              Don't have an account?{" "}
              <button
                className="text-primary hover:underline"
                onClick={() => {
                  toast.info("Contact sales@no-human.ai to get started.");
                }}
              >
                Contact Sales
              </button>
            </p>
          </div>
        </motion.div>

        <motion.p variants={item} className="text-xs text-center text-muted-foreground mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}