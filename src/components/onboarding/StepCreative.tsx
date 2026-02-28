import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/InfoTooltip";
import { FileUploadCard } from "@/components/onboarding/FileUploadCard";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const inputClass =
  "w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

interface StepCreativeProps {
  negativeConstraints: string[];
  setNegativeConstraints: React.Dispatch<React.SetStateAction<string[]>>;
  competitors: string[];
  setCompetitors: React.Dispatch<React.SetStateAction<string[]>>;
  valueProps: string[];
  setValueProps: React.Dispatch<React.SetStateAction<string[]>>;
  vibe: number;
  setVibe: (v: number) => void;
  logoFiles: File[];
  setLogoFiles: React.Dispatch<React.SetStateAction<File[]>>;
  fontFiles: File[];
  setFontFiles: React.Dispatch<React.SetStateAction<File[]>>;
  styleGuideFiles: File[];
  setStyleGuideFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export function StepCreative({
  negativeConstraints,
  setNegativeConstraints,
  competitors,
  setCompetitors,
  valueProps,
  setValueProps,
  vibe,
  setVibe,
  logoFiles,
  setLogoFiles,
  fontFiles,
  setFontFiles,
  styleGuideFiles,
  setStyleGuideFiles,
}: StepCreativeProps) {
  const [newConstraint, setNewConstraint] = useState("");
  const [newCompetitor, setNewCompetitor] = useState("");
  const [newValueProp, setNewValueProp] = useState("");

  const addToList = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setValue("");
    }
  };

  const removeFromList = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h2 className="text-xl font-display font-bold text-foreground">
          Create your ads
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Provide your brand assets and creative guidelines. Your AI Creative Agent will generate ads that match your brand perfectly.
        </p>
      </motion.div>

      {/* Style Guide */}
      <motion.div variants={item} className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Brand Assets
          </p>
          <InfoTooltip text="Upload logos (SVG/PNG), color hex codes, font files, and any brand guidelines. The Creative Agent uses these for every ad it generates." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <FileUploadCard
            label="Logos"
            description="SVG, PNG, or JPG"
            emoji="🎨"
            accept="image/*,.svg"
            files={logoFiles}
            onFilesChange={setLogoFiles}
          />
          <FileUploadCard
            label="Brand Fonts"
            description="TTF, OTF, or WOFF"
            emoji="🔤"
            accept=".ttf,.otf,.woff,.woff2"
            files={fontFiles}
            onFilesChange={setFontFiles}
          />
          <FileUploadCard
            label="Style Guide"
            description="PDF, images, or docs"
            emoji="📋"
            accept=".pdf,image/*,.doc,.docx"
            files={styleGuideFiles}
            onFilesChange={setStyleGuideFiles}
          />
        </div>
      </motion.div>

      {/* Value Props & Constraints */}
      <motion.div variants={item} className="glass-card p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Value Propositions */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              Value Propositions
              <InfoTooltip text="3-5 core reasons why customers buy from you. The Creative Agent weaves these into ad headlines and copy." />
            </label>
            <div className="flex gap-2 mb-2">
              <input
                className={inputClass}
                placeholder="e.g. Fastest shipping in the industry"
                value={newValueProp}
                onChange={(e) => setNewValueProp(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  addToList(valueProps, setValueProps, newValueProp, setNewValueProp)
                }
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  addToList(valueProps, setValueProps, newValueProp, setNewValueProp)
                }
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[28px]">
              {valueProps.map((v, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                >
                  {v}
                  <button onClick={() => removeFromList(valueProps, setValueProps, i)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {valueProps.length === 0 && (
                <p className="text-[11px] text-muted-foreground/50 py-1">Add your key selling points</p>
              )}
            </div>
          </div>

          {/* Negative Constraints */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              Negative Constraints
              <InfoTooltip text="Words, phrases, or styles the Creative Agent must never use. E.g. 'Never use the word cheap' or 'No emojis in headlines'." />
            </label>
            <div className="flex gap-2 mb-2">
              <input
                className={inputClass}
                placeholder="e.g. Never use the word 'cheap'"
                value={newConstraint}
                onChange={(e) => setNewConstraint(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  addToList(negativeConstraints, setNegativeConstraints, newConstraint, setNewConstraint)
                }
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  addToList(negativeConstraints, setNegativeConstraints, newConstraint, setNewConstraint)
                }
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 min-h-[28px]">
              {negativeConstraints.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20"
                >
                  {c}
                  <button onClick={() => removeFromList(negativeConstraints, setNegativeConstraints, i)}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              {negativeConstraints.length === 0 && (
                <p className="text-[11px] text-muted-foreground/50 py-1">No constraints added yet</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Competitors */}
      <motion.div variants={item} className="glass-card p-5 space-y-4">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          Competitor List
          <InfoTooltip text="List 5-10 competitors for the Analyst Agent to monitor for creative trends, pricing changes, and market shifts." />
        </label>
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="e.g. Competitor brand name"
            value={newCompetitor}
            onChange={(e) => setNewCompetitor(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              addToList(competitors, setCompetitors, newCompetitor, setNewCompetitor)
            }
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              addToList(competitors, setCompetitors, newCompetitor, setNewCompetitor)
            }
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-1.5 min-h-[28px]">
          {competitors.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-secondary text-foreground border border-border"
            >
              {c}
              <button onClick={() => removeFromList(competitors, setCompetitors, i)}>
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </span>
          ))}
          {competitors.length === 0 && (
            <p className="text-[11px] text-muted-foreground/50 py-1">No competitors added yet</p>
          )}
        </div>
      </motion.div>

      {/* Vibe Selector */}
      <motion.div variants={item} className="glass-card p-5">
        <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-3">
          Creative Risk Level
          <InfoTooltip text="Controls how experimental your AI creatives will be. Low = safe and on-brand. High = bold, edgy, and unconventional." />
        </label>
        <div className="max-w-md">
          <input
            type="range"
            min={1}
            max={10}
            value={vibe}
            onChange={(e) => setVibe(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1.5">
            <span>🛡️ Conservative</span>
            <span className="text-primary font-semibold text-xs">{vibe}/10</span>
            <span>🔥 Experimental</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}