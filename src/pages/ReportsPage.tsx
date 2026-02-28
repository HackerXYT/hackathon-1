import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FileText, Loader2, RefreshCw,
  TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle,
  Info, Video, ChevronDown, ChevronUp, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAgentLogs, triggerAccountManagerReport, type AgentLog } from "@/lib/api";
import { toast } from "sonner";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const trendIcon: Record<string, React.ElementType> = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

const trendColor: Record<string, string> = {
  up: "text-success",
  down: "text-destructive",
  stable: "text-muted-foreground",
};

const alertConfig: Record<string, { icon: React.ElementType; color: string }> = {
  info: { icon: Info, color: "text-primary bg-primary/10 border-primary/20" },
  warning: { icon: AlertTriangle, color: "text-warning bg-warning/10 border-warning/20" },
  critical: { icon: AlertTriangle, color: "text-destructive bg-destructive/10 border-destructive/20" },
};

interface ParsedReport {
  id: number;
  timestamp: string;
  report: {
    greeting: string;
    executive_summary: string;
    performance_highlights: { metric: string; value: string; trend: string; context: string }[];
    agent_actions_summary: string;
    wins: string[];
    concerns: string[];
    next_steps: string[];
    closing: string;
  };
  delivery: {
    channel: string;
    frequency: string;
    urgency: string;
  };
  alerts: { type: string; message: string }[];
  video_brief_script: string;
}

function parseReportFromLog(log: AgentLog): ParsedReport | null {
  const meta = log.meta as any;
  if (!meta?.report) return null;
  return {
    id: log.id,
    timestamp: log.timestamp,
    report: {
      greeting: meta.report?.greeting || "",
      executive_summary: meta.report?.executive_summary || "",
      performance_highlights: Array.isArray(meta.report?.performance_highlights) ? meta.report.performance_highlights : [],
      agent_actions_summary: meta.report?.agent_actions_summary || "",
      wins: Array.isArray(meta.report?.wins) ? meta.report.wins : [],
      concerns: Array.isArray(meta.report?.concerns) ? meta.report.concerns : [],
      next_steps: Array.isArray(meta.report?.next_steps) ? meta.report.next_steps : [],
      closing: meta.report?.closing || "",
    },
    delivery: meta.delivery || { channel: "email", frequency: "daily", urgency: "routine" },
    alerts: Array.isArray(meta.alerts) ? meta.alerts : [],
    video_brief_script: meta.video_brief_script || meta.full_script || "",
  };
}

function ReportCard({ report, isExpanded, onToggle }: { report: ParsedReport; isExpanded: boolean; onToggle: () => void }) {
  const urgencyBadge: Record<string, string> = {
    routine: "bg-primary/10 text-primary",
    important: "bg-warning/10 text-warning",
    urgent: "bg-destructive/10 text-destructive",
  };

  const channelEmoji: Record<string, string> = {
    email: "📧",
    slack: "💬",
    whatsapp: "📱",
  };

  return (
    <motion.div layout variants={item} className="glass-card-hover overflow-hidden">
      {/* Header */}
      <button onClick={onToggle} className="w-full p-5 flex items-center gap-4 text-left">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-medium text-foreground">
              {report.report.greeting?.replace(/^(Hi|Hey|Hello)\s*/i, "Report for ").replace(/[!,].*/, "") || "Performance Report"}
            </h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${urgencyBadge[report.delivery.urgency] || urgencyBadge.routine}`}>
              {report.delivery.urgency}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              {channelEmoji[report.delivery.channel] || "📧"} {report.delivery.channel} • {report.delivery.frequency}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {report.report.executive_summary}
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
            {new Date(report.timestamp).toLocaleString()}
          </p>
        </div>
        <div className="shrink-0">
          {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-5 border-t border-border/30 pt-5">
              {/* Greeting & Summary */}
              <div>
                {report.report.greeting && <p className="text-sm text-foreground font-medium">{report.report.greeting}</p>}
                {report.report.executive_summary && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{report.report.executive_summary}</p>}
              </div>

              {/* Performance Highlights */}
              {report.report.performance_highlights.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Performance Highlights</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {report.report.performance_highlights.map((h, i) => {
                      const TrendIcon = trendIcon[h.trend] || Minus;
                      return (
                        <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] text-muted-foreground">{String(h.metric || "")}</span>
                            <TrendIcon className={`h-3.5 w-3.5 ${trendColor[h.trend] || trendColor.stable}`} />
                          </div>
                          <p className="text-lg font-display font-bold text-foreground">{String(h.value || "")}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{String(h.context || "")}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Agent Actions Summary */}
              {report.report.agent_actions_summary && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">What Your AI Agents Did</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{report.report.agent_actions_summary}</p>
                </div>
              )}

              {/* Wins & Concerns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.report.wins.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-success uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" /> Wins
                    </h4>
                    <ul className="space-y-1.5">
                      {report.report.wins.map((w, i) => (
                        <li key={i} className="text-xs text-foreground flex items-start gap-2">
                          <span className="text-success mt-0.5 shrink-0">✓</span>
                          <span>{String(w)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {report.report.concerns.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-warning uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" /> Concerns
                    </h4>
                    <ul className="space-y-1.5">
                      {report.report.concerns.map((c, i) => (
                        <li key={i} className="text-xs text-foreground flex items-start gap-2">
                          <span className="text-warning mt-0.5 shrink-0">⚠</span>
                          <span>{String(c)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Alerts */}
              {report.alerts.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Alerts</h4>
                  <div className="space-y-2">
                    {report.alerts.map((alert, i) => {
                      const cfg = alertConfig[alert.type] || alertConfig.info;
                      return (
                        <div key={i} className={`flex items-start gap-2 p-3 rounded-lg border ${cfg.color}`}>
                          <cfg.icon className="h-4 w-4 shrink-0 mt-0.5" />
                          <p className="text-xs">{String(alert.message || "")}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Next Steps */}
              {report.report.next_steps.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Next Steps</h4>
                  <ul className="space-y-1.5">
                    {report.report.next_steps.map((s, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                        <span>{String(s)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Video Brief Script */}
              {report.video_brief_script && (
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5 text-primary" /> 60-Second Video Brief Script
                  </h4>
                  <div className="p-4 rounded-lg bg-secondary/30 border border-border/30">
                    <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{report.video_brief_script}</p>
                  </div>
                </div>
              )}

              {/* Closing */}
              {report.report.closing && (
                <p className="text-sm text-muted-foreground italic border-t border-border/30 pt-4">{report.report.closing}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ReportsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["reportLogs"],
    queryFn: () => fetchAgentLogs("account_manager"),
    retry: 1,
  });

  // Parse reports from account_manager logs that have report meta
  const reports: ParsedReport[] = logs
    .filter((l) => l.action === "report_generated" && l.meta)
    .map(parseReportFromLog)
    .filter(Boolean) as ParsedReport[];

  // Also get video brief logs
  const videoBriefs = logs.filter((l) => l.action === "video_brief");

  // Merge video brief scripts into reports
  for (const report of reports) {
    if (!report.video_brief_script) {
      const brief = videoBriefs.find(
        (v) => Math.abs(new Date(v.timestamp).getTime() - new Date(report.timestamp).getTime()) < 60000
      );
      if (brief?.meta) {
        report.video_brief_script = (brief.meta as any).full_script || brief.message.replace("Video Brief Script: ", "");
      }
    }
  }

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    toast.info("Generating report from your analytics data…");
    try {
      await triggerAccountManagerReport();
      toast.success("Report generated successfully!");
      await refetch();
      const freshLogs = queryClient.getQueryData<AgentLog[]>(["reportLogs"]);
      if (freshLogs) {
        const newest = freshLogs.find((l) => l.action === "report_generated" && l.meta);
        if (newest) setExpandedId(newest.id);
      }
    } catch {
      toast.error("Failed to generate report. Make sure the server is running.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-generated performance reports based on your real analytics data
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleGenerateReport}
            disabled={generating}
            size="sm"
            className="gap-1.5"
          >
            {generating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {generating ? "Generating…" : "Generate Report"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => refetch()} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
        </div>
      </motion.div>

      {/* Generating indicator */}
      {generating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 flex items-center gap-4"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Generating your report…</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              The AI Account Manager is analyzing your Google Analytics & Search Console data from MongoDB. This may take 15–30 seconds.
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats bar */}
      {reports.length > 0 && (
        <motion.div variants={item} className="glass-card p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Reports:</span>
              <span className="text-xs font-medium text-foreground">{reports.length}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Latest:</span>
              <span className="text-xs font-medium text-foreground">
                {new Date(reports[0].timestamp).toLocaleDateString()}
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Delivery:</span>
              <span className="text-xs font-medium text-foreground capitalize">
                {reports[0].delivery.channel} ({reports[0].delivery.frequency})
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <motion.div variants={item} className="glass-card p-8 text-center">
          <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-base font-display font-semibold text-foreground mb-1">Unable to load reports</h3>
          <p className="text-sm text-muted-foreground mb-4">Make sure the backend server is running on localhost:3000</p>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </motion.div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && !generating && reports.length === 0 && (
        <motion.div variants={item} className="glass-card p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-display font-semibold text-foreground mb-2">No reports yet</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Click "Generate Report" to create an AI-powered performance report using your real Google Analytics and Search Console data.
          </p>
          <Button onClick={handleGenerateReport} disabled={generating} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate Your First Report
          </Button>
        </motion.div>
      )}

      {/* Report list */}
      <div className="space-y-3">
        {reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            isExpanded={expandedId === report.id}
            onToggle={() => handleToggle(report.id)}
          />
        ))}
      </div>
    </motion.div>
  );
}