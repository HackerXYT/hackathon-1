import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchCompetitorResponse, fetchCompanyReports, type CompetitorResponse, type CompanyReport } from "@/lib/api";
import {
  Loader2, RefreshCw, Target, Shield, Lightbulb, Swords, Globe, Search,
  CheckCircle, XCircle, ExternalLink, Zap, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

function SeoScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? "text-success" : score >= 60 ? "text-warning" : "text-destructive";
  return (
    <div className={`flex items-center justify-center h-12 w-12 rounded-full border-2 ${color} border-current font-display font-bold text-sm`}>
      {score}
    </div>
  );
}

function CompetitorCard({ comp }: { comp: CompetitorResponse["analysis"]["competitors"][0] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="glass-card-hover p-5 space-y-3">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-display font-semibold text-foreground">{comp.name}</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">{comp.url}</p>
          </div>
          <Zap className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "text-primary rotate-90" : "text-muted-foreground"}`} />
        </div>
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{comp.positioning}</p>
      </button>
      {expanded && (
        <div className="space-y-4 pt-3 border-t border-border/30">
          {comp.targetAudience && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Target Audience</p>
              <p className="text-xs text-foreground">{comp.targetAudience}</p>
            </div>
          )}
          {comp.messagingAngle && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Messaging Angle</p>
              <p className="text-xs text-foreground">{comp.messagingAngle}</p>
            </div>
          )}
          {comp.keyServices && comp.keyServices.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {comp.keyServices.map((s) => (
                <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{s}</span>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {comp.perceivedStrengths && comp.perceivedStrengths.length > 0 && (
              <div className="rounded-lg border border-success/20 bg-success/5 p-3">
                <p className="text-[10px] text-success uppercase tracking-wider mb-2 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Strengths</p>
                <ul className="space-y-1">{comp.perceivedStrengths.map((s, i) => <li key={i} className="text-[11px] text-foreground">• {s}</li>)}</ul>
              </div>
            )}
            {comp.perceivedWeaknesses && comp.perceivedWeaknesses.length > 0 && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-[10px] text-destructive uppercase tracking-wider mb-2 flex items-center gap-1"><XCircle className="h-3 w-3" /> Weaknesses</p>
                <ul className="space-y-1">{comp.perceivedWeaknesses.map((w, i) => <li key={i} className="text-[11px] text-foreground">• {w}</li>)}</ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function WebsiteReportCard({ report }: { report: CompanyReport }) {
  const [expanded, setExpanded] = useState(false);
  const seo = report.seoScore || {} as any;
  const perf = report.performanceHints || {} as any;
  return (
    <div className="glass-card-hover p-5 space-y-3">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-center gap-3">
          {seo.overall != null && <SeoScoreRing score={seo.overall} />}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-display font-semibold text-foreground truncate">{report.companyName || report.domain}</h4>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${report.type === "own" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                {report.type === "own" ? "Your Site" : "Competitor"}
              </span>
            </div>
            <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary hover:underline flex items-center gap-1">
              {report.domain} <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
          <Zap className={`h-4 w-4 shrink-0 transition-transform ${expanded ? "text-primary rotate-90" : "text-muted-foreground"}`} />
        </div>
      </button>
      {expanded && (
        <div className="space-y-4 pt-3 border-t border-border/30">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2 rounded-lg bg-secondary/30"><p className="text-[10px] text-muted-foreground">Words</p><p className="text-sm font-bold text-foreground">{report.wordCount || 0}</p></div>
            <div className="p-2 rounded-lg bg-secondary/30"><p className="text-[10px] text-muted-foreground">Load</p><p className="text-sm font-bold text-foreground capitalize">{perf.estimatedLoadScore || "—"}</p></div>
            <div className="p-2 rounded-lg bg-secondary/30"><p className="text-[10px] text-muted-foreground">HTML Size</p><p className="text-sm font-bold text-foreground">{perf.htmlSizeKb || 0} KB</p></div>
            <div className="p-2 rounded-lg bg-secondary/30"><p className="text-[10px] text-muted-foreground">SSL</p><p className="text-sm font-bold text-foreground">{report.techStack?.ssl ? "✓" : "✗"}</p></div>
          </div>
          {report.meta?.title && (
            <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Page Title</p><p className="text-xs text-foreground">{report.meta.title}</p></div>
          )}
          {report.meta?.description && (
            <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Meta Description</p><p className="text-xs text-foreground line-clamp-3">{report.meta.description}</p></div>
          )}
          {report.techStack && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Tech Stack</p>
              <div className="flex flex-wrap gap-1.5">
                {report.techStack.cms && <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">{report.techStack.cms}</span>}
                {(report.techStack.detected || []).map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-foreground border border-border">{t}</span>)}
                {(report.techStack.analytics || []).map((a) => <span key={a} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{a}</span>)}
              </div>
            </div>
          )}
          {seo.issues && seo.issues.length > 0 && (
            <div>
              <p className="text-[10px] text-destructive uppercase tracking-wider mb-1">SEO Issues ({seo.issues.length})</p>
              <ul className="space-y-0.5">{seo.issues.map((issue: string, i: number) => <li key={i} className="text-[11px] text-foreground">• {issue}</li>)}</ul>
            </div>
          )}
          {seo.recommendations && seo.recommendations.length > 0 && (
            <div>
              <p className="text-[10px] text-success uppercase tracking-wider mb-1">SEO Recommendations</p>
              <ul className="space-y-0.5">{seo.recommendations.map((rec: string, i: number) => <li key={i} className="text-[11px] text-foreground">• {rec}</li>)}</ul>
            </div>
          )}
          {report.topKeywords && report.topKeywords.length > 0 && (
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Top Keywords</p>
              <div className="flex flex-wrap gap-1">{report.topKeywords.slice(0, 15).map((kw) => (
                <span key={kw.word} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-foreground font-mono">{kw.word} <span className="text-muted-foreground">({kw.count})</span></span>
              ))}</div>
            </div>
          )}
          <p className="text-[10px] text-muted-foreground/60">Scraped {new Date(report.scrapedAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

export default function CompetitorIntelPage() {
  const { data: competitorResponses = [], isLoading: crLoading, isError: crError, refetch: refetchCR } = useQuery({
    queryKey: ["competitorResponse"],
    queryFn: fetchCompetitorResponse,
    retry: 1,
  });

  const { data: companyReports = [], isLoading: reportsLoading, isError: reportsError, refetch: refetchReports } = useQuery({
    queryKey: ["companyReports"],
    queryFn: fetchCompanyReports,
    retry: 1,
  });

  const isLoading = crLoading || reportsLoading;
  const isError = crError && reportsError;
  const latestAnalysis = competitorResponses[0] || null;

  const uniqueReports = new Map<string, CompanyReport>();
  for (const r of companyReports) {
    if (!uniqueReports.has(r.domain)) uniqueReports.set(r.domain, r);
  }
  const ownReports = Array.from(uniqueReports.values()).filter((r) => r.type === "own");
  const competitorReports = Array.from(uniqueReports.values()).filter((r) => r.type === "competitor");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Competitor Intelligence</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-powered competitive analysis, website audits, and market positioning</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { refetchCR(); refetchReports(); }} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </motion.div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {isError && !isLoading && (
        <motion.div variants={item} className="glass-card p-8 text-center">
          <Shield className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-base font-display font-semibold text-foreground mb-1">Unable to load competitor data</h3>
          <p className="text-sm text-muted-foreground mb-4">Make sure the backend server is running on localhost:3000</p>
          <Button onClick={() => { refetchCR(); refetchReports(); }} variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </motion.div>
      )}

      {latestAnalysis && latestAnalysis.analysis && (
        <>
          {latestAnalysis.analysis.executiveSummary && (
            <motion.div variants={item} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Executive Summary</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{latestAnalysis.analysis.executiveSummary}</p>
            </motion.div>
          )}

          {latestAnalysis.analysis.positioningWedge && (
            <motion.div variants={item} className="glass-card p-5 border-l-4 border-l-primary">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Positioning Wedge</h3>
              </div>
              <p className="text-sm font-medium text-foreground mb-2">{latestAnalysis.analysis.positioningWedge.angle}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{latestAnalysis.analysis.positioningWedge.rationale}</p>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Suggested Messaging</p>
                <p className="text-xs text-foreground italic">"{latestAnalysis.analysis.positioningWedge.messagingSuggestion}"</p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestAnalysis.analysis.orbitalAdvantages && latestAnalysis.analysis.orbitalAdvantages.length > 0 && (
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Your Advantages</h3>
                </div>
                <ul className="space-y-2">
                  {latestAnalysis.analysis.orbitalAdvantages.map((a, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-2"><span className="text-success mt-0.5 shrink-0">✓</span>{String(a)}</li>
                  ))}
                </ul>
              </motion.div>
            )}
            {latestAnalysis.analysis.gapsInMarket && latestAnalysis.analysis.gapsInMarket.length > 0 && (
              <motion.div variants={item} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-warning" />
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Market Gaps</h3>
                </div>
                <ul className="space-y-2">
                  {latestAnalysis.analysis.gapsInMarket.map((g, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-2"><span className="text-warning mt-0.5 shrink-0">◆</span>{String(g)}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {latestAnalysis.analysis.counterStrategies && latestAnalysis.analysis.counterStrategies.length > 0 && (
            <motion.div variants={item} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Swords className="h-4 w-4 text-accent" />
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Counter Strategies</h3>
              </div>
              <div className="space-y-3">
                {latestAnalysis.analysis.counterStrategies.map((cs, i) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary/30">
                    <p className="text-xs text-foreground leading-relaxed">{String(cs)}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {latestAnalysis.analysis.competitors && latestAnalysis.analysis.competitors.length > 0 && (
            <motion.div variants={item}>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Competitor Profiles</h3>
              </div>
              <div className="space-y-3">
                {latestAnalysis.analysis.competitors.map((comp) => (
                  <CompetitorCard key={comp.url} comp={comp} />
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}

      {(ownReports.length > 0 || competitorReports.length > 0) && (
        <>
          {ownReports.length > 0 && (
            <motion.div variants={item}>
              <div className="flex items-center gap-2 mb-3">
                <Globe className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Your Website Audit</h3>
              </div>
              <div className="space-y-3">
                {ownReports.map((r) => <WebsiteReportCard key={r._id} report={r} />)}
              </div>
            </motion.div>
          )}

          {competitorReports.length > 0 && (
            <motion.div variants={item}>
              <div className="flex items-center gap-2 mb-3">
                <Search className="h-4 w-4 text-accent" />
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Competitor Website Audits</h3>
                <span className="text-[10px] text-muted-foreground">({competitorReports.length})</span>
              </div>
              <div className="space-y-3">
                {competitorReports.map((r) => <WebsiteReportCard key={r._id} report={r} />)}
              </div>
            </motion.div>
          )}
        </>
      )}

      {!isLoading && !isError && !latestAnalysis && companyReports.length === 0 && (
        <motion.div variants={item} className="glass-card p-12 text-center">
          <Shield className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-foreground mb-2">No competitive intelligence yet</h3>
          <p className="text-sm text-muted-foreground">Competitor analysis and website audits will appear here once generated.</p>
        </motion.div>
      )}
    </motion.div>
  );
}