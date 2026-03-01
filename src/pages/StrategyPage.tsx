import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchStrategy, type StrategyResponse } from "@/lib/api";
import {
  Loader2, RefreshCw, Shield, AlertTriangle,
  Lightbulb, CheckCircle, XCircle, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PerformanceSummarySection } from "@/components/strategy/PerformanceSummarySection";
import { CompanyProfileSection } from "@/components/strategy/CompanyProfileSection";
import { CompetitorIntelSection } from "@/components/strategy/CompetitorIntelSection";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const swotConfig = {
  strengths: { label: "Strengths", icon: CheckCircle, color: "text-success", bg: "bg-success/10", border: "border-success/20" },
  weaknesses: { label: "Weaknesses", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
  opportunities: { label: "Opportunities", icon: Lightbulb, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  threats: { label: "Threats", icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
};

const priorityColors: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  high: "bg-warning/10 text-warning border-warning/20",
  medium: "bg-primary/10 text-primary border-primary/20",
  low: "bg-success/10 text-success border-success/20",
};

function getRecommendationText(rec: unknown): { action: string; rationale?: string; priority?: string; category?: string; dataSource?: string } {
  if (typeof rec === "string") {
    return { action: rec };
  }
  if (rec && typeof rec === "object") {
    const obj = rec as Record<string, unknown>;
    return {
      action: String(obj.action || obj.point || obj.title || obj.message || obj.text || ""),
      rationale: obj.rationale ? String(obj.rationale) : undefined,
      priority: obj.priority ? String(obj.priority) : undefined,
      category: obj.category ? String(obj.category) : undefined,
      dataSource: obj.dataSource ? String(obj.dataSource) : undefined,
    };
  }
  return { action: String(rec) };
}

function StrategyCard({ strategy, isLatest }: { strategy: StrategyResponse; isLatest: boolean }) {
  const [expanded, setExpanded] = useState(isLatest);

  const swot = strategy.swot || { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  const rawRecommendations = strategy.recommendations || [];

  // Support both performanceSummary and dataSummary fields
  const perfData = strategy.performanceSummary || strategy.dataSummary || null;

  return (
    <motion.div variants={item} className="glass-card-hover overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-5 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-display font-semibold text-foreground">
                Strategy Analysis
              </h3>
              {strategy.dateRange && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                  {strategy.dateRange.startDate} → {strategy.dateRange.endDate}
                </span>
              )}
              {isLatest && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Latest</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{strategy.executiveSummary || "No summary available."}</p>
          </div>
          <Zap className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "text-primary rotate-90" : "text-muted-foreground"}`} />
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-6 border-t border-border/30 pt-5">
          {/* Executive Summary */}
          {strategy.executiveSummary && (
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Executive Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{strategy.executiveSummary}</p>
            </div>
          )}

          {/* Performance Summary */}
          {perfData && <PerformanceSummarySection data={perfData} />}

          {/* Company Profile */}
          {strategy.companyProfile && <CompanyProfileSection data={strategy.companyProfile} />}

          {/* SWOT */}
          <div>
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-primary" />
              SWOT Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["strengths", "weaknesses", "opportunities", "threats"] as const).map((key) => {
                const cfg = swotConfig[key];
                const items = swot[key] || [];
                if (items.length === 0) return null;
                return (
                  <div key={key} className={`rounded-xl border p-4 space-y-3 ${cfg.border} ${cfg.bg}`}>
                    <div className="flex items-center gap-2">
                      <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
                      <h4 className={`text-xs font-semibold uppercase tracking-wider ${cfg.color}`}>{cfg.label}</h4>
                      <span className="text-[10px] text-muted-foreground ml-auto">{items.length}</span>
                    </div>
                    <ul className="space-y-2">
                      {items.map((s, i) => (
                        <li key={i} className="text-xs">
                          <p className="font-medium text-foreground">{typeof s === "string" ? s : s.point}</p>
                          {typeof s !== "string" && s.rationale && (
                            <p className="text-muted-foreground mt-0.5 leading-relaxed">{s.rationale}</p>
                          )}
                          {typeof s !== "string" && s.dataSource && (
                            <span className="text-[10px] text-muted-foreground/60 mt-0.5 inline-block">Source: {s.dataSource}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommendations */}
          {rawRecommendations.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-warning" /> Recommendations
              </h4>
              <ol className="space-y-2">
                {rawRecommendations.map((rawRec, i) => {
                  const rec = getRecommendationText(rawRec);
                  return (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
                      <span className="text-primary font-bold text-xs shrink-0">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs text-foreground leading-relaxed font-medium">{rec.action}</p>
                          {rec.priority && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium border ${priorityColors[rec.priority.toLowerCase()] || "bg-secondary text-muted-foreground border-border"}`}>
                              {rec.priority}
                            </span>
                          )}
                          {rec.category && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
                              {rec.category}
                            </span>
                          )}
                        </div>
                        {rec.rationale && (
                          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{rec.rationale}</p>
                        )}
                        {rec.dataSource && (
                          <span className="text-[10px] text-muted-foreground/60 mt-0.5 inline-block">Source: {rec.dataSource}</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {/* Competitor Intelligence */}
          {strategy.competitorIntelligence && <CompetitorIntelSection data={strategy.competitorIntelligence} />}

          <p className="text-[10px] text-muted-foreground/60">
            Generated {strategy.generatedAt ? new Date(strategy.generatedAt).toLocaleString() : "Unknown"}
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default function StrategyPage() {
  const { data: strategies = [], isLoading, refetch } = useQuery({
    queryKey: ["strategy"],
    queryFn: fetchStrategy,
    retry: false,
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Strategy & Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-generated SWOT analysis, performance data, company profile, and competitive intelligence
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </motion.div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {!isLoading && strategies.length === 0 && (
        <motion.div variants={item} className="glass-card p-12 text-center">
          <Shield className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-foreground mb-2">No strategy reports yet</h3>
          <p className="text-sm text-muted-foreground">Strategy reports will appear here once generated from your analytics data.</p>
        </motion.div>
      )}

      <div className="space-y-4">
        {strategies.map((s, i) => (
          <StrategyCard key={s._id} strategy={s} isLatest={i === 0} />
        ))}
      </div>
    </motion.div>
  );
}