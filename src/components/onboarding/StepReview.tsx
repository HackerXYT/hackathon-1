import { motion } from "framer-motion";
import { Check, AlertCircle, Paperclip } from "lucide-react";
import type { PlatformConnection } from "@/components/onboarding/StepAccounts";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

interface StepReviewProps {
  companyName: string;
  website: string;
  industry: string;
  companyDescription: string;
  targetMarket: string;
  uniqueSellingProposition: string;
  selectedGoal: string;
  platforms: PlatformConnection[];
  northStar: string;
  targetCpa: number;
  dailyBudget: number;
  monthlyBudget: number;
  scalingLimit: number;
  personaAge: string;
  personaLocation: string;
  personaInterests: string;
  negativeConstraints: string[];
  competitors: string[];
  valueProps: string[];
  vibe: number;
  deliveryChannel: string;
  reportFrequency: string;
  escalationTrigger: string;
  logoFiles: File[];
  fontFiles: File[];
  styleGuideFiles: File[];
  seedFile: File | null;
}

const goalLabels: Record<string, string> = {
  sales: "Sales",
  leads: "Leads",
  traffic: "Website Traffic",
  awareness: "Brand Awareness",
  engagement: "Engagement",
  custom: "Custom Goal",
};

const channelLabels: Record<string, string> = {
  email: "📧 Email",
  slack: "💬 Slack",
  whatsapp: "📱 WhatsApp",
};

const frequencyLabels: Record<string, string> = {
  daily: "Daily Pulse",
  weekly: "Weekly Deep Dive",
  both: "Daily + Weekly",
};

const escalationLabels: Record<string, string> = {
  account_disabled: "Ad account disabled",
  cpa_spike: "CPA spike above threshold",
  both: "Account disabled + CPA spike",
  any_anomaly: "Any anomaly detected",
};

function ReviewSection({
  title,
  children,
  warning,
}: {
  title: string;
  children: React.ReactNode;
  warning?: string;
}) {
  return (
    <motion.div variants={item} className="glass-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</p>
        {warning && (
          <span className="flex items-center gap-1 text-[10px] text-warning font-medium">
            <AlertCircle className="h-3 w-3" />
            {warning}
          </span>
        )}
      </div>
      {children}
    </motion.div>
  );
}

function ReviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-xs font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

function FilesSummary({ label, files }: { label: string; files: File[] }) {
  if (files.length === 0) return <ReviewRow label={label} value="None uploaded" />;
  return (
    <div className="py-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {files.map((f, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-success/10 text-success border border-success/20 font-medium"
          >
            <Paperclip className="h-2.5 w-2.5" />
            {f.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function StepReview(props: StepReviewProps) {
  const connectedPlatforms = props.platforms.filter((p) => p.status === "connected");
  const adConnected = props.platforms.filter((p) => p.category === "ad" && p.status === "connected");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h2 className="text-xl font-display font-bold text-foreground">
          Review & launch
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review your configuration before launching your AI agents. You can change any of these settings later.
        </p>
      </motion.div>

      {/* Company */}
      <ReviewSection title="Company Profile">
        <ReviewRow label="Name" value={props.companyName || "Not set"} />
        <ReviewRow label="Website" value={props.website || "Not set"} />
        <ReviewRow label="Industry" value={props.industry || "Not set"} />
        <ReviewRow label="Target Market" value={props.targetMarket || "Not set"} />
        <ReviewRow label="Description" value={props.companyDescription ? props.companyDescription.slice(0, 80) + (props.companyDescription.length > 80 ? "…" : "") : "Not set"} />
        <ReviewRow label="USP" value={props.uniqueSellingProposition ? props.uniqueSellingProposition.slice(0, 80) + (props.uniqueSellingProposition.length > 80 ? "…" : "") : "Not set"} />
      </ReviewSection>

      {/* Goal */}
      <ReviewSection title="Campaign Goal">
        <ReviewRow label="Objective" value={goalLabels[props.selectedGoal] || props.selectedGoal} />
      </ReviewSection>

      {/* Accounts */}
      <ReviewSection
        title="Connected Accounts"
        warning={adConnected.length === 0 ? "No ad platforms connected" : undefined}
      >
        {connectedPlatforms.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {connectedPlatforms.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/20 font-medium"
              >
                <Check className="h-3 w-3" />
                {p.icon} {p.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No accounts connected yet.</p>
        )}
      </ReviewSection>

      {/* Budget */}
      <ReviewSection title="Budget & Bidding">
        <ReviewRow label="Strategy" value={props.northStar === "growth" ? "🚀 Maximize Growth" : "💎 Maximize Profit"} />
        <ReviewRow label="Daily Budget" value={`$${props.dailyBudget}/day`} />
        <ReviewRow label="Monthly Cap" value={`$${props.monthlyBudget.toLocaleString()}/mo`} />
        <ReviewRow label="Target CPA" value={`$${props.targetCpa}`} />
        <ReviewRow label="Auto-Scaling" value={`Up to ${props.scalingLimit}% ($${Math.round((props.dailyBudget * props.scalingLimit) / 100)}/day)`} />
      </ReviewSection>

      {/* Audience */}
      <ReviewSection title="Audience">
        <ReviewRow label="Age Range" value={props.personaAge} />
        <ReviewRow label="Location" value={props.personaLocation || "Not specified"} />
        <ReviewRow label="Interests" value={props.personaInterests || "Not specified"} />
        <ReviewRow
          label="Seed Audience"
          value={
            props.seedFile
              ? `📄 ${props.seedFile.name} (${(props.seedFile.size / 1024).toFixed(1)} KB)`
              : "None uploaded"
          }
        />
      </ReviewSection>

      {/* Creative */}
      <ReviewSection title="Brand & Creative">
        <FilesSummary label="Logos" files={props.logoFiles} />
        <FilesSummary label="Fonts" files={props.fontFiles} />
        <FilesSummary label="Style Guides" files={props.styleGuideFiles} />
        <ReviewRow
          label="Value Props"
          value={
            props.valueProps.length > 0
              ? props.valueProps.join(", ")
              : "None added"
          }
        />
        <ReviewRow
          label="Constraints"
          value={
            props.negativeConstraints.length > 0
              ? props.negativeConstraints.join(", ")
              : "None added"
          }
        />
        <ReviewRow
          label="Competitors"
          value={
            props.competitors.length > 0
              ? props.competitors.join(", ")
              : "None added"
          }
        />
        <ReviewRow label="Creative Risk" value={`${props.vibe}/10`} />
      </ReviewSection>

      {/* Reporting */}
      <ReviewSection title="Reporting">
        <ReviewRow label="Channel" value={channelLabels[props.deliveryChannel] || props.deliveryChannel} />
        <ReviewRow label="Frequency" value={frequencyLabels[props.reportFrequency] || props.reportFrequency} />
        <ReviewRow label="Escalation" value={escalationLabels[props.escalationTrigger] || props.escalationTrigger} />
      </ReviewSection>

      {/* Launch message */}
      <motion.div variants={item} className="p-5 rounded-xl border border-primary/20 bg-primary/5 text-center">
        <p className="text-sm font-medium text-foreground">
          🚀 Your AI agents are ready to launch
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Once launched, agents will begin the Research → Create → Launch → Optimize loop automatically.
        </p>
      </motion.div>
    </motion.div>
  );
}