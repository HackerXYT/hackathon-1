import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Eye, MousePointer,
  Lightbulb, RefreshCw, Globe,
  Users, BarChart3, Search, Loader2, Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchGoogleAdsAnalytics } from "@/lib/api";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Line,
} from "recharts";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass-card p-3 text-xs">
        <p className="font-medium text-foreground mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="flex justify-between gap-4">
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-medium">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdsManagerPage() {
  const { data: analytics, isLoading: analyticsLoading, isError, refetch: refetchAnalytics } = useQuery({
    queryKey: ["adsManagerAnalytics"],
    queryFn: () => fetchGoogleAdsAnalytics("LAST_30_DAYS"),
    retry: 1,
  });

  const totals = (analytics?.totals || {}) as any;
  const changes = (analytics?.changes || {}) as any;
  const campaigns = analytics?.campaigns || [];
  const searchConsole = (analytics as any)?.searchConsole || null;

  const dailyChartData = (analytics?.daily || []).map((d: any) => ({
    date: d.date?.slice(5),
    sessions: d.sessions || d.clicks || 0,
    users: d.users || d.impressions || 0,
    pageViews: d.pageViews || 0,
    bounceRate: d.bounceRate || 0,
    conversions: d.conversions || 0,
  }));

  const recommendations = analytics ? generateRecommendations(analytics, campaigns) : [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Traffic Analytics</h1>
          <p className="text-sm text-muted-foreground mt-1">Website traffic channels, engagement metrics, and AI recommendations</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => refetchAnalytics()} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </motion.div>

      {/* Loading */}
      {analyticsLoading && (
        <motion.div variants={item} className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
          <span className="ml-3 text-sm text-muted-foreground">Loading analytics...</span>
        </motion.div>
      )}

      {/* Error state */}
      {isError && !analyticsLoading && (
        <motion.div variants={item} className="glass-card p-8 text-center">
          <Globe className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-base font-display font-semibold text-foreground mb-1">Unable to load analytics</h3>
          <p className="text-sm text-muted-foreground mb-4">Make sure the backend server is running on localhost:3000</p>
          <Button onClick={() => refetchAnalytics()} variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </motion.div>
      )}

      {analytics && !isError && (
        <>
          {/* Data Source Indicator */}
          <motion.div variants={item} className={`flex items-center gap-3 p-3 rounded-lg border ${analytics.source === "mongodb" ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"}`}>
            <Database className="h-4 w-4 text-success" />
            <span className="text-xs font-medium text-success">
              {analytics.source === "mongodb"
                ? "Live Data — Connected to MongoDB (Google Analytics + Search Console)"
                : "No data available — waiting for MongoDB sync"}
            </span>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Sessions", value: (totals.sessions || totals.clicks || 0).toLocaleString(), change: changes.sessions || changes.clicks || 0, icon: MousePointer },
              { label: "Users", value: (totals.users || totals.impressions || 0).toLocaleString(), change: changes.users || changes.impressions || 0, icon: Users },
              { label: "Page Views", value: (totals.pageViews || 0).toLocaleString(), change: changes.pageViews || 0, icon: Eye },
              { label: "Conversions", value: (totals.conversions || 0).toLocaleString(), change: changes.conversions || 0, icon: BarChart3 },
            ].map((m) => (
              <motion.div key={m.label} variants={item} className="glass-card-hover p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <m.icon className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">{m.label}</span>
                  </div>
                  {m.change !== 0 && (
                    <span className={`text-[10px] font-medium flex items-center gap-0.5 ${m.change >= 0 ? "text-success" : "text-destructive"}`}>
                      {m.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(m.change).toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-xl font-display font-bold text-foreground">{m.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div variants={item} className="glass-card p-4">
              <span className="text-[11px] text-muted-foreground">New Users</span>
              <p className="text-lg font-display font-bold text-foreground">{(totals.newUsers || 0).toLocaleString()}</p>
            </motion.div>
            <motion.div variants={item} className="glass-card p-4">
              <span className="text-[11px] text-muted-foreground">Bounce Rate</span>
              <p className="text-lg font-display font-bold text-foreground">{(totals.bounceRate || 0).toFixed(1)}%</p>
            </motion.div>
            <motion.div variants={item} className="glass-card p-4">
              <span className="text-[11px] text-muted-foreground">Channels</span>
              <p className="text-lg font-display font-bold text-foreground">{campaigns.length}</p>
            </motion.div>
            <motion.div variants={item} className="glass-card p-4">
              <span className="text-[11px] text-muted-foreground">Data Source</span>
              <p className="text-lg font-display font-bold text-foreground">{analytics.source === "mongodb" ? "MongoDB" : String(analytics.source || "—")}</p>
            </motion.div>
          </div>

          {/* Charts */}
          {dailyChartData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <motion.div variants={item} className="glass-card p-5">
                <h3 className="text-sm font-display font-semibold text-foreground mb-4">Daily Sessions & Users</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={dailyChartData}>
                    <defs>
                      <linearGradient id="sessGradAM" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(187, 96%, 42%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(187, 96%, 42%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 25%, 16%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="sessions" name="Sessions" stroke="hsl(187, 96%, 42%)" fill="url(#sessGradAM)" strokeWidth={2} />
                    <Line type="monotone" dataKey="users" name="Users" stroke="hsl(250, 80%, 62%)" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div variants={item} className="glass-card p-5">
                <h3 className="text-sm font-display font-semibold text-foreground mb-4">Daily Page Views & Bounce Rate</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={dailyChartData}>
                    <defs>
                      <linearGradient id="pvGradAM" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(152, 69%, 40%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(152, 69%, 40%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 25%, 16%)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area yAxisId="left" type="monotone" dataKey="pageViews" name="Page Views" stroke="hsl(152, 69%, 40%)" fill="url(#pvGradAM)" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="bounceRate" name="Bounce Rate (%)" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          )}

          {/* AI Recommendations */}
          {recommendations.length > 0 && (
            <motion.div variants={item} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-4 w-4 text-warning" />
                <h3 className="text-sm font-display font-semibold text-foreground">Recommendations</h3>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-warning/10 text-warning font-medium animate-pulse-glow">
                  AI-Powered
                </span>
              </div>
              <div className="space-y-3">
                {recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div className={`text-[10px] px-2 py-0.5 rounded-full font-medium border shrink-0 mt-0.5 ${
                      rec.impact === "high" ? "bg-destructive/10 text-destructive border-destructive/20" :
                      rec.impact === "medium" ? "bg-warning/10 text-warning border-warning/20" :
                      "bg-success/10 text-success border-success/20"
                    }`}>
                      {rec.impact}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{rec.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Channels Table */}
          {campaigns.length > 0 && (
            <motion.div variants={item} className="glass-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-display font-semibold text-foreground">Traffic Channels</h3>
                <span className="text-[10px] text-muted-foreground">{campaigns.length} channels</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] text-muted-foreground uppercase tracking-wider">
                      <th className="pb-3 pr-4">Source / Medium</th>
                      <th className="pb-3 pr-4">Type</th>
                      <th className="pb-3 pr-4 text-right">Sessions</th>
                      <th className="pb-3 pr-4 text-right">Users</th>
                      <th className="pb-3 pr-4 text-right">Page Views</th>
                      <th className="pb-3 pr-4 text-right">Bounce Rate</th>
                      <th className="pb-3 text-right">Conversions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {campaigns.map((c: any) => (
                      <tr key={c.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-foreground text-xs">{c.name}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            c.channelType === "PAID_SEARCH" ? "bg-warning/10 text-warning" :
                            c.channelType === "ORGANIC_SEARCH" ? "bg-success/10 text-success" :
                            c.channelType === "SOCIAL" ? "bg-accent/10 text-accent" :
                            c.channelType === "REFERRAL" ? "bg-primary/10 text-primary" :
                            "bg-muted text-muted-foreground"
                          }`}>
                            {c.channelType}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-right text-xs">{(c.sessions || c.clicks || 0).toLocaleString()}</td>
                        <td className="py-3 pr-4 text-right text-xs text-muted-foreground">{(c.users || c.impressions || 0).toLocaleString()}</td>
                        <td className="py-3 pr-4 text-right text-xs">{(c.pageViews || 0).toLocaleString()}</td>
                        <td className="py-3 pr-4 text-right">
                          <span className={`text-xs font-mono font-medium ${
                            (c.bounceRate || 0) > 70 ? "text-destructive" :
                            (c.bounceRate || 0) < 40 ? "text-success" : "text-warning"
                          }`}>
                            {(c.bounceRate || 0).toFixed(1)}%
                          </span>
                        </td>
                        <td className="py-3 text-right text-xs">{(c.conversions || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Search Console */}
          {searchConsole && searchConsole.queries && searchConsole.queries.length > 0 && (
            <motion.div variants={item} className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-display font-semibold text-foreground">Search Console — Top Queries</h3>
                <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {searchConsole.totals?.clicks || 0} clicks • {searchConsole.totals?.impressions || 0} impressions
                </span>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] text-muted-foreground uppercase tracking-wider">
                    <th className="pb-3 pr-4">Query</th>
                    <th className="pb-3 pr-4 text-right">Clicks</th>
                    <th className="pb-3 pr-4 text-right">Impressions</th>
                    <th className="pb-3 pr-4 text-right">CTR</th>
                    <th className="pb-3 text-right">Avg Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {searchConsole.queries.map((q: any, i: number) => (
                    <tr key={i} className="hover:bg-secondary/20 transition-colors">
                      <td className="py-3 pr-4"><p className="font-medium text-foreground text-xs">{q.query}</p></td>
                      <td className="py-3 pr-4 text-right text-xs font-medium text-primary">{q.clicks}</td>
                      <td className="py-3 pr-4 text-right text-xs text-muted-foreground">{q.impressions}</td>
                      <td className="py-3 pr-4 text-right text-xs">{((q.ctr || 0) * 100).toFixed(1)}%</td>
                      <td className="py-3 text-right text-xs text-muted-foreground">{(q.position || 0).toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {/* Channel Breakdown Chart */}
          {campaigns.length > 0 && (
            <motion.div variants={item} className="glass-card p-5">
              <h3 className="text-sm font-display font-semibold text-foreground mb-4">Channel Sessions Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={campaigns.map((c: any) => ({
                    name: c.name.length > 22 ? c.name.slice(0, 20) + "…" : c.name,
                    sessions: c.sessions || c.clicks || 0,
                  }))}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 25%, 16%)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "hsl(215, 20%, 55%)" }} axisLine={false} tickLine={false} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sessions" name="Sessions" fill="hsl(187, 96%, 42%)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Empty state */}
          {campaigns.length === 0 && dailyChartData.length === 0 && (
            <motion.div variants={item} className="glass-card p-12 text-center">
              <Globe className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">No analytics data yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Data will appear here once your Google Analytics and Search Console data is synced to MongoDB.
              </p>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}

function generateRecommendations(analytics: any, campaigns: any[]) {
  const recs: { title: string; description: string; impact: string }[] = [];
  const totals = analytics?.totals || {};
  const changes = analytics?.changes || {};

  if ((totals.bounceRate || 0) > 60) {
    recs.push({
      title: "High bounce rate detected",
      description: `Overall bounce rate is ${(totals.bounceRate || 0).toFixed(1)}%, which is above the 60% threshold. Consider improving landing page content, load speed, and mobile experience.`,
      impact: "high",
    });
  }

  const highBounceCh = campaigns.filter((c: any) => (c.bounceRate || 0) > 80 && (c.sessions || c.clicks || 0) > 2);
  if (highBounceCh.length > 0) {
    recs.push({
      title: `${highBounceCh.length} channel${highBounceCh.length > 1 ? "s" : ""} with >80% bounce rate`,
      description: `${highBounceCh.map((c: any) => c.name).join(", ")} — these channels are sending traffic that immediately leaves. Review targeting or landing page relevance.`,
      impact: "medium",
    });
  }

  const sortedBySessions = [...campaigns].sort((a: any, b: any) => (b.sessions || b.clicks || 0) - (a.sessions || a.clicks || 0));
  const bestChannel = sortedBySessions[0];
  if (bestChannel && (bestChannel.sessions || bestChannel.clicks || 0) > 0) {
    recs.push({
      title: `Top channel: ${bestChannel.name}`,
      description: `Driving ${(bestChannel.sessions || bestChannel.clicks || 0)} sessions with ${(bestChannel.bounceRate || 0).toFixed(1)}% bounce rate. Consider investing more in this channel.`,
      impact: "low",
    });
  }

  if ((changes.sessions || changes.clicks || 0) < -10) {
    recs.push({
      title: "Sessions declining",
      description: `Sessions dropped ${Math.abs(changes.sessions || changes.clicks || 0).toFixed(1)}% vs previous period. Investigate traffic sources and consider running new campaigns.`,
      impact: "high",
    });
  }

  if ((changes.sessions || changes.clicks || 0) > 20) {
    recs.push({
      title: "Strong session growth",
      description: `Sessions grew ${(changes.sessions || changes.clicks || 0).toFixed(1)}% vs previous period. Great momentum — ensure your site can handle the increased traffic.`,
      impact: "low",
    });
  }

  const totalSessions = totals.sessions || totals.clicks || 0;
  const totalPageViews = totals.pageViews || 0;
  const pagesPerSession = totalSessions > 0 ? totalPageViews / totalSessions : 0;
  if (pagesPerSession > 0 && pagesPerSession < 1.5) {
    recs.push({
      title: "Low engagement — few pages per session",
      description: `Users view only ${pagesPerSession.toFixed(1)} pages per session on average. Improve internal linking and content to encourage deeper browsing.`,
      impact: "medium",
    });
  }

  return recs;
}