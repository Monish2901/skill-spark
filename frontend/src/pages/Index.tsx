import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Brain, BarChart3, Target, Layers } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate("/dashboard");
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle className="text-primary-foreground hover:bg-primary-foreground/10" />
      </div>
      {/* Hero */}
      <section className="gradient-hero min-h-[80vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(210_80%_45%/0.15),transparent_50%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md mb-8 shadow-2xl overflow-hidden border border-white/20">
            <img src="/skillspark-logo.png" alt="SkillSpark Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-display text-white mb-6 leading-tight tracking-tight">
            SkillSpark
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Bridging the gap between academic learning and industry readiness.
            Evaluate technical skills through professional-grade assessments.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="gradient-accent border-0 text-primary-foreground px-8 shadow-elevated"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="ghost"
              onClick={() => navigate("/auth")}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold font-display text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Layers, title: "Multi-Level Assessments", desc: "Progress through 3 levels: MCQ, Descriptive, and Practical tasks for each skill domain." },
              { icon: BarChart3, title: "Performance Analytics", desc: "Track scores, attempts, and completion rates across 12 technical and common skills." },
              { icon: Target, title: "Engagement Prediction", desc: "Get AI-powered engagement predictions: Highly, Moderately, or Low Engaged." },
            ].map((f) => (
              <div key={f.title} className="text-center p-6 rounded-2xl bg-card shadow-card border border-border/50 animate-fade-in">
                <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mx-auto mb-5">
                  <f.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold font-display mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>SkillSpark • Student Career & Assessment Platform</p>
      </footer>
    </div>
  );
}
