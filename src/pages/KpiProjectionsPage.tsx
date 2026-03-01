import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchKpiProjections, type KpiProjection } from "@/lib/api";
import {
  Loader2, RefreshCw, TrendingUp, DollarSign, Users, Target,
  BarChart3, Zap, AlertTriangle, Shield, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const COLORS = ["hsl(187, 96%, 42%)", "hsl(152, 69%, 40%)", "hsl(250, 80%, 62%)", "hsl(38, 92%, 50%)"];

const confidenceColors: Record<string, string> = {
  high: "bg-success/10 text-success border-success/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-destructive/10 text-destructive border-destructive/20",
};

const riskColors: Record<string, string> = {
  conservative: "bg-success/10 text-success border-success/20",
  moderate: "bg-warning/10 text-warning border-warning/20",
  aggressive: "bg-destructive/10 text-destructive border-destructive/20",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="font-medium text-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color || p.fill }} className="flex justify-between gap-4">
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-medium">{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function ProjectionCard({ projection, isLatest }: { projection: KpiProjection; isLatest: boolean }) {
  const [expanded, setExpanded] = useState(isLatest);
  const p = projection.projections;
  const a = projection.assumptions;
  const b = projection.baseline;

  const leadsData = [
    { name: "Organic Leads", value: p.organic_leads },
    { name: "Paid Leads", value: p.paid_leads },
  ];

  const revenueBreakdown = [
    { name: "Projected Revenue", value: p.projected_revenue },
  ];

  const funnelData = [
    { stage: "Organic Sessions", value: p.organic_sessions },
    { stage: "Organic Leads", value: p.organic_leads },
    { stage: "Paid Leads", value: p.paid_leads },
    { stage: "Total Clients", value: p.projected_total_clients },
  ];

  return (
    <motion.div variants={item} className="glass-card-hover overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-5 text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-display font-semibold text-foreground">
                {projection.company_name} — KPI Projection
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                {projection.period.start} → {projection.period.end}
              </span>
              {isLatest && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Latest</span>
              )}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${confidenceColors[a.confidence_score] || confidenceColors.medium}`}>
                {a.confidence_score} confidence
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${riskColors[a.risk_level] || riskColors.moderate}`}>
                {a.risk_level}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <span className="text-xs text-muted-foreground">
                Revenue: <span className="text-foreground font-bold">${p.projected_revenue.toLocaleString()}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                Clients: <span className="text-foreground font-bold">{p.projected_total_clients.toFixed(1)}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                Leads: <span className="text-foreground font-bold">{(p.organic_leads + p.paid_leads).toFixed(1)}</span>
              </span>
            </div>
          </div>
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-6 border-t border-border/30 pt-5">
          {/* KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="h-3.5 w-3.5 text-success" />
                <span className="text-[10px] text-muted-foreground">Projected Revenue</span>
              </div>
              <p className="text-lg font-display font-bold text-foreground">${p.projected_revenue.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">@ ${a.avg_client_value.toLocaleString()}/client</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span className="text-[10px] text-muted-foreground">Total Clients</span>
              </div>
              <p className="text-lg font-display font-bold text-foreground">{p.projected_total_clients.toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground">{(a.close_rate * 100).toFixed(0)}% close rate</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
              <div className="flex items-center gap-1.5 mb-1">
                <Target className="h-3.5 w-3.5 text-warning" />
                <span className="text-[10px] text-muted-foreground">Total Leads</span>
              </div>
              <p className="text-lg font-display font-bold text-foreground">{(p.organic_leads + p.paid_leads).toFixed(1)}</p>
              <p className="text-[10px] text-muted-foreground">Organic: {p.organic_leads.toFixed(1)} • Paid: {p.paid_leads.toFixed(0)}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-3.5 w-3.5 text-accent" />
                <span className="text-[10px] text-muted-foreground">Organic Sessions</span>
              </div>
              <p className="text-lg font-display font-bold text-foreground">{p.organic_sessions.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">{p.traffic_growth_percent}% growth</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Funnel Chart */}
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BarChart3 className="h-3.5 w-3.5 text-primary" /> Conversion Funnel
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 25%, 16%)" />
                  <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
                    {funnelData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Leads Pie Chart */}
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-warning" /> Lead Sources
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={leadsData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {leadsData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Baseline & Assumptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-primary" /> Baseline
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Sessions</span><span className="text-foreground font-medium">{b.sessions.toLocaleString()}</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">CTR</span><span className="text-foreground font-medium">{(b.ctr * 100).toFixed(2)}%</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Budget</span><span className="text-foreground font-medium">${b.budget.toLocaleString()}</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Target CPA</span><span className="text-foreground font-medium">${b.target_cpa}</span></div>
              </div>
            </div>

            <div className="glass-card p-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-warning" /> Assumptions
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Blog Traffic/Post</span><span className="text-foreground font-medium">{a.blog_traffic_per_post}</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Organic CVR</span><span className="text-foreground font-medium">{(a.organic_cvr * 100).toFixed(1)}%</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Paid CVR</span><span className="text-foreground font-medium">{(a.paid_cvr * 100).toFixed(1)}%</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Avg CPC</span><span className="text-foreground font-medium">${a.avg_cpc}</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Close Rate</span><span className="text-foreground font-medium">{(a.close_rate * 100).toFixed(0)}%</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">Avg Client Value</span><span className="text-foreground font-medium">${a.avg_client_value.toLocaleString()}</span></div>
                <div className="flex justify-between text-xs"><span className="text-muted-foreground">CTR Lift (Structured Data)</span><span className="text-foreground font-medium">{(a.ctr_lift_structured_data * 100).toFixed(0)}%</span></div>
              </div>
            </div>
          </div>

          {/* Additional Projections */}
          <div className="glass-card p-4">
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Additional Metrics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2 rounded-lg bg-secondary/30">
                <p className="text-[10px] text-muted-foreground">Projected CTR</p>
                <p className="text-sm font-bold text-foreground">{(p.projected_ctr * 100).toFixed(2)}%</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/30">
                <p className="text-[10px] text-muted-foreground">Traffic Growth</p>
                <p className="text-sm font-bold text-foreground">{p.traffic_growth_percent}%</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/30">
                <p className="text-[10px] text-muted-foreground">Max Paid Leads</p>
                <p className="text-sm font-bold text-foreground">{p.theoretical_max_paid_leads.toFixed(1)}</p>
              </div>
              <div className="p-2 rounded-lg bg-secondary/30">
                <p className="text-[10px] text-muted-foreground">Engine Version</p>
                <p className="text-sm font-bold text-foreground">{projection.engine_version}</p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground/60">
            Created {new Date(projection.created_at).toLocaleString()} • Strategy: {projection.strategy_id.slice(0, 8)}…
          </p>
        </div>
      )}
    </motion.div>
  );
}

export default function KpiProjectionsPage() {
  const { data: projections = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["kpiProjections"],
    queryFn: fetchKpiProjections,
    retry: 1,
  });

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">KPI Projections</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-generated revenue, lead, and traffic projections based on your strategy and data
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

      {isError && !isLoading && (
        <motion.div variants={item} className="glass-card p-8 text-center">
          <AlertTriangle className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-base font-display font-semibold text-foreground mb-1">Unable to load KPI projections</h3>
          <p className="text-sm text-muted-foreground mb-4">Make sure the backend server is running on localhost:3000</p>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </motion.div>
      )}

      {!isLoading && !isError && projections.length === 0 && (
        <motion.div variants={item} className="glass-card p-12 text-center">
          <TrendingUp className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-foreground mb-2">No KPI projections yet</h3>
          <p className="text-sm text-muted-foreground">Projections will appear here once generated from your strategy analysis.</p>
        </motion.div>
      )}

      {projections.length > 0 && (
        <motion.div variants={item} className="glass-card p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Projections:</span>
              <span className="text-xs font-medium text-foreground">{projections.length}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Latest:</span>
              <span className="text-xs font-medium text-foreground">
                {new Date(projections[0].created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Company:</span>
              <span className="text-xs font-medium text-foreground">{projections[0].company_name}</span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {projections.map((proj, i) => (
          <ProjectionCard key={proj._id} projection={proj} isLatest={i === 0} />
        ))}
      </div>
    </motion.div>
  );
}