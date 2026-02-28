import { motion } from "framer-motion";
import { InfoTooltip } from "@/components/InfoTooltip";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const selectClass =
  "w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

interface StepReportingProps {
  deliveryChannel: string;
  setDeliveryChannel: (v: string) => void;
  reportFrequency: string;
  setReportFrequency: (v: string) => void;
  escalationTrigger: string;
  setEscalationTrigger: (v: string) => void;
  cpaSpikeThreshold: number;
  setCpaSpikeThreshold: (v: number) => void;
}

export function StepReporting({
  deliveryChannel,
  setDeliveryChannel,
  reportFrequency,
  setReportFrequency,
  escalationTrigger,
  setEscalationTrigger,
  cpaSpikeThreshold,
  setCpaSpikeThreshold,
}: StepReportingProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h2 className="text-xl font-display font-bold text-foreground">
          Set up reporting
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tell your Account Manager Agent how you want to be kept in the loop.
        </p>
      </motion.div>

      {/* Delivery & Frequency */}
      <motion.div variants={item} className="glass-card p-5 space-y-5">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Report Delivery
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              Delivery Channel
              <InfoTooltip text="Where should the Account Manager Agent send your reports and alerts?" />
            </label>
            <select
              className={selectClass}
              value={deliveryChannel}
              onChange={(e) => setDeliveryChannel(e.target.value)}
            >
              <option value="email">📧 Email</option>
              <option value="slack">💬 Slack</option>
              <option value="whatsapp">📱 WhatsApp</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              Report Frequency
              <InfoTooltip text="'Daily Pulse' gives you a quick summary every morning. 'Weekly Deep Dive' is a comprehensive analysis every Monday." />
            </label>
            <select
              className={selectClass}
              value={reportFrequency}
              onChange={(e) => setReportFrequency(e.target.value)}
            >
              <option value="daily">Daily Pulse</option>
              <option value="weekly">Weekly Deep Dive</option>
              <option value="both">Both</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Escalation */}
      <motion.div variants={item} className="glass-card p-5 space-y-5">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Escalation Rules
          </p>
          <InfoTooltip text="Define when the system should urgently alert you. These are 'Human-in-the-loop' moments that require your immediate attention." />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            Alert me when…
          </label>
          <div className="space-y-2">
            {[
              { value: "account_disabled", label: "Ad account is disabled or flagged", desc: "Critical — requires immediate action" },
              { value: "cpa_spike", label: "CPA spikes above threshold", desc: "Performance anomaly detected" },
              { value: "both", label: "Both of the above", desc: "Recommended for most users" },
              { value: "any_anomaly", label: "Any anomaly detected", desc: "Most alerts — stay fully informed" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setEscalationTrigger(option.value)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                  escalationTrigger === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border bg-secondary/20 hover:border-primary/30"
                }`}
              >
                <div
                  className={`mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    escalationTrigger === option.value
                      ? "border-primary"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {escalationTrigger === option.value && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{option.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{option.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {(escalationTrigger === "cpa_spike" || escalationTrigger === "both") && (
          <div className="max-w-sm pt-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              CPA Spike Threshold
              <InfoTooltip text="Alert you if CPA increases by this percentage in a single day. E.g. 50% means 'alert me if CPA jumps from $45 to $67.50 in one day'." />
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={20}
                max={100}
                step={5}
                value={cpaSpikeThreshold}
                onChange={(e) => setCpaSpikeThreshold(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-semibold text-primary w-14 text-right">
                +{cpaSpikeThreshold}%
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}