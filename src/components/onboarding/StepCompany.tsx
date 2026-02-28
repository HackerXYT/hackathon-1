import { motion } from "framer-motion";
import { Building2, Globe, Briefcase, FileText, Target, Sparkles } from "lucide-react";
import { InfoTooltip } from "@/components/InfoTooltip";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const inputClass =
  "w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

interface StepCompanyProps {
  companyName: string;
  setCompanyName: (v: string) => void;
  website: string;
  setWebsite: (v: string) => void;
  industry: string;
  setIndustry: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  targetMarket: string;
  setTargetMarket: (v: string) => void;
  uniqueSellingProposition: string;
  setUniqueSellingProposition: (v: string) => void;
}

export function StepCompany({
  companyName,
  setCompanyName,
  website,
  setWebsite,
  industry,
  setIndustry,
  description,
  setDescription,
  targetMarket,
  setTargetMarket,
  uniqueSellingProposition,
  setUniqueSellingProposition,
}: StepCompanyProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h2 className="text-xl font-display font-bold text-foreground">
          Tell us about your company
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your AI agents need to understand your business to create effective campaigns and strategies.
        </p>
      </motion.div>

      <motion.div variants={item} className="glass-card p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-display font-semibold text-foreground">Basic Information</h3>
          <InfoTooltip text="This information helps all four AI agents understand your business context, enabling more relevant ad copy, smarter budget decisions, and better reporting." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              <Building2 className="h-3 w-3" /> Company Name *
            </label>
            <input
              className={inputClass}
              placeholder="e.g. Acme Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              <Globe className="h-3 w-3" /> Website *
            </label>
            <input
              className={inputClass}
              placeholder="e.g. https://acme.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              <Briefcase className="h-3 w-3" /> Industry *
            </label>
            <input
              className={inputClass}
              placeholder="e.g. E-commerce, SaaS, Healthcare"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              <Target className="h-3 w-3" /> Target Market *
            </label>
            <input
              className={inputClass}
              placeholder="e.g. Small businesses in the US"
              value={targetMarket}
              onChange={(e) => setTargetMarket(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
            <FileText className="h-3 w-3" /> Company Description *
            <InfoTooltip text="Describe what your company does, your products/services, and your value proposition. The Creative Director Agent uses this to write ad copy." />
          </label>
          <textarea
            className={inputClass + " min-h-[100px] resize-none"}
            placeholder="Describe what your company does, your products/services, and what makes you unique..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
            <Sparkles className="h-3 w-3" /> Unique Selling Proposition (USP) *
            <InfoTooltip text="What makes your product/service different from competitors? This is the core message your AI agents will use in every ad and campaign." />
          </label>
          <textarea
            className={inputClass + " min-h-[80px] resize-none"}
            placeholder="What makes your product/service different from competitors? Why should customers choose you?"
            value={uniqueSellingProposition}
            onChange={(e) => setUniqueSellingProposition(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div variants={item} className="p-4 rounded-xl border border-primary/20 bg-primary/5">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">💡 Why this matters:</span> Your company profile is shared with all four AI agents. The Analyst uses it to contextualize performance data, the Creative Director uses it to write on-brand ad copy, the Media Buyer uses it to choose the right audiences, and the Account Manager uses it to write reports in your brand voice.
        </p>
      </motion.div>
    </motion.div>
  );
}