import { motion } from "framer-motion";
import { Link2 } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export type ConnectionStatus = "connected" | "disconnected";

export interface PlatformConnection {
  id: string;
  name: string;
  icon: string;
  category: "ad" | "conversion" | "crm";
  status: ConnectionStatus;
}

interface StepAccountsProps {
  platforms: PlatformConnection[];
  onToggle: (id: string) => void;
}

function PlatformCard({
  platform,
  onToggle,
}: {
  platform: PlatformConnection;
  onToggle: () => void;
}) {
  const connected = platform.status === "connected";
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
        connected
          ? "border-success/30 bg-success/5"
          : "border-border bg-secondary/20 hover:border-primary/30 hover:bg-secondary/40"
      }`}
    >
      <span className="text-2xl">{platform.icon}</span>
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm font-medium text-foreground">{platform.name}</p>
      </div>
      <span
        className={`text-[10px] px-2.5 py-1 rounded-full font-semibold ${
          connected
            ? "bg-success/10 text-success"
            : "bg-primary/10 text-primary"
        }`}
      >
        {connected ? "✓ Connected" : "Connect"}
      </span>
    </button>
  );
}

export function StepAccounts({ platforms, onToggle }: StepAccountsProps) {
  const adPlatforms = platforms.filter((p) => p.category === "ad");
  const conversionPlatforms = platforms.filter((p) => p.category === "conversion");
  const crmPlatforms = platforms.filter((p) => p.category === "crm");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h2 className="text-xl font-display font-bold text-foreground">
          Connect your accounts
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your AI agents need access to your ad platforms and data sources to take action on your behalf.
        </p>
      </motion.div>

      {/* Ad Platforms */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center gap-2">
          <Link2 className="h-3.5 w-3.5 text-primary" />
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Ad Platforms
          </p>
          <InfoTooltip text="Connect at least one ad platform so agents can create, manage, and optimize your campaigns." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {adPlatforms.map((p) => (
            <PlatformCard key={p.id} platform={p} onToggle={() => onToggle(p.id)} />
          ))}
        </div>
      </motion.div>

      {/* Conversion Data */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Conversion Tracking
          </p>
          <InfoTooltip text="Connect at least one conversion source so agents can see real revenue, not just clicks. This powers the Analyst Agent." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {conversionPlatforms.map((p) => (
            <PlatformCard key={p.id} platform={p} onToggle={() => onToggle(p.id)} />
          ))}
        </div>
      </motion.div>

      {/* CRM */}
      <motion.div variants={item} className="space-y-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            CRM Access
          </p>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
            Optional
          </span>
          <InfoTooltip text="Connect your CRM so agents know which leads actually turned into paying customers, enabling smarter optimization." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {crmPlatforms.map((p) => (
            <PlatformCard key={p.id} platform={p} onToggle={() => onToggle(p.id)} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}