import { motion } from "framer-motion";
import { InfoTooltip } from "@/components/InfoTooltip";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const inputClass =
  "w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

interface StepBudgetProps {
  northStar: "growth" | "profit";
  setNorthStar: (v: "growth" | "profit") => void;
  targetCpa: number;
  setTargetCpa: (v: number) => void;
  dailyBudget: number;
  setDailyBudget: (v: number) => void;
  monthlyBudget: number;
  setMonthlyBudget: (v: number) => void;
  scalingLimit: number;
  setScalingLimit: (v: number) => void;
}

export function StepBudget({
  northStar,
  setNorthStar,
  targetCpa,
  setTargetCpa,
  dailyBudget,
  setDailyBudget,
  monthlyBudget,
  setMonthlyBudget,
  scalingLimit,
  setScalingLimit,
}: StepBudgetProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h2 className="text-xl font-display font-bold text-foreground">
          Set your budget & bidding
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Define how much your AI agents can spend. They will never exceed these limits.
        </p>
      </motion.div>

      {/* Bidding Strategy */}
      <motion.div variants={item} className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Bidding Strategy
          </p>
          <InfoTooltip text="Choose Growth to maximize revenue and scale aggressively, or Profit to optimize for margins and return on spend." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setNorthStar("growth")}
            className={`p-4 rounded-xl border text-left transition-all ${
              northStar === "growth"
                ? "border-primary bg-primary/5"
                : "border-border bg-secondary/20 hover:border-primary/30"
            }`}
          >
            <p className="text-sm font-semibold text-foreground">🚀 Maximize Growth</p>
            <p className="text-xs text-muted-foreground mt-1">
              Agents will scale budgets aggressively when performance is strong to maximize revenue.
            </p>
          </button>
          <button
            onClick={() => setNorthStar("profit")}
            className={`p-4 rounded-xl border text-left transition-all ${
              northStar === "profit"
                ? "border-primary bg-primary/5"
                : "border-border bg-secondary/20 hover:border-primary/30"
            }`}
          >
            <p className="text-sm font-semibold text-foreground">💎 Maximize Profit</p>
            <p className="text-xs text-muted-foreground mt-1">
              Agents will optimize for margins and ROAS, pausing underperforming campaigns quickly.
            </p>
          </button>
        </div>
      </motion.div>

      {/* Budget Inputs */}
      <motion.div variants={item} className="glass-card p-5 space-y-5">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Budget
          </p>
          <InfoTooltip text="Set your daily and monthly spending limits. Agents will distribute budget across platforms and campaigns automatically." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              Average Daily Budget
              <InfoTooltip text="The average amount you want to spend per day across all platforms. Actual daily spend may vary but will average to this amount." />
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <input
                className={inputClass + " pl-7"}
                type="number"
                min={1}
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              ≈ ${(dailyBudget * 30.4).toLocaleString(undefined, { maximumFractionDigits: 0 })}/month estimated
            </p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              Hard Monthly Cap
              <InfoTooltip text="The absolute maximum agents can spend in a calendar month. They will never exceed this amount, even if performance is strong." />
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <input
                className={inputClass + " pl-7"}
                type="number"
                min={0}
                step={100}
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Target CPA & Scaling */}
      <motion.div variants={item} className="glass-card p-5 space-y-5">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Performance Targets
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              Target CPA (Cost Per Acquisition)
              <InfoTooltip text="The maximum you're willing to pay for one customer or lead. Agents will optimize bids and budgets to hit this target." />
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
              <input
                className={inputClass + " pl-7"}
                type="number"
                min={1}
                value={targetCpa}
                onChange={(e) => setTargetCpa(Number(e.target.value))}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Campaigns exceeding this CPA will be paused automatically.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              Auto-Scaling Limit
              <InfoTooltip text="The maximum percentage agents can scale your daily budget when performance is strong. E.g. 200% means agents can spend up to double your daily budget on a great day." />
            </label>
            <input
              type="range"
              min={100}
              max={300}
              step={10}
              value={scalingLimit}
              onChange={(e) => setScalingLimit(Number(e.target.value))}
              className="w-full mt-1"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1.5">
              <span>No scaling (100%)</span>
              <span className="text-primary font-semibold">
                {scalingLimit}% — ${Math.round((dailyBudget * scalingLimit) / 100)}/day max
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}