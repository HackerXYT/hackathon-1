import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUsageSummaryStats,
  fetchUsageSummaryDocs,
  type UsageSummaryStats,
  type UsageSummaryDocsResult,
} from "@/lib/api";
import {
  Loader2, RefreshCw, DollarSign, MessageSquare, Zap,
  ChevronDown, Activity, Coins, Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, AreaChart, Area, Legend,
} from "recharts";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="font-medium text-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="flex justify-between gap-4">
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-medium">{typeof p.value === "number" && p.name === "Cost ($)" ? `$${p.value.toFixed(4)}` : p.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color: string }) {
  return (
    <motion.div variants={item} className="glass-card p-4 flex items-start gap-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${color} shrink-0`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-lg font-display font-bold text-foreground">{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function UsageSummaryPage() {
  const [docLimit, setDocLimit] = useState(5);

  const { data: stats, isLoading: statsLoading, isError, refetch: refetchStats } = useQuery<UsageSummaryStats>({
    queryKey: ["usageSummaryStats"],
    queryFn: fetchUsageSummaryStats,
    retry: 1,
  });

  const { data: docsData, isLoading: docsLoading, refetch: refetchDocs } = useQuery<UsageSummaryDocsResult>({
    queryKey: ["usageSummaryDocs", docLimit],
    queryFn: () => fetchUsageSummaryDocs(docLimit, 0),
    retry: 1,
  });

  const refetchAll = () => { refetchStats(); refetchDocs(); };

  const docs = docsData?.documents || [];
  const totalCount = docsData?.count || 0;

  const costChartData = (stats?.daily || []).map((d) => ({
    date: d.date.slice(5),
    "Cost ($)": parseFloat(d.cost.toFixed(4)),
    Sessions: d.sessions,
  }));

  const tokenChartData = (stats?.daily || []).map((d) => ({
    date: d.date.slice(5),
    "Input Tokens": d.inputTokens,
    "Output Tokens": d.outputTokens,
    "Cache Read": d.cacheRead,
  }));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Usage Summary</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI usage, token consumption & cost analytics from <span className="text-primary font-medium">usage_summary</span>
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={refetchAll} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </motion.div>

      {statsLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {isError && !statsLoading && (
        <motion.div variants={item} className="glass-card p-8 text-center">
          <Activity className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-base font-display font-semibold text-foreground mb-1">Unable to load usage summary</h3>
          <p className="text-sm text-muted-foreground mb-4">Make sure the backend server is running on localhost:3000</p>
          <Button onClick={refetchAll} variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </motion.div>
      )}

      {stats && (
        <>
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={DollarSign}
              label="Total Cost"
              value={`$${stats.totalCost.toFixed(4)}`}
              sub={`${stats.totalSessions} sessions`}
              color="bg-success/10 text-success"
            />
            <StatCard
              icon={Zap}
              label="Total Tokens"
              value={(stats.totalInputTokens + stats.totalOutputTokens).toLocaleString()}
              sub={`In: ${stats.totalInputTokens.toLocaleString()} • Out: ${stats.totalOutputTokens.toLocaleString()}`}
              color="bg-primary/10 text-primary"
            />
            <StatCard
              icon={MessageSquare}
              label="Conversations"
              value={stats.totalConversations.toLocaleString()}
              sub={`${stats.totalActions.toLocaleString()} actions`}
              color="bg-warning/10 text-warning"
            />
            <StatCard
              icon={Coins}
              label="Cache Usage"
              value={stats.totalCacheRead.toLocaleString()}
              sub={`Read: ${stats.totalCacheRead.toLocaleString()} • Write: ${stats.totalCacheWrite.toLocaleString()}`}
              color="bg-accent/10 text-accent-foreground"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Cost & Sessions Over Time */}
            {costChartData.length > 0 && (
              <motion.div variants={item} className="glass-card p-5">
                <h3 className="text-sm font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-success" />
                  Cost & Sessions Over Time
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={costChartData}>
                    <defs>
                      <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(152, 69%, 40%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(152, 69%, 40%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 25%, 16%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="cost" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="sessions" orientation="right" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area yAxisId="cost" type="monotone" dataKey="Cost ($)" stroke="hsl(152, 69%, 40%)" fill="url(#costGrad)" strokeWidth={2} />
                    <Bar yAxisId="sessions" dataKey="Sessions" fill="hsl(187, 96%, 42%)" radius={[4, 4, 0, 0]} opacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Token Usage Over Time */}
            {tokenChartData.length > 0 && (
              <motion.div variants={item} className="glass-card p-5">
                <h3 className="text-sm font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Token Usage Over Time
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={tokenChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 25%, 16%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="Input Tokens" stackId="tokens" fill="hsl(187, 96%, 42%)" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Output Tokens" stackId="tokens" fill="hsl(38, 92%, 50%)" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Cache Read" stackId="tokens" fill="hsl(250, 80%, 62%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>

          {/* Session Documents List */}
          <motion.div variants={item}>
            <h2 className="text-sm font-display font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Hash className="h-3.5 w-3.5 text-primary" />
              Session Records
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium normal-case tracking-normal">
                {totalCount} total
              </span>
            </h2>
          </motion.div>

          <motion.div variants={item} className="glass-card p-5 space-y-2">
            {docsLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              </div>
            )}

            {!docsLoading && docs.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No session records found</p>
            )}

            {docs.map((doc, i) => (
              <div key={doc._id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 text-xs font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1">
                  <div>
                    <p className="text-xs font-medium text-foreground truncate" title={doc.session_id}>
                      {doc.session_id.slice(0, 8)}…
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      {new Date(doc.recorded_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    <span className="text-[11px] text-muted-foreground">
                      Cost: <span className="text-foreground font-medium">${doc.cost_usd.toFixed(4)}</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      In: <span className="text-foreground font-medium">{doc.input_tokens.toLocaleString()}</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Out: <span className="text-foreground font-medium">{doc.output_tokens.toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                    <span className="text-[11px] text-muted-foreground">
                      Cache R: <span className="text-foreground font-medium">{doc.cache_read.toLocaleString()}</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Conv: <span className="text-foreground font-medium">{doc.total_conv}</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Actions: <span className="text-foreground font-medium">{doc.total_actions}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {docs.length < totalCount && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDocLimit((prev) => prev + 5)}
                className="w-full gap-1.5 text-muted-foreground"
              >
                <ChevronDown className="h-3.5 w-3.5" />
                Show more ({totalCount - docs.length} remaining)
              </Button>
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
