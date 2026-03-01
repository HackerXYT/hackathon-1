import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  BarChart3,
  Brain,
  Target,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Globe,
  Eye,
  Paintbrush,
  DollarSign,
  MessageSquare,
  X,
  Check,
  RotateCcw,
  Building2,
  Rocket,
  ShoppingCart,
  Briefcase,
  GraduationCap,
  Store,
  PieChart,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

/* ─── Section 1 data: What ScaleBot does ─── */
const capabilities = [
  {
    icon: BarChart3,
    title: "Connects Your Data",
    description:
      "Pulls real-time data from Google Analytics 4, Search Console, and Google Ads into one unified view.",
  },
  {
    icon: Brain,
    title: "Generates Strategy",
    description:
      "AI agents run SWOT analysis, identify performance trends, and produce actionable growth recommendations.",
  },
  {
    icon: Sparkles,
    title: "Creates Content",
    description:
      "Automatically generates ad copy, social posts, blog articles, and email campaigns aligned with your brand.",
  },
  {
    icon: Target,
    title: "Monitors Competitors",
    description:
      "Tracks competitor positioning, identifies market gaps, and surfaces opportunities you'd otherwise miss.",
  },
  {
    icon: TrendingUp,
    title: "Optimizes Spend",
    description:
      "Scales winning campaigns, kills underperformers, and reallocates budget — all within your caps.",
  },
  {
    icon: Globe,
    title: "Reports Automatically",
    description:
      "Compiles everything into narrative reports with insights, so you always know what happened and why.",
  },
];

/* ─── Section 2 data: Target Audience ─── */
const targetAudiences = [
  {
    icon: Rocket,
    title: "Startups & Scale-ups",
    description:
      "Early-stage companies that need enterprise-level marketing without the enterprise-level budget.",
    fit: "€1K–€50K monthly ad spend",
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Brands",
    description:
      "Online stores running Google Ads and Shopping campaigns that need continuous optimization at scale.",
    fit: "DTC, Shopify, WooCommerce",
  },
  {
    icon: Building2,
    title: "SMBs & Local Businesses",
    description:
      "Small and medium businesses that can't afford a €3K+/month agency but still need professional marketing.",
    fit: "1–50 employees",
  },
  {
    icon: Briefcase,
    title: "Marketing Agencies",
    description:
      "Agencies looking to white-label AI capabilities, serve more clients with fewer resources.",
    fit: "White-label ready",
  },
  {
    icon: GraduationCap,
    title: "SaaS Companies",
    description:
      "Software companies that need to optimize acquisition funnels, reduce CAC, and generate multi-channel content.",
    fit: "B2B & B2C SaaS",
  },
  {
    icon: Store,
    title: "Franchise & Multi-Location",
    description:
      "Businesses managing marketing across multiple locations that need centralized analytics and unified strategy.",
    fit: "5–500+ locations",
  },
];

/* ─── TAM data ─── */
const tamLayers = [
  {
    label: "TAM",
    title: "Total Addressable Market",
    value: "€150B",
    description:
      "Global digital marketing services market. Includes all agencies, tools, and platforms serving businesses with digital marketing needs.",
    color: "bg-primary/10 border-primary/20 text-primary",
    width: "w-full",
  },
  {
    label: "SAM",
    title: "Serviceable Addressable Market",
    value: "€32B",
    description:
      "SMBs and mid-market companies in Europe & North America spending €1K–€100K/month on digital marketing agencies and tools.",
    color: "bg-primary/20 border-primary/30 text-primary",
    width: "w-[85%]",
  },
  {
    label: "SOM",
    title: "Serviceable Obtainable Market",
    value: "€800M",
    description:
      "Tech-forward SMBs actively looking to replace or augment their agency with AI-powered marketing automation in the next 2–3 years.",
    color: "bg-primary/30 border-primary/40 text-primary",
    width: "w-[65%]",
  },
];

const marketStats = [
  { value: "33M+", label: "SMBs in Europe & North America" },
  { value: "72%", label: "Dissatisfied with agency ROI" },
  { value: "€4.2K", label: "Avg. monthly agency spend (SMB)" },
  { value: "41%", label: "Plan to adopt AI marketing tools by 2027" },
];

/* ─── Comparison table data ─── */
const comparisonFeatures = [
  { feature: "24/7 Campaign Monitoring", scalebot: true, agency: false },
  { feature: "Real-Time Strategy Adjustments", scalebot: true, agency: false },
  { feature: "AI-Powered SWOT Analysis", scalebot: true, agency: false },
  { feature: "Automated Content Generation", scalebot: true, agency: false },
  { feature: "Competitor Intelligence", scalebot: true, agency: true },
  { feature: "Google Ads Management", scalebot: true, agency: true },
  { feature: "GA4 & Search Console Analytics", scalebot: true, agency: true },
  { feature: "Custom Reporting", scalebot: true, agency: true },
  {
    feature: "Multi-Channel Content (Social, Email, Blog, Ads)",
    scalebot: true,
    agency: false,
  },
  { feature: "Autonomous Budget Optimization", scalebot: true, agency: false },
  { feature: "Setup Time", scalebotText: "Minutes", agencyText: "2–4 Weeks" },
  {
    feature: "Response Time",
    scalebotText: "Instant",
    agencyText: "24–72 Hours",
  },
];

/* ─── AI Loop agents ─── */
const loopAgents = [
  {
    step: 1,
    icon: Eye,
    title: "Analyst Agent",
    subtitle: "The Brain",
    description:
      "Monitors ROAS, CTR, CPA, and all key metrics in real time. Detects fatigue signals, spots anomalies, and sends triggers to the next agents.",
    actions: ["Monitor KPIs", "Detect fatigue", "Spot anomalies", "Send triggers"],
    gradient: "from-blue-500/20 to-blue-600/5",
    iconBg: "bg-blue-500/15",
    iconColor: "text-blue-400",
    tagBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  },
  {
    step: 2,
    icon: Paintbrush,
    title: "Creative Director",
    subtitle: "The Maker",
    description:
      "Receives triggers from the Analyst. Generates new ad headlines, descriptions, and creative concepts using your brand DNA.",
    actions: ["Generate creatives", "A/B variants", "Brand compliance", "Deploy assets"],
    gradient: "from-purple-500/20 to-purple-600/5",
    iconBg: "bg-purple-500/15",
    iconColor: "text-purple-400",
    tagBg: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  },
  {
    step: 3,
    icon: DollarSign,
    title: "Media Buyer",
    subtitle: "The Executor",
    description:
      "Scales winners by 10% every 4 hours, kills losers, moves budget between campaigns. Never exceeds your spending caps.",
    actions: ["Scale winners", "Kill losers", "Adjust bids", "Reallocate budget"],
    gradient: "from-emerald-500/20 to-emerald-600/5",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    tagBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  },
  {
    step: 4,
    icon: MessageSquare,
    title: "Account Manager",
    subtitle: "The Communicator",
    description:
      "Compiles all agent actions into a narrative report with insights and a 60-second video brief script.",
    actions: ["Generate reports", "Video briefs", "Slack updates", "Client comms"],
    gradient: "from-amber-500/20 to-amber-600/5",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    tagBg: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  },
];

/* ─── SVG Loop Arrow Component ─── */
function LoopArrowSvg() {
  return (
    <svg
      viewBox="0 0 120 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-0 top-0 h-full w-[120px]"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="loopGradDown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(187, 96%, 42%)" stopOpacity="0.6" />
          <stop offset="50%" stopColor="hsl(250, 80%, 62%)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="hsl(187, 96%, 42%)" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="loopGradUp" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="hsl(187, 96%, 42%)" stopOpacity="0.3" />
          <stop offset="50%" stopColor="hsl(152, 69%, 40%)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(187, 96%, 42%)" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Down arrow (right side) */}
      <path
        d="M 80 20 L 80 540 Q 80 570 60 575 Q 40 580 40 560"
        stroke="url(#loopGradDown)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Up arrow (left side) */}
      <path
        d="M 40 560 L 40 60 Q 40 30 60 25 Q 80 20 80 40"
        stroke="url(#loopGradUp)"
        strokeWidth="2"
        strokeDasharray="6 4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Arrow head at bottom */}
      <polygon
        points="35,545 45,545 40,558"
        fill="hsl(187, 96%, 42%)"
        opacity="0.5"
      />
      {/* Arrow head at top */}
      <polygon
        points="75,35 85,35 80,22"
        fill="hsl(187, 96%, 42%)"
        opacity="0.4"
      />
      {/* Dots along the path */}
      <circle cx="80" cy="20" r="3" fill="hsl(187, 96%, 42%)" opacity="0.6" />
      <circle cx="80" cy="150" r="2.5" fill="hsl(250, 80%, 62%)" opacity="0.4" />
      <circle cx="80" cy="300" r="2.5" fill="hsl(152, 69%, 40%)" opacity="0.4" />
      <circle cx="80" cy="450" r="2.5" fill="hsl(38, 92%, 50%)" opacity="0.4" />
      <circle cx="40" cy="560" r="3" fill="hsl(187, 96%, 42%)" opacity="0.5" />
    </svg>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ═══════════════════ Header ═══════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo-good.png"
              alt="ScaleBot Logo"
              className="h-9 w-9"
            />
            <span className="text-xl font-display font-bold">ScaleBot</span>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
            <button
              onClick={() =>
                document
                  .getElementById("what-is")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-foreground transition-colors"
            >
              What is ScaleBot
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("target-audience")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-foreground transition-colors"
            >
              Who It's For
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("comparison")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-foreground transition-colors"
            >
              vs Agencies
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("ai-loop")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-foreground transition-colors"
            >
              AI Loop
            </button>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button size="sm" onClick={() => navigate("/login")}>
              Get Started
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ═══════════════════ Hero ═══════════════════ */}
      <section className="pt-32 pb-20 px-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
          >
            <Zap className="h-4 w-4" />
            AI-Powered Growth Engine
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
          >
            Scale Your Marketing{" "}
            <span className="text-primary">with AI</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            ScaleBot replaces your traditional marketing agency with four
            autonomous AI agents that analyze, strategize, create, and optimize —
            24/7, at a fraction of the cost.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="text-base px-8"
              onClick={() => navigate("/login")}
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8"
              onClick={() =>
                document
                  .getElementById("what-is")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════ SECTION 1: What is ScaleBot ═══════════════════ */}
      <section id="what-is" className="py-24 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <Brain className="h-3.5 w-3.5" />
              The Platform
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              What is ScaleBot?
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              ScaleBot is an{" "}
              <strong className="text-foreground">
                AI-powered marketing platform
              </strong>{" "}
              that connects to your Google Analytics, Search Console, and Google
              Ads accounts. It uses four specialized AI agents to continuously
              analyze your data, generate growth strategies, create
              multi-channel content, monitor competitors, and optimize your ad
              spend — all automatically.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Think of it as your{" "}
              <strong className="text-foreground">
                entire marketing department in one tool
              </strong>{" "}
              — strategist, content creator, media buyer, and account manager —
              working around the clock without breaks, meetings, or invoices.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group p-6 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  <cap.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{cap.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {cap.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 2: Target Audience ═══════════════════ */}
      <section
        id="target-audience"
        className="py-24 px-6 bg-muted/30 border-t border-border/50"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <Target className="h-3.5 w-3.5" />
              Who It's For
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Built for Growth-Minded Teams
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              ScaleBot is designed for businesses that want agency-quality
              marketing results without the agency price tag, delays, or
              overhead.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetAudiences.map((audience, i) => (
              <motion.div
                key={audience.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group p-6 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  <audience.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{audience.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {audience.description}
                </p>
                <span className="inline-flex items-center text-[11px] px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/10">
                  {audience.fit}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ Total Addressable Market (under Target Audience) ═══════════════════ */}
      <section
        id="market"
        className="py-24 px-6 border-t border-border/50"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <PieChart className="h-3.5 w-3.5" />
              The Opportunity
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Total Addressable Market
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The shift from traditional agencies to AI-powered marketing is a
              massive, accelerating opportunity.
            </p>
          </motion.div>

          {/* TAM / SAM / SOM funnel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-4 mb-16"
          >
            {tamLayers.map((layer, i) => (
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`${layer.width} max-w-3xl`}
              >
                <div
                  className={`p-5 md:p-6 rounded-xl border ${layer.color} transition-all`}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                        {layer.label}
                      </span>
                      <span className="text-3xl md:text-4xl font-display font-bold">
                        {layer.value}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold mb-0.5">
                        {layer.title}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {layer.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Market stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {marketStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl border border-border/50 bg-card text-center"
              >
                <div className="text-2xl md:text-3xl font-display font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground leading-snug">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              With{" "}
              <strong className="text-foreground">
                72% of SMBs dissatisfied
              </strong>{" "}
              with their current agency ROI and{" "}
              <strong className="text-foreground">
                41% planning to adopt AI marketing tools
              </strong>{" "}
              by 2027, the window for AI-first platforms like ScaleBot is wide
              open.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 3: ScaleBot vs Traditional Agency ═══════════════════ */}
      <section
        id="comparison"
        className="py-24 px-6 bg-muted/30 border-t border-border/50"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <TrendingUp className="h-3.5 w-3.5" />
              The Comparison
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              ScaleBot vs Traditional Agency
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See how an AI-powered platform stacks up against a traditional
              marketing agency — in capabilities, speed, and cost.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl border border-border/50 bg-card overflow-hidden"
          >
            {/* Table header */}
            <div className="grid grid-cols-[1fr_120px_120px] md:grid-cols-[1fr_160px_160px] bg-muted/50 border-b border-border/50">
              <div className="px-5 py-4 text-sm font-semibold text-muted-foreground">
                Feature
              </div>
              <div className="px-4 py-4 text-sm font-semibold text-center">
                <span className="text-primary">ScaleBot</span>
              </div>
              <div className="px-4 py-4 text-sm font-semibold text-center text-muted-foreground">
                Traditional Agency
              </div>
            </div>

            {/* Table rows */}
            {comparisonFeatures.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-[1fr_120px_120px] md:grid-cols-[1fr_160px_160px] ${i < comparisonFeatures.length - 1
                  ? "border-b border-border/30"
                  : ""
                  } ${i % 2 === 0 ? "" : "bg-muted/20"}`}
              >
                <div className="px-5 py-3.5 text-sm text-foreground">
                  {row.feature}
                </div>
                <div className="px-4 py-3.5 flex items-center justify-center">
                  {"scalebotText" in row ? (
                    <span className="text-sm font-medium text-primary">
                      {row.scalebotText}
                    </span>
                  ) : row.scalebot ? (
                    <Check className="h-5 w-5 text-primary" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground/40" />
                  )}
                </div>
                <div className="px-4 py-3.5 flex items-center justify-center">
                  {"agencyText" in row ? (
                    <span className="text-sm text-muted-foreground">
                      {row.agencyText}
                    </span>
                  ) : row.agency ? (
                    <Check className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <X className="h-5 w-5 text-muted-foreground/40" />
                  )}
                </div>
              </div>
            ))}

            {/* Pricing row */}
            <div className="border-t-2 border-primary/20 bg-primary/5">
              <div className="grid grid-cols-[1fr_120px_120px] md:grid-cols-[1fr_160px_160px]">
                <div className="px-5 py-5 text-sm font-bold text-foreground">
                  Monthly Price
                </div>
                <div className="px-4 py-5 text-center">
                  <div className="text-2xl font-display font-bold text-primary">
                    €99.99
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    per month
                  </div>
                </div>
                <div className="px-4 py-5 text-center">
                  <div className="text-2xl font-display font-bold text-muted-foreground">
                    €3,000+
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    per month (avg.)
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">
              That's{" "}
              <strong className="text-primary">30x less</strong> than a
              traditional agency — with more features, faster execution, and zero
              downtime.
            </p>
            <Button size="lg" onClick={() => navigate("/login")}>
              Start Saving Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 4: How the AI Loop Works ═══════════════════ */}
      <section id="ai-loop" className="py-24 px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <RotateCcw className="h-3.5 w-3.5" />
              The Engine
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How the AI Loop Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Four specialized AI agents work in a continuous cycle — each one
              triggers the next, creating an autonomous optimization loop that
              never stops.
            </p>
          </motion.div>

          {/* Loop visualization with graphical arrows */}
          <div className="relative max-w-3xl mx-auto">
            {/* SVG loop arrow — hidden on mobile */}
            <div className="hidden lg:block absolute -left-4 top-0 bottom-0 w-[120px]">
              <LoopArrowSvg />
            </div>

            {/* Agent cards */}
            <div className="lg:ml-28 space-y-0">
              {loopAgents.map((agent, i) => (
                <div key={agent.step}>
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                    className={`relative flex items-start gap-5 p-6 rounded-xl border border-border/50 bg-gradient-to-r ${agent.gradient} hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group`}
                  >
                    {/* Step badge */}
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-xl ${agent.iconBg} group-hover:scale-105 transition-transform`}
                      >
                        <agent.icon className={`h-7 w-7 ${agent.iconColor}`} />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                        Step {agent.step}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-display font-semibold text-foreground">
                          {agent.title}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          — {agent.subtitle}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {agent.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {agent.actions.map((action) => (
                          <span
                            key={action}
                            className={`text-[11px] px-2.5 py-1 rounded-full border font-medium ${agent.tagBg}`}
                          >
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* Connector between cards */}
                  {i < loopAgents.length - 1 && (
                    <div className="flex lg:ml-7 justify-center lg:justify-start py-1">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex flex-col items-center"
                      >
                        <div className="h-4 w-px bg-gradient-to-b from-primary/40 to-primary/10" />
                        <svg
                          width="12"
                          height="8"
                          viewBox="0 0 12 8"
                          className="text-primary/40"
                        >
                          <path
                            d="M1 1L6 6L11 1"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  )}
                </div>
              ))}

              {/* Loop-back visual */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-center pt-4"
              >
                <div className="h-4 w-px bg-gradient-to-b from-primary/30 to-transparent" />
                <div className="flex items-center gap-2.5 px-6 py-3 rounded-full border border-primary/30 bg-gradient-to-r from-primary/15 via-accent/10 to-primary/15 shadow-[0_0_30px_-8px_hsl(var(--glow-primary))]">
                  <RotateCcw className="h-4 w-4 text-primary animate-spin-slow" />
                  <span className="text-sm font-display font-semibold text-gradient">
                    Loop repeats continuously — 24/7
                  </span>
                </div>
                <div className="h-4 w-px bg-gradient-to-b from-transparent to-primary/20" />

                {/* Visual arrow curving back up */}
                <svg
                  width="200"
                  height="50"
                  viewBox="0 0 200 50"
                  className="text-primary/30 mt-1 lg:hidden"
                >
                  <path
                    d="M100 5 Q 180 5 180 25 Q 180 45 100 45 Q 20 45 20 25 Q 20 5 100 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    fill="none"
                  />
                  <polygon
                    points="95,2 105,2 100,8"
                    fill="currentColor"
                    opacity="0.6"
                  />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* Loop summary stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-6 rounded-xl border border-border/50 bg-muted/30 max-w-3xl mx-auto"
          >
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-display font-bold text-primary mb-1">
                  4
                </div>
                <div className="text-sm text-muted-foreground">
                  Specialized AI Agents
                </div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-primary mb-1">
                  24/7
                </div>
                <div className="text-sm text-muted-foreground">
                  Continuous Optimization
                </div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold text-primary mb-1">
                  0
                </div>
                <div className="text-sm text-muted-foreground">
                  Human Intervention Needed
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-24 px-6 bg-muted/30 border-t border-border/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Replace Your Agency?
          </h2>
          <p className="text-muted-foreground text-lg mb-4">
            Join marketers who switched from €3,000+/month agencies to
            ScaleBot's AI-powered platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" /> No credit card
              required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Setup in minutes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Cancel anytime
            </span>
          </div>
          <Button
            size="lg"
            className="text-base px-10"
            onClick={() => navigate("/login")}
          >
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* ═══════════════════ Footer ═══════════════════ */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/logo-good.png"
              alt="ScaleBot Logo"
              className="h-6 w-6"
            />
            <span className="text-sm font-semibold">ScaleBot</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ScaleBot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}