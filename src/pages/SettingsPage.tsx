import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Link2,
  Palette,
  DollarSign,
  Shield,
  MessageSquare,
  Plus,
  X,
  LogOut,
  Loader2,
  Paperclip,
  Trash2,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/InfoTooltip";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useUserConfig, useUpdateUserConfig } from "@/hooks/use-user-config";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import { deleteUploadedFile, getFileUrl, type UploadedFileInfo } from "@/lib/api";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

type ConnectionStatus = "connected" | "disconnected";

interface PlatformConnection {
  id: string;
  name: string;
  icon: string;
  category: "ad" | "conversion" | "crm";
  status: ConnectionStatus;
}

const defaultPlatforms: PlatformConnection[] = [
  { id: "meta", name: "Meta Business Suite", icon: "📘", category: "ad", status: "disconnected" },
  { id: "google-ads", name: "Google Ads", icon: "🔍", category: "ad", status: "disconnected" },
  { id: "tiktok", name: "TikTok Ads Manager", icon: "🎵", category: "ad", status: "disconnected" },
  { id: "ga4", name: "Google Analytics 4", icon: "📊", category: "conversion", status: "disconnected" },
  { id: "shopify", name: "Shopify", icon: "🛍️", category: "conversion", status: "disconnected" },
  { id: "stripe", name: "Stripe", icon: "💳", category: "conversion", status: "disconnected" },
  { id: "hubspot", name: "HubSpot CRM", icon: "🟠", category: "crm", status: "disconnected" },
  { id: "salesforce", name: "Salesforce", icon: "☁️", category: "crm", status: "disconnected" },
];

function Section({
  title,
  icon: Icon,
  tooltip,
  children,
}: {
  title: string;
  icon: React.ElementType;
  tooltip?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={item} className="glass-card p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-display font-semibold text-foreground">{title}</h3>
        {tooltip && <InfoTooltip text={tooltip} />}
      </div>
      {children}
    </motion.div>
  );
}

function UploadedFileTag({
  file,
  field,
  onDeleted,
}: {
  file: UploadedFileInfo;
  field: string;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteUploadedFile(field, file.savedAs);
    toast.success(`Deleted ${file.originalName}`);
    onDeleted();
    setDeleting(false);
  };

  const isImage = file.mimetype?.startsWith("image/");

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/40 border border-border/50">
      {isImage ? (
        <img
          src={getFileUrl(file.url)}
          alt={file.originalName}
          className="h-8 w-8 rounded object-cover shrink-0"
        />
      ) : (
        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
          <Paperclip className="h-4 w-4 text-primary" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-foreground truncate">{file.originalName}</p>
        <p className="text-[10px] text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
      </div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
      >
        {deleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { data: config, isLoading, refetch } = useUserConfig();
  const updateConfig = useUpdateUserConfig();
  const debouncedSave = useDebouncedSave(500);

  const [platforms, setPlatforms] = useState<PlatformConnection[]>(defaultPlatforms);
  const [northStar, setNorthStar] = useState<"growth" | "profit">("growth");
  const [targetCpa, setTargetCpa] = useState(45);
  const [monthlyBudget, setMonthlyBudget] = useState(10000);
  const [dailyBudget, setDailyBudget] = useState(500);
  const [scalingLimit, setScalingLimit] = useState(150);
  const [negativeConstraints, setNegativeConstraints] = useState<string[]>([]);
  const [newConstraint, setNewConstraint] = useState("");
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [newCompetitor, setNewCompetitor] = useState("");
  const [valueProps, setValueProps] = useState<string[]>([]);
  const [newValueProp, setNewValueProp] = useState("");
  const [vibe, setVibe] = useState(5);
  const [deliveryChannel, setDeliveryChannel] = useState("email");
  const [reportFrequency, setReportFrequency] = useState("daily");
  const [escalationTrigger, setEscalationTrigger] = useState("both");
  const [cpaSpikeThreshold, setCpaSpikeThreshold] = useState(50);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFileInfo[]>>({});

  useEffect(() => {
    if (!config) return;
    if (config.accounts?.platforms) {
      const serverPlatforms = config.accounts.platforms;
      setPlatforms(defaultPlatforms.map((dp) => {
        const sp = serverPlatforms.find((s) => s.id === dp.id);
        return sp ? { ...dp, status: sp.status } : dp;
      }));
    }
    if (config.budget) {
      setNorthStar(config.budget.northStar || "growth");
      setTargetCpa(config.budget.targetCpa ?? 45);
      setDailyBudget(config.budget.dailyBudget ?? 500);
      setMonthlyBudget(config.budget.monthlyBudget ?? 10000);
      setScalingLimit(config.budget.scalingLimit ?? 150);
    }
    if (config.creative) {
      setNegativeConstraints(config.creative.negativeConstraints || []);
      setCompetitors(config.creative.competitors || []);
      setValueProps(config.creative.valueProps || []);
      setVibe(config.creative.vibe ?? 5);
    }
    if (config.reporting) {
      setDeliveryChannel(config.reporting.deliveryChannel || "email");
      setReportFrequency(config.reporting.reportFrequency || "daily");
      setEscalationTrigger(config.reporting.escalationTrigger || "both");
      setCpaSpikeThreshold(config.reporting.cpaSpikeThreshold ?? 50);
    }
    if (config.uploadedFiles) {
      setUploadedFiles(config.uploadedFiles as Record<string, UploadedFileInfo[]>);
    }
  }, [config]);

  const autoSaveBudget = (overrides: Partial<{ northStar: string; targetCpa: number; dailyBudget: number; monthlyBudget: number; scalingLimit: number }>) => {
    debouncedSave({ budget: { northStar: overrides.northStar ?? northStar, targetCpa: overrides.targetCpa ?? targetCpa, dailyBudget: overrides.dailyBudget ?? dailyBudget, monthlyBudget: overrides.monthlyBudget ?? monthlyBudget, scalingLimit: overrides.scalingLimit ?? scalingLimit } });
  };

  const autoSaveCreative = (overrides: Partial<{ negativeConstraints: string[]; competitors: string[]; valueProps: string[]; vibe: number }>) => {
    debouncedSave({ creative: { negativeConstraints: overrides.negativeConstraints ?? negativeConstraints, competitors: overrides.competitors ?? competitors, valueProps: overrides.valueProps ?? valueProps, vibe: overrides.vibe ?? vibe } });
  };

  const autoSaveReporting = (overrides: Partial<{ deliveryChannel: string; reportFrequency: string; escalationTrigger: string; cpaSpikeThreshold: number }>) => {
    debouncedSave({ reporting: { deliveryChannel: overrides.deliveryChannel ?? deliveryChannel, reportFrequency: overrides.reportFrequency ?? reportFrequency, escalationTrigger: overrides.escalationTrigger ?? escalationTrigger, cpaSpikeThreshold: overrides.cpaSpikeThreshold ?? cpaSpikeThreshold } });
  };

  const autoSaveAccounts = (updatedPlatforms: PlatformConnection[]) => {
    debouncedSave({ accounts: { platforms: updatedPlatforms.map((p) => ({ id: p.id, name: p.name, category: p.category, status: p.status })), connectedPlatforms: updatedPlatforms.filter((p) => p.status === "connected").map((p) => p.id) } });
  };

  const handleConnect = (id: string) => {
    setPlatforms((prev) => {
      const updated = prev.map((p) => p.id === id ? { ...p, status: (p.status === "connected" ? "disconnected" : "connected") as ConnectionStatus } : p);
      autoSaveAccounts(updated);
      return updated;
    });
    const platform = platforms.find((p) => p.id === id);
    if (platform) {
      const newStatus = platform.status === "connected" ? "disconnected" : "connected";
      toast.success(`${platform.name} ${newStatus}`);
    }
  };

  const handleDailyBudgetChange = (v: number) => { setDailyBudget(v); autoSaveBudget({ dailyBudget: v }); };
  const handleScalingLimitChange = (v: number) => { setScalingLimit(v); autoSaveBudget({ scalingLimit: v }); };
  const handleTargetCpaChange = (v: number) => { setTargetCpa(v); autoSaveBudget({ targetCpa: v }); };
  const handleMonthlyBudgetChange = (v: number) => { setMonthlyBudget(v); autoSaveBudget({ monthlyBudget: v }); };
  const handleNorthStarChange = (v: "growth" | "profit") => { setNorthStar(v); autoSaveBudget({ northStar: v }); };
  const handleVibeChange = (v: number) => { setVibe(v); autoSaveCreative({ vibe: v }); };
  const handleCpaSpikeThresholdChange = (v: number) => { setCpaSpikeThreshold(v); autoSaveReporting({ cpaSpikeThreshold: v }); };
  const handleDeliveryChannelChange = (v: string) => { setDeliveryChannel(v); autoSaveReporting({ deliveryChannel: v }); };
  const handleReportFrequencyChange = (v: string) => { setReportFrequency(v); autoSaveReporting({ reportFrequency: v }); };
  const handleEscalationTriggerChange = (v: string) => { setEscalationTrigger(v); autoSaveReporting({ escalationTrigger: v }); };

  const addToList = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, value: string, setValue: React.Dispatch<React.SetStateAction<string>>, field: "valueProps" | "negativeConstraints" | "competitors") => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) { const updated = [...list, trimmed]; setList(updated); setValue(""); autoSaveCreative({ [field]: updated }); }
  };

  const removeFromList = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number, field: "valueProps" | "negativeConstraints" | "competitors") => {
    const updated = list.filter((_, i) => i !== index); setList(updated); autoSaveCreative({ [field]: updated });
  };

  const handleSave = () => {
    updateConfig.mutate(
      {
        accounts: { platforms: platforms.map((p) => ({ id: p.id, name: p.name, category: p.category, status: p.status })), connectedPlatforms: platforms.filter((p) => p.status === "connected").map((p) => p.id) },
        budget: { northStar, targetCpa, dailyBudget, monthlyBudget, scalingLimit },
        creative: { negativeConstraints, competitors, valueProps, vibe },
        reporting: { deliveryChannel, reportFrequency, escalationTrigger, cpaSpikeThreshold },
      },
      { onSuccess: () => toast.success("Settings saved successfully."), onError: () => toast.error("Failed to save settings.") }
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("has_done_setup");
    toast.success("Logged out.");
    navigate("/login");
  };

  const handleFileDeleted = () => { refetch(); };

  const adPlatforms = platforms.filter((p) => p.category === "ad");
  const conversionPlatforms = platforms.filter((p) => p.category === "conversion");
  const crmPlatforms = platforms.filter((p) => p.category === "crm");

  const inputClass = "w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
  const selectClass = "w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

  const renderPlatformGrid = (list: PlatformConnection[], cols = "sm:grid-cols-3") => (
    <div className={`grid grid-cols-1 ${cols} gap-3`}>
      {list.map((p) => (
        <button key={p.id} onClick={() => handleConnect(p.id)} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${p.status === "connected" ? "border-success/30 bg-success/5" : "border-border bg-secondary/30 hover:border-primary/30"}`}>
          <span className="text-xl">{p.icon}</span>
          <div className="flex-1 text-left"><p className="text-sm font-medium text-foreground">{p.name}</p></div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${p.status === "connected" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"}`}>{p.status === "connected" ? "✓ Connected" : "Connect"}</span>
        </button>
      ))}
    </div>
  );

  const renderUploadedFiles = (field: string, label: string) => {
    const files = uploadedFiles[field] || [];
    if (files.length === 0) return null;
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {files.map((f) => (<UploadedFileTag key={f.savedAs} file={f} field={field} onDeleted={handleFileDeleted} />))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (<div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 text-primary animate-spin" /></div>);
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your accounts, guardrails, brand, and reporting preferences</p>
          {config && (
            <p className="text-xs text-muted-foreground/60 mt-0.5">
              Logged in as <span className="text-foreground font-medium">{config.email}</span>
              {config.goal && (<> • Goal: <span className="text-primary font-medium capitalize">{config.goal}</span></>)}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm" disabled={updateConfig.isPending}>
            {updateConfig.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
            Save All
          </Button>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-3.5 w-3.5 mr-1.5" /> Logout
          </Button>
        </div>
      </motion.div>

      <Section title="Connected Accounts" icon={Link2} tooltip="Manage your ad platform, conversion tracking, and CRM connections. Changes auto-save.">
        <div><p className="text-xs font-medium text-muted-foreground mb-2">Ad Platforms</p>{renderPlatformGrid(adPlatforms)}</div>
        <div><p className="text-xs font-medium text-muted-foreground mb-2">Conversion Data</p>{renderPlatformGrid(conversionPlatforms)}</div>
        <div><p className="text-xs font-medium text-muted-foreground mb-2">CRM Access</p>{renderPlatformGrid(crmPlatforms, "sm:grid-cols-2")}</div>
      </Section>

      <Section title="Financial Guardrails" icon={DollarSign} tooltip="All changes auto-save as you adjust.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">North Star</label>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs ${northStar === "growth" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>Growth</span>
              <Switch checked={northStar === "profit"} onCheckedChange={(v) => handleNorthStarChange(v ? "profit" : "growth")} />
              <span className={`text-xs ${northStar === "profit" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>Profit</span>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Target CPA</label>
            <div className="flex items-center gap-1"><span className="text-sm text-muted-foreground">$</span><input className={inputClass} type="number" min={1} value={targetCpa} onChange={(e) => handleTargetCpaChange(Number(e.target.value))} /></div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Hard Monthly Cap</label>
            <div className="flex items-center gap-1"><span className="text-sm text-muted-foreground">$</span><input className={inputClass} type="number" min={0} step={100} value={monthlyBudget} onChange={(e) => handleMonthlyBudgetChange(Number(e.target.value))} /></div>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">Daily Budget</label>
            <input type="range" min={0} max={10000} value={dailyBudget} onChange={(e) => handleDailyBudgetChange(Number(e.target.value))} className="w-full" />
            <div className="text-xs text-muted-foreground mt-1">${dailyBudget}/day</div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Scaling Limit</label>
            <input type="range" min={100} max={500} step={10} value={scalingLimit} onChange={(e) => handleScalingLimitChange(Number(e.target.value))} className="w-full" />
            <div className="text-xs text-muted-foreground mt-1">{scalingLimit}% <span className="text-foreground font-medium">(${Math.round((dailyBudget * scalingLimit) / 100)}/day max)</span></div>
          </div>
        </div>
      </Section>

      <Section title="Brand DNA" icon={Palette} tooltip="Changes to lists and sliders auto-save.">
        {(uploadedFiles.logos?.length || uploadedFiles.fonts?.length || uploadedFiles.styleGuides?.length) ? (
          <div className="space-y-4 pb-2">
            {renderUploadedFiles("logos", "Uploaded Logos")}
            {renderUploadedFiles("fonts", "Uploaded Fonts")}
            {renderUploadedFiles("styleGuides", "Uploaded Style Guides")}
          </div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Value Propositions</label>
            <div className="flex gap-2 mb-2">
              <input className={inputClass} placeholder="e.g. Fastest shipping" value={newValueProp} onChange={(e) => setNewValueProp(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addToList(valueProps, setValueProps, newValueProp, setNewValueProp, "valueProps")} />
              <Button size="sm" variant="outline" onClick={() => addToList(valueProps, setValueProps, newValueProp, setNewValueProp, "valueProps")}><Plus className="h-3.5 w-3.5" /></Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {valueProps.map((v, i) => (<span key={i} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{v}<button onClick={() => removeFromList(valueProps, setValueProps, i, "valueProps")}><X className="h-3 w-3" /></button></span>))}
              {valueProps.length === 0 && <p className="text-[11px] text-muted-foreground/50">No value props added</p>}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Negative Constraints</label>
            <div className="flex gap-2 mb-2">
              <input className={inputClass} placeholder="e.g. Never use the word 'cheap'" value={newConstraint} onChange={(e) => setNewConstraint(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addToList(negativeConstraints, setNegativeConstraints, newConstraint, setNewConstraint, "negativeConstraints")} />
              <Button size="sm" variant="outline" onClick={() => addToList(negativeConstraints, setNegativeConstraints, newConstraint, setNewConstraint, "negativeConstraints")}><Plus className="h-3.5 w-3.5" /></Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {negativeConstraints.map((c, i) => (<span key={i} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20">{c}<button onClick={() => removeFromList(negativeConstraints, setNegativeConstraints, i, "negativeConstraints")}><X className="h-3 w-3" /></button></span>))}
              {negativeConstraints.length === 0 && <p className="text-[11px] text-muted-foreground/50">No constraints added</p>}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Competitor List</label>
            <div className="flex gap-2 mb-2">
              <input className={inputClass} placeholder="e.g. Competitor brand name" value={newCompetitor} onChange={(e) => setNewCompetitor(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addToList(competitors, setCompetitors, newCompetitor, setNewCompetitor, "competitors")} />
              <Button size="sm" variant="outline" onClick={() => addToList(competitors, setCompetitors, newCompetitor, setNewCompetitor, "competitors")}><Plus className="h-3.5 w-3.5" /></Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {competitors.map((c, i) => (<span key={i} className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full bg-secondary text-foreground border border-border">{c}<button onClick={() => removeFromList(competitors, setCompetitors, i, "competitors")}><X className="h-3 w-3 text-muted-foreground" /></button></span>))}
              {competitors.length === 0 && <p className="text-[11px] text-muted-foreground/50">No competitors added</p>}
            </div>
          </div>
        </div>
        <div className="pt-2 max-w-sm">
          <label className="text-xs font-medium text-muted-foreground mb-2 block">Creative Risk Level</label>
          <input type="range" min={1} max={10} value={vibe} onChange={(e) => handleVibeChange(Number(e.target.value))} className="w-full" />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>Conservative</span><span className="text-primary font-semibold text-xs">{vibe}/10</span><span>Experimental</span></div>
        </div>
      </Section>

      <Section title="Reporting Preferences" icon={MessageSquare} tooltip="Changes auto-save when you adjust any control.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Delivery Channel</label>
            <select className={selectClass} value={deliveryChannel} onChange={(e) => handleDeliveryChannelChange(e.target.value)}>
              <option value="email">📧 Email</option><option value="slack">💬 Slack</option><option value="whatsapp">📱 WhatsApp</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Report Frequency</label>
            <select className={selectClass} value={reportFrequency} onChange={(e) => handleReportFrequencyChange(e.target.value)}>
              <option value="daily">Daily Pulse</option><option value="weekly">Weekly Deep Dive</option><option value="both">Both</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Escalation Trigger</label>
            <select className={selectClass} value={escalationTrigger} onChange={(e) => handleEscalationTriggerChange(e.target.value)}>
              <option value="account_disabled">Ad account disabled</option><option value="cpa_spike">CPA spike above threshold</option><option value="both">Both of the above</option><option value="any_anomaly">Any anomaly detected</option>
            </select>
          </div>
        </div>
        {(escalationTrigger === "cpa_spike" || escalationTrigger === "both") && (
          <div className="max-w-sm">
            <label className="text-xs font-medium text-muted-foreground mb-2 block">CPA Spike Threshold</label>
            <div className="flex items-center gap-3">
              <input type="range" min={20} max={100} step={5} value={cpaSpikeThreshold} onChange={(e) => handleCpaSpikeThresholdChange(Number(e.target.value))} className="flex-1" />
              <span className="text-sm font-medium text-foreground w-12 text-right">{cpaSpikeThreshold}%</span>
            </div>
          </div>
        )}
      </Section>

      {uploadedFiles.seedAudience?.length ? (
        <Section title="Seed Audience" icon={Paperclip}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {uploadedFiles.seedAudience.map((f) => (<UploadedFileTag key={f.savedAs} file={f} field="seedAudience" onDeleted={handleFileDeleted} />))}
          </div>
        </Section>
      ) : null}

      <Section title="Danger Zone" icon={Shield}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border border-destructive/20 bg-destructive/5">
          <div>
            <p className="text-sm font-medium text-foreground">Reset Onboarding</p>
            <p className="text-xs text-muted-foreground mt-0.5">Clear all settings and go through the onboarding flow again.</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => { localStorage.removeItem("has_done_setup"); toast.success("Onboarding reset. Redirecting..."); setTimeout(() => navigate("/onboarding"), 500); }}>
            Reset & Re-onboard
          </Button>
        </div>
      </Section>

      <div className="h-8" />
    </motion.div>
  );
}