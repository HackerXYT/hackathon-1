import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Building2, Globe, Briefcase, FileText, Target, Sparkles, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCompany, updateCompany, type CompanyData } from "@/lib/api";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const inputClass =
  "w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";

export default function CompanyPage() {
  const queryClient = useQueryClient();
  const { data: company, isLoading } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (data: Partial<CompanyData>) => updateCompany(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company"] });
      toast.success("Company details saved!");
    },
    onError: () => toast.error("Failed to save company details."),
  });

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [uniqueSellingProposition, setUniqueSellingProposition] = useState("");

  useEffect(() => {
    if (!company) return;
    setName(company.name || "");
    setWebsite(company.website || "");
    setIndustry(company.industry || "");
    setDescription(company.description || "");
    setTargetMarket(company.targetMarket || "");
    setUniqueSellingProposition(company.unique_selling_proposition || "");
  }, [company]);

  const handleSave = () => {
    mutation.mutate({ name, website, industry, description, targetMarket, unique_selling_proposition: uniqueSellingProposition });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto">
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Company Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tell your AI agents about your business so they can create better ads and strategies
          </p>
        </div>
        <Button onClick={handleSave} disabled={mutation.isPending} className="gap-2">
          {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </Button>
      </motion.div>

      <motion.div variants={item} className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-display font-semibold text-foreground">Basic Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              <Building2 className="h-3 w-3" /> Company Name
            </label>
            <input className={inputClass} placeholder="e.g. Acme Inc." value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              <Globe className="h-3 w-3" /> Website
            </label>
            <input className={inputClass} placeholder="e.g. https://acme.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              <Briefcase className="h-3 w-3" /> Industry
            </label>
            <input className={inputClass} placeholder="e.g. E-commerce, SaaS, Healthcare" value={industry} onChange={(e) => setIndustry(e.target.value)} />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              <Target className="h-3 w-3" /> Target Market
            </label>
            <input className={inputClass} placeholder="e.g. Small businesses in the US" value={targetMarket} onChange={(e) => setTargetMarket(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
            <FileText className="h-3 w-3" /> Company Description
          </label>
          <textarea
            className={inputClass + " min-h-[120px] resize-none"}
            placeholder="Describe what your company does, your products/services, and what makes you unique..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
            <Sparkles className="h-3 w-3" /> Unique Selling Proposition (USP)
          </label>
          <textarea
            className={inputClass + " min-h-[80px] resize-none"}
            placeholder="What makes your product/service different from competitors? Why should customers choose you?"
            value={uniqueSellingProposition}
            onChange={(e) => setUniqueSellingProposition(e.target.value)}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}