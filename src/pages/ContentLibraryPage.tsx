import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchContent, type ContentPiece } from "@/lib/api";
import {
  Loader2, RefreshCw, Copy, Check, FileText, Video, Mail, Megaphone,
  MessageSquare, PenTool, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const formatConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  social_post: { label: "Social Post", icon: MessageSquare, color: "text-primary", bg: "bg-primary/10" },
  ad_copy: { label: "Ad Copy", icon: Megaphone, color: "text-warning", bg: "bg-warning/10" },
  blog_article: { label: "Blog Article", icon: FileText, color: "text-success", bg: "bg-success/10" },
  video_script: { label: "Video Script", icon: Video, color: "text-accent", bg: "bg-accent/10" },
  email_subject: { label: "Email", icon: Mail, color: "text-destructive", bg: "bg-destructive/10" },
};

const platformColors: Record<string, string> = {
  LinkedIn: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Instagram: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "Google Ads": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  TikTok: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Facebook: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
};

function ContentCard({ piece }: { piece: ContentPiece & { responseId: string; generatedAt: string } }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const fmt = formatConfig[piece.format] || { label: piece.format, icon: PenTool, color: "text-muted-foreground", bg: "bg-secondary" };
  const Icon = fmt.icon;

  const handleCopy = () => {
    const text = (piece.body || "") + (piece.cta ? `\n\n${piece.cta}` : "") + (piece.hashtags?.length ? `\n\n${piece.hashtags.join(" ")}` : "");
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const body = piece.body || "";
  const bodyPreview = body.length > 200 && !expanded ? body.slice(0, 200) + "…" : body;

  return (
    <motion.div variants={item} className="glass-card-hover p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${fmt.bg} shrink-0`}>
            <Icon className={`h-4 w-4 ${fmt.color}`} />
          </div>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${fmt.bg} ${fmt.color}`}>
            {fmt.label}
          </span>
          {piece.platform && (
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium border ${platformColors[piece.platform] || "bg-secondary text-muted-foreground border-border"}`}>
              {piece.platform}
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors shrink-0"
          title="Copy to clipboard"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
        </button>
      </div>

      {piece.title && (
        <h4 className="text-sm font-display font-semibold text-foreground">{piece.title}</h4>
      )}

      <div className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
        {bodyPreview}
      </div>
      {body.length > 200 && (
        <button onClick={() => setExpanded(!expanded)} className="text-[11px] text-primary hover:underline">
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {piece.cta && (
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Call to Action</p>
          <p className="text-xs text-foreground font-medium">{piece.cta}</p>
        </div>
      )}

      {piece.hashtags && piece.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {piece.hashtags.map((h) => (
            <span key={h} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-primary font-mono">
              {h}
            </span>
          ))}
        </div>
      )}

      {piece.rationale && (
        <div className="pt-2 border-t border-border/30">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Why this content</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">{piece.rationale}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function ContentLibraryPage() {
  const { data: contentResponses = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["content"],
    queryFn: fetchContent,
    retry: 1,
  });

  const [activeFilter, setActiveFilter] = useState<string>("all");

  const allPieces: (ContentPiece & { responseId: string; generatedAt: string })[] = [];
  for (const cr of contentResponses) {
    if (!cr.content || !Array.isArray(cr.content)) continue;
    for (const piece of cr.content) {
      allPieces.push({ ...piece, responseId: cr._id, generatedAt: cr.generatedAt });
    }
  }

  const filteredPieces = activeFilter === "all" ? allPieces : allPieces.filter((p) => p.format === activeFilter);

  const formatCounts: Record<string, number> = {};
  for (const p of allPieces) {
    formatCounts[p.format] = (formatCounts[p.format] || 0) + 1;
  }

  const filters = [
    { key: "all", label: "All", count: allPieces.length },
    ...Object.entries(formatCounts).map(([key, count]) => ({
      key,
      label: formatConfig[key]?.label || key,
      count,
    })),
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Content Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-generated content pieces — social posts, ad copy, blog articles, video scripts, and emails
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => refetch()} className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </Button>
      </motion.div>

      {contentResponses.length > 0 && (
        <motion.div variants={item} className="glass-card p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Pieces:</span>
              <span className="text-xs font-medium text-foreground">{allPieces.length}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Generated:</span>
              <span className="text-xs font-medium text-foreground">
                {new Date(contentResponses[0].generatedAt).toLocaleDateString()}
              </span>
            </div>
            {contentResponses[0].dateRange && (
              <>
                <div className="h-4 w-px bg-border" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Period:</span>
                  <span className="text-xs font-medium text-foreground">
                    {contentResponses[0].dateRange.startDate} → {contentResponses[0].dateRange.endDate}
                  </span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {allPieces.length > 0 && (
        <motion.div variants={item} className="flex gap-1.5 overflow-x-auto pb-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === f.key
                  ? "bg-primary/15 text-primary border border-primary/30"
                  : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              {f.label}
              <span className="text-[10px] opacity-60">({f.count})</span>
            </button>
          ))}
        </motion.div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      )}

      {isError && !isLoading && (
        <motion.div variants={item} className="glass-card p-8 text-center">
          <PenTool className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
          <h3 className="text-base font-display font-semibold text-foreground mb-1">Unable to load content</h3>
          <p className="text-sm text-muted-foreground mb-4">Make sure the backend server is running on localhost:3000</p>
          <Button onClick={() => refetch()} variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </motion.div>
      )}

      {!isLoading && !isError && allPieces.length === 0 && (
        <motion.div variants={item} className="glass-card p-12 text-center">
          <PenTool className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-foreground mb-2">No content yet</h3>
          <p className="text-sm text-muted-foreground">Content will appear here once generated from your strategy analysis.</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPieces.map((piece, i) => (
          <ContentCard key={`${piece.responseId}-${i}`} piece={piece} />
        ))}
      </div>
    </motion.div>
  );
}