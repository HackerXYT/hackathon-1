import { useState } from "react";
import { Shield, Target, Lightbulb, Swords, CheckCircle, XCircle, Zap, Eye } from "lucide-react";
import type { CompetitorIntelligenceData, CompetitorAnalyzed } from "@/lib/api";

interface Props {
  data: CompetitorIntelligenceData;
}

function CompetitorMiniCard({ comp }: { comp: CompetitorAnalyzed }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="glass-card p-4 space-y-2">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-xs font-display font-semibold text-foreground">{comp.name}</h5>
            <a href={comp.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary hover:underline" onClick={(e) => e.stopPropagation()}>
              {comp.url}
            </a>
          </div>
          <Zap className={`h-3.5 w-3.5 shrink-0 transition-transform ${expanded ? "text-primary rotate-90" : "text-muted-foreground"}`} />
        </div>
        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{comp.positioning}</p>
      </button>

      {expanded && (
        <div className="space-y-3 pt-2 border-t border-border/30">
          {/* Key Services */}
          {comp.keyServices?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {comp.keyServices.map((s) => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{s}</span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {comp.perceivedStrengths?.length > 0 && (
              <div className="rounded-lg border border-success/20 bg-success/5 p-2.5">
                <p className="text-[10px] text-success uppercase tracking-wider mb-1.5 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Strengths</p>
                <ul className="space-y-0.5">
                  {comp.perceivedStrengths.map((s, i) => <li key={i} className="text-[10px] text-foreground">• {s}</li>)}
                </ul>
              </div>
            )}
            {comp.perceivedWeaknesses?.length > 0 && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-2.5">
                <p className="text-[10px] text-destructive uppercase tracking-wider mb-1.5 flex items-center gap-1"><XCircle className="h-3 w-3" /> Weaknesses</p>
                <ul className="space-y-0.5">
                  {comp.perceivedWeaknesses.map((w, i) => <li key={i} className="text-[10px] text-foreground">• {w}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function CompetitorIntelSection({ data }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
        <Swords className="h-3.5 w-3.5 text-accent" />
        Competitor Intelligence
      </h3>

      {/* Executive Summary */}
      {data.competitorExecutiveSummary && (
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Executive Summary</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{data.competitorExecutiveSummary}</p>
        </div>
      )}

      {/* Positioning Wedge */}
      {data.positioningWedge && (
        <div className="glass-card p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-3.5 w-3.5 text-primary" />
            <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Positioning Wedge</h4>
          </div>
          <p className="text-sm font-medium text-foreground mb-1.5">{data.positioningWedge.angle}</p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">{data.positioningWedge.rationale}</p>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Suggested Messaging</p>
            <p className="text-xs text-foreground italic">"{data.positioningWedge.messagingSuggestion}"</p>
          </div>
        </div>
      )}

      {/* Advantages & Market Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Array.isArray(data.orbitalAdvantages) && data.orbitalAdvantages.length > 0 && (
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-3.5 w-3.5 text-success" />
              <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Your Advantages</h4>
            </div>
            <ul className="space-y-1.5">
              {data.orbitalAdvantages.map((a, i) => (
                <li key={i} className="text-[11px] text-foreground flex items-start gap-2">
                  <span className="text-success mt-0.5 shrink-0">✓</span>{a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {Array.isArray(data.gapsInMarket) && data.gapsInMarket.length > 0 && (
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-3.5 w-3.5 text-warning" />
              <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Market Gaps</h4>
            </div>
            <ul className="space-y-1.5">
              {data.gapsInMarket.map((g, i) => (
                <li key={i} className="text-[11px] text-foreground flex items-start gap-2">
                  <span className="text-warning mt-0.5 shrink-0">◆</span>{g}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Counter Strategies */}
      {Array.isArray(data.counterStrategies) && data.counterStrategies.length > 0 && (
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Swords className="h-3.5 w-3.5 text-accent" />
            <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Counter Strategies</h4>
          </div>
          <div className="space-y-2">
            {data.counterStrategies.map((cs, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/30">
                <p className="text-[11px] text-foreground leading-relaxed">{cs}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitor Profiles */}
      {Array.isArray(data.competitorsAnalyzed) && data.competitorsAnalyzed.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-3.5 w-3.5 text-primary" />
            <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
              Competitor Profiles ({data.competitorsAnalyzed.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {data.competitorsAnalyzed.map((comp) => (
              <CompetitorMiniCard key={comp.url} comp={comp} />
            ))}
          </div>
        </div>
      )}

      {data.analysedAt && (
        <p className="text-[10px] text-muted-foreground/60">Analysed {new Date(data.analysedAt).toLocaleString()}</p>
      )}
    </div>
  );
}