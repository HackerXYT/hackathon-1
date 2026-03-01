import { motion } from "framer-motion";
import { InfoTooltip } from "@/components/InfoTooltip";
import { SeedUploadCard } from "@/components/onboarding/SeedUploadCard";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const inputClass =
  "w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
const selectClass =
  "w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

interface StepAudienceProps {
  personaAge: string;
  setPersonaAge: (v: string) => void;
  personaLocation: string;
  setPersonaLocation: (v: string) => void;
  personaInterests: string;
  setPersonaInterests: (v: string) => void;
  seedFile: File | null;
  setSeedFile: (f: File | null) => void;
}

export function StepAudience({
  personaAge,
  setPersonaAge,
  personaLocation,
  setPersonaLocation,
  personaInterests,
  setPersonaInterests,
  seedFile,
  setSeedFile,
}: StepAudienceProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h2 className="text-xl font-display font-bold text-foreground">
          Define your audience
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tell your AI agents who your ideal customers are. They'll use this as a starting point and refine targeting over time.
        </p>
      </motion.div>

      {/* Customer Persona */}
      <motion.div variants={item} className="glass-card p-5 space-y-5">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Customer Persona
          </p>
          <InfoTooltip text="Describe your ideal customer. Agents use this for initial targeting before AI optimization takes over with real performance data." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              Age Range
            </label>
            <select
              className={selectClass}
              value={personaAge}
              onChange={(e) => setPersonaAge(e.target.value)}
            >
              <option value="18-24">18–24</option>
              <option value="25-34">25–34</option>
              <option value="25-44">25–44</option>
              <option value="35-54">35–54</option>
              <option value="45-65+">45–65+</option>
              <option value="all">All ages</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              Location / Region
              <InfoTooltip text="Where are your customers located? Agents will target ads to these regions." />
            </label>
            <input
              className={inputClass}
              placeholder="e.g. United States, United Kingdom"
              value={personaLocation}
              onChange={(e) => setPersonaLocation(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              Interests & Keywords
              <InfoTooltip text="Describe your ideal customer's interests, behaviors, or job titles. E.g. 'Small business owners interested in SaaS tools'." />
            </label>
            <textarea
              className={inputClass + " min-h-[100px] resize-none"}
              placeholder="e.g. Small business owners interested in marketing automation, SaaS tools, and digital advertising"
              value={personaInterests}
              onChange={(e) => setPersonaInterests(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* Seed Audience */}
      <motion.div variants={item} className="glass-card p-5">
        <SeedUploadCard file={seedFile} onFileChange={setSeedFile} />
      </motion.div>
    </motion.div>
  );
}