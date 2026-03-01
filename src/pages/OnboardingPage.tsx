import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Rocket } from "lucide-react";
import { toast } from "sonner";

import { OnboardingStepper } from "@/components/onboarding/OnboardingStepper";
import { StepCompany } from "@/components/onboarding/StepCompany";
import { StepGoal } from "@/components/onboarding/StepGoal";
import { StepAccounts, type PlatformConnection } from "@/components/onboarding/StepAccounts";
import { StepBudget } from "@/components/onboarding/StepBudget";
import { StepAudience } from "@/components/onboarding/StepAudience";
import { StepCreative } from "@/components/onboarding/StepCreative";
import { StepReporting } from "@/components/onboarding/StepReporting";
import { StepReview } from "@/components/onboarding/StepReview";

const STEPS = [
  { number: 1, title: "Company", subtitle: "Profile" },
  { number: 2, title: "Goal", subtitle: "Objective" },
  { number: 3, title: "Accounts", subtitle: "Connections" },
  { number: 4, title: "Budget", subtitle: "Guardrails" },
  { number: 5, title: "Audience", subtitle: "Targeting" },
  { number: 6, title: "Creative", subtitle: "Brand DNA" },
  { number: 7, title: "Reporting", subtitle: "Alerts" },
  { number: 8, title: "Review", subtitle: "Launch" },
];

const initialPlatforms: PlatformConnection[] = [
  { id: "meta", name: "Meta Business Suite", icon: "📘", category: "ad", status: "disconnected" },
  { id: "google-ads", name: "Google Ads", icon: "🔍", category: "ad", status: "disconnected" },
  { id: "tiktok", name: "TikTok Ads Manager", icon: "🎵", category: "ad", status: "disconnected" },
  { id: "ga4", name: "Google Analytics 4", icon: "📊", category: "conversion", status: "disconnected" },
  { id: "shopify", name: "Shopify", icon: "🛍️", category: "conversion", status: "disconnected" },
  { id: "stripe", name: "Stripe", icon: "💳", category: "conversion", status: "disconnected" },
  { id: "hubspot", name: "HubSpot CRM", icon: "🟠", category: "crm", status: "disconnected" },
  { id: "salesforce", name: "Salesforce", icon: "☁️", category: "crm", status: "disconnected" },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [launching, setLaunching] = useState(false);

  // Step 1: Company
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [targetMarket, setTargetMarket] = useState("");
  const [uniqueSellingProposition, setUniqueSellingProposition] = useState("");

  // Step 2: Goal
  const [selectedGoal, setSelectedGoal] = useState("sales");

  // Step 3: Accounts
  const [platforms, setPlatforms] = useState(initialPlatforms);

  // Step 4: Budget
  const [northStar, setNorthStar] = useState<"growth" | "profit">("growth");
  const [targetCpa, setTargetCpa] = useState(45);
  const [dailyBudget, setDailyBudget] = useState(500);
  const [monthlyBudget, setMonthlyBudget] = useState(10000);
  const [scalingLimit, setScalingLimit] = useState(150);

  // Step 5: Audience
  const [personaAge, setPersonaAge] = useState("25-44");
  const [personaLocation, setPersonaLocation] = useState("");
  const [personaInterests, setPersonaInterests] = useState("");
  const [seedFile, setSeedFile] = useState<File | null>(null);

  // Step 6: Creative
  const [negativeConstraints, setNegativeConstraints] = useState<string[]>([]);
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [valueProps, setValueProps] = useState<string[]>([]);
  const [vibe, setVibe] = useState(5);
  const [logoFiles, setLogoFiles] = useState<File[]>([]);
  const [fontFiles, setFontFiles] = useState<File[]>([]);
  const [styleGuideFiles, setStyleGuideFiles] = useState<File[]>([]);

  // Step 7: Reporting
  const [deliveryChannel, setDeliveryChannel] = useState("email");
  const [reportFrequency, setReportFrequency] = useState("daily");
  const [escalationTrigger, setEscalationTrigger] = useState("both");
  const [cpaSpikeThreshold, setCpaSpikeThreshold] = useState(50);

  const handleTogglePlatform = (id: string) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "connected" ? "disconnected" : "connected" }
          : p
      )
    );
  };

  const canProceed = (): boolean => {
    if (currentStep === 1) {
      return !!(companyName.trim() && website.trim() && industry.trim() && companyDescription.trim() && targetMarket.trim() && uniqueSellingProposition.trim());
    }
    return true;
  };

  const goNext = () => {
    if (!canProceed()) {
      toast.error("Please fill in all required fields before continuing.");
      return;
    }
    if (currentStep < STEPS.length) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLaunch = async () => {
    setLaunching(true);

    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    const jsonData = {
      email,
      company: {
        name: companyName,
        website,
        industry,
        description: companyDescription,
        targetMarket,
        unique_selling_proposition: uniqueSellingProposition,
      },
      goal: selectedGoal,
      accounts: {
        platforms: platforms.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          status: p.status,
        })),
        connectedPlatforms: platforms
          .filter((p) => p.status === "connected")
          .map((p) => p.id),
      },
      budget: {
        northStar,
        targetCpa,
        dailyBudget,
        monthlyBudget,
        scalingLimit,
      },
      audience: {
        personaAge,
        personaLocation,
        personaInterests,
      },
      creative: {
        negativeConstraints,
        competitors,
        valueProps,
        vibe,
      },
      reporting: {
        deliveryChannel,
        reportFrequency,
        escalationTrigger,
        cpaSpikeThreshold,
      },
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(jsonData));

    logoFiles.forEach((file) => {
      formData.append("logos", file, file.name);
    });
    fontFiles.forEach((file) => {
      formData.append("fonts", file, file.name);
    });
    styleGuideFiles.forEach((file) => {
      formData.append("styleGuides", file, file.name);
    });
    if (seedFile) {
      formData.append("seedAudience", seedFile, seedFile.name);
    }

    const response = await fetch("http://localhost:3000/api/setup", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      toast.error(`Setup failed: ${errorText || response.statusText}`);
      setLaunching(false);
      return;
    }

    localStorage.setItem("has_done_setup", "true");
    toast.success("🚀 Agents launched! Your autonomous marketing is now live.");
    setLaunching(false);
    navigate("/");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepCompany
            companyName={companyName}
            setCompanyName={setCompanyName}
            website={website}
            setWebsite={setWebsite}
            industry={industry}
            setIndustry={setIndustry}
            description={companyDescription}
            setDescription={setCompanyDescription}
            targetMarket={targetMarket}
            setTargetMarket={setTargetMarket}
            uniqueSellingProposition={uniqueSellingProposition}
            setUniqueSellingProposition={setUniqueSellingProposition}
          />
        );
      case 2:
        return <StepGoal selectedGoal={selectedGoal} onSelectGoal={setSelectedGoal} />;
      case 3:
        return <StepAccounts platforms={platforms} onToggle={handleTogglePlatform} />;
      case 4:
        return (
          <StepBudget
            northStar={northStar}
            setNorthStar={setNorthStar}
            targetCpa={targetCpa}
            setTargetCpa={setTargetCpa}
            dailyBudget={dailyBudget}
            setDailyBudget={setDailyBudget}
            monthlyBudget={monthlyBudget}
            setMonthlyBudget={setMonthlyBudget}
            scalingLimit={scalingLimit}
            setScalingLimit={setScalingLimit}
          />
        );
      case 5:
        return (
          <StepAudience
            personaAge={personaAge}
            setPersonaAge={setPersonaAge}
            personaLocation={personaLocation}
            setPersonaLocation={setPersonaLocation}
            personaInterests={personaInterests}
            setPersonaInterests={setPersonaInterests}
            seedFile={seedFile}
            setSeedFile={setSeedFile}
          />
        );
      case 6:
        return (
          <StepCreative
            negativeConstraints={negativeConstraints}
            setNegativeConstraints={setNegativeConstraints}
            competitors={competitors}
            setCompetitors={setCompetitors}
            valueProps={valueProps}
            setValueProps={setValueProps}
            vibe={vibe}
            setVibe={setVibe}
            logoFiles={logoFiles}
            setLogoFiles={setLogoFiles}
            fontFiles={fontFiles}
            setFontFiles={setFontFiles}
            styleGuideFiles={styleGuideFiles}
            setStyleGuideFiles={setStyleGuideFiles}
          />
        );
      case 7:
        return (
          <StepReporting
            deliveryChannel={deliveryChannel}
            setDeliveryChannel={setDeliveryChannel}
            reportFrequency={reportFrequency}
            setReportFrequency={setReportFrequency}
            escalationTrigger={escalationTrigger}
            setEscalationTrigger={setEscalationTrigger}
            cpaSpikeThreshold={cpaSpikeThreshold}
            setCpaSpikeThreshold={setCpaSpikeThreshold}
          />
        );
      case 8:
        return (
          <StepReview
            companyName={companyName}
            website={website}
            industry={industry}
            companyDescription={companyDescription}
            targetMarket={targetMarket}
            uniqueSellingProposition={uniqueSellingProposition}
            selectedGoal={selectedGoal}
            platforms={platforms}
            northStar={northStar}
            targetCpa={targetCpa}
            dailyBudget={dailyBudget}
            monthlyBudget={monthlyBudget}
            scalingLimit={scalingLimit}
            personaAge={personaAge}
            personaLocation={personaLocation}
            personaInterests={personaInterests}
            negativeConstraints={negativeConstraints}
            competitors={competitors}
            valueProps={valueProps}
            vibe={vibe}
            deliveryChannel={deliveryChannel}
            reportFrequency={reportFrequency}
            escalationTrigger={escalationTrigger}
            logoFiles={logoFiles}
            fontFiles={fontFiles}
            styleGuideFiles={styleGuideFiles}
            seedFile={seedFile}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = currentStep === STEPS.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Stepper */}
      <OnboardingStepper steps={STEPS} currentStep={currentStep} />

      {/* Step Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 pb-8 border-t border-border/30">
        <Button
          variant="ghost"
          onClick={goBack}
          disabled={currentStep === 1 || launching}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>

        {isLastStep ? (
          <Button onClick={handleLaunch} disabled={launching} className="gap-2 px-6">
            {launching ? (
              <>
                <span className="w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin" />
                Launching...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                Launch Agents
              </>
            )}
          </Button>
        ) : (
          <Button onClick={goNext} disabled={currentStep === 1 && !canProceed()} className="gap-2">
            Continue
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}