import { motion } from "framer-motion";
import { Eye, Paintbrush, DollarSign, MessageSquare, ArrowRight, Zap, CheckCircle, Pause, Loader2 } from "lucide-react";
import { mockAgentStatuses } from "@/lib/mock-data";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
const item = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } };

const agents = [
  { id: "analyst", title: "Analyst Agent", subtitle: "The Brain", icon: Eye, description: "Monitors ROAS, detects fatigue signals, identifies anomalies. Sends triggers to Creative Director and Media Buyer.", actions: ["Monitor KPIs", "Detect fatigue", "Spot anomalies", "Send triggers"], color: "from-blue-500/20 to-blue-600/5" },
  { id: "creative", title: "Creative Director", subtitle: "The Maker", icon: Paintbrush, description: "Receives triggers from Analyst. Generates new ad headlines, descriptions, and creative concepts using your brand DNA.", actions: ["Generate creatives", "A/B variants", "Brand compliance", "Deploy assets"], color: "from-purple-500/20 to-purple-600/5" },
  { id: "mediaBuyer", title: "Media Buyer", subtitle: "The Executor", icon: DollarSign, description: "Scales winners by 10% every 4 hours, kills losers, moves budget between campaigns. Never exceeds your caps.", actions: ["Scale winners", "Kill losers", "Adjust bids", "Reallocate budget"], color: "from-emerald-500/20 to-emerald-600/5" },
  { id: "accountManager", title: "Account Manager", subtitle: "The Communicator", icon: MessageSquare, description: "Compiles all agent actions into a narrative report with a 60-second video brief script. The only agent you meet.", actions: ["Generate reports", "Video briefs", "Slack updates", "Client comms"], color: "from-amber-500/20 to-amber-600/5" },
];

const agentStatusConfig = {
  active: { color: "text-success", icon: CheckCircle, label: "Active" },
  generating: { color: "text-warning", icon: Loader2, label: "Working" },
  idle: { color: "text-muted-foreground", icon: Pause, label: "Idle" },
};

export default function LoopPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 max-w-5xl mx-auto">
      <motion.div variants={item}>
        <h1 className="text-2xl font-display font-bold text-foreground">The Agent Loop</h1>
        <p className="text-sm text-muted-foreground mt-1">Four Claude-powered AI agents working in a continuous optimization cycle — running automatically</p>
      </motion.div>

      {/* Status bar */}
      <motion.div variants={item} className="glass-card p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary font-medium">1. Analyst</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary font-medium">2. Creative Director</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary font-medium">3. Media Buyer</span>
            <span className="text-muted-foreground">→</span>
            <span className="px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary font-medium">4. Account Manager</span>
          </div>
          <span className="text-[10px] text-muted-foreground ml-auto hidden sm:inline">Agents run automatically on a continuous cycle</span>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-card p-8">
        <div className="flex flex-col items-center space-y-1">
          {agents.map((agent, i) => {
            const statusKey = agent.id as keyof typeof mockAgentStatuses;
            const status = mockAgentStatuses[statusKey];
            const s = agentStatusConfig[status.status];

            return (
              <div key={agent.id} className="w-full">
                <motion.div
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-4 p-5 rounded-xl border border-border/50 bg-secondary/20 hover:border-primary/30 hover:bg-secondary/40 transition-all duration-300 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 shrink-0 transition-colors">
                    <agent.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-semibold text-foreground">{agent.title}</h3>
                      <span className="text-[11px] text-muted-foreground hidden sm:inline">— {agent.subtitle}</span>
                      <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        status.status === "active" ? "bg-success/10 text-success" :
                        status.status === "generating" ? "bg-warning/10 text-warning" :
                        "bg-secondary text-muted-foreground"
                      }`}>
                        <s.icon className={`h-3 w-3 ${s.color} ${status.status === "generating" ? "animate-spin" : ""}`} />
                        {s.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{agent.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {agent.actions.map((a) => (
                        <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary/80 border border-primary/10">{a}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 mt-1.5">Last: {status.lastAction} • Uptime: {status.uptime}</p>
                  </div>
                </motion.div>

                {i < agents.length - 1 && (
                  <div className="flex justify-center py-2">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + i * 0.15 }} className="flex flex-col items-center">
                      <div className="h-6 w-px bg-gradient-to-b from-primary/40 to-primary/10" />
                      <ArrowRight className="h-4 w-4 rotate-90 text-primary/50" />
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex flex-col items-center pt-2">
            <div className="h-6 w-px bg-gradient-to-b from-primary/40 to-accent/40" />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <span className="text-xs font-medium text-gradient">↻ Loop repeats continuously</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}