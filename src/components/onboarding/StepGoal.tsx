import { motion } from "framer-motion";
import { TrendingUp, Target, Users, ShoppingCart, Phone, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

interface Goal {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  recommended?: boolean;
}

const goals: Goal[] = [
  {
    id: "sales",
    title: "Sales",
    description: "Drive online sales, in-app purchases, or phone orders",
    icon: ShoppingCart,
    recommended: true,
  },
  {
    id: "leads",
    title: "Leads",
    description: "Get leads and other conversions by encouraging customers to take action",
    icon: Phone,
  },
  {
    id: "traffic",
    title: "Website Traffic",
    description: "Get the right people to visit your website",
    icon: TrendingUp,
  },
  {
    id: "awareness",
    title: "Brand Awareness",
    description: "Reach a broad audience and build awareness for your brand",
    icon: Eye,
  },
  {
    id: "engagement",
    title: "Engagement",
    description: "Get more messages, video views, or page engagement",
    icon: Users,
  },
  {
    id: "custom",
    title: "Custom Goal",
    description: "Set a custom CPA or ROAS target and let agents optimize freely",
    icon: Target,
  },
];

interface StepGoalProps {
  selectedGoal: string;
  onSelectGoal: (goal: string) => void;
}

export function StepGoal({ selectedGoal, onSelectGoal }: StepGoalProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h2 className="text-xl font-display font-bold text-foreground">
          What's your advertising goal?
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select a goal so your AI agents know what to optimize for. You can change this later.
        </p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => onSelectGoal(goal.id)}
            className={cn(
              "relative flex flex-col items-start gap-3 p-5 rounded-xl border text-left transition-all duration-200",
              selectedGoal === goal.id
                ? "border-primary bg-primary/5 shadow-[0_0_20px_-5px_hsl(var(--glow-primary))]"
                : "border-border bg-secondary/20 hover:border-primary/30 hover:bg-secondary/40"
            )}
          >
            {goal.recommended && (
              <span className="absolute top-3 right-3 text-[9px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold uppercase tracking-wider">
                Recommended
              </span>
            )}
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                selectedGoal === goal.id ? "bg-primary/20" : "bg-primary/10"
              )}
            >
              <goal.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{goal.title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {goal.description}
              </p>
            </div>
            {selectedGoal === goal.id && (
              <motion.div
                layoutId="goal-check"
                className="absolute bottom-3 right-3 h-5 w-5 rounded-full bg-primary flex items-center justify-center"
              >
                <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}