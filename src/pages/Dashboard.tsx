import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import DashboardHeader from "@/components/DashboardHeader";
import SkillCard from "@/components/SkillCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3, Target, TrendingUp, BookOpen, ArrowRight, CheckCircle2,
  Coffee, Code, Terminal, Database, Globe, Palette,
  Cpu, CircuitBoard, Microchip
} from "lucide-react";

const skillIconMap: Record<string, React.ElementType> = {
  "Java": Coffee,
  "Python": Code,
  "C": Terminal,
  "DBMS": Database,
  "HTML": Globe,
  "CSS": Palette,
  "Digital Electronics": Cpu,
  "Analog Electronics": CircuitBoard,
  "Embedded Systems": Microchip,
};

interface Skill {
  id: string;
  name: string;
  domain: string;
  description: string;
  icon: string;
}

interface AttemptProgress {
  skill_id: string;
  level: number;
  passed: boolean;
  percentage: number | null;
  completed_at: string | null;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [progress, setProgress] = useState<AttemptProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showSelection, setShowSelection] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [skillsRes, attemptsRes, selectionsRes] = await Promise.all([
        supabase.from("skills").select("*").order("domain", { ascending: true }),
        supabase
          .from("assessment_attempts")
          .select("skill_id, level, passed, percentage, completed_at")
          .eq("user_id", user!.id),
        supabase
          .from("user_selected_skills")
          .select("skill_id")
          .eq("user_id", user!.id),
      ]);

      if (skillsRes.data) setSkills(skillsRes.data as Skill[]);
      if (attemptsRes.data) setProgress(attemptsRes.data as AttemptProgress[]);
      if (selectionsRes.data) {
        setSelectedSkills(selectionsRes.data.map((s: any) => s.skill_id));
      }
      setLoading(false);
    }
    if (user) loadData();
  }, [user]);

  // Show selection screen if no skills selected yet
  useEffect(() => {
    if (!loading && selectedSkills.length === 0) {
      setShowSelection(true);
    }
  }, [loading, selectedSkills]);

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev => {
      const next = prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId];
      return next;
    });
  };

  const confirmSelection = async () => {
    if (!user) return;
    // Delete existing selections and insert new ones
    await supabase.from("user_selected_skills").delete().eq("user_id", user.id);
    if (selectedSkills.length > 0) {
      await supabase.from("user_selected_skills").insert(
        selectedSkills.map(skill_id => ({ user_id: user.id, skill_id }))
      );
    }
    setShowSelection(false);
  };

  const filteredSkills = skills.filter(s => selectedSkills.includes(s.id));
  const softwareSkills = filteredSkills.filter(s => s.domain === "software");
  const hardwareSkills = filteredSkills.filter(s => s.domain === "hardware");
  const passedProgress = progress.filter(p => p.passed);
  const totalCompleted = new Set(passedProgress.map(p => `${p.skill_id}-${p.level}`)).size;
  const totalPossible = selectedSkills.length * 3;

  const stats = [
    { label: "Selected Skills", value: selectedSkills.length, icon: BookOpen, color: "text-primary" },
    { label: "Levels Completed", value: totalCompleted, icon: Target, color: "text-success" },
    { label: "Total Attempts", value: progress.filter(p => selectedSkills.includes(p.skill_id)).length, icon: BarChart3, color: "text-info" },
    { label: "Progress", value: `${totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0}%`, icon: TrendingUp, color: "text-secondary" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  // Skill Selection Screen
  if (showSelection) {
    const allSoftware = skills.filter(s => s.domain === "software");
    const allHardware = skills.filter(s => s.domain === "hardware");

    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold font-display mb-2">Choose Your Skills</h1>
            <p className="text-muted-foreground">Select the skills you want to assess and track your progress.</p>
          </div>

          {/* Software */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold font-display">Software Skills</h2>
              <Badge variant="secondary">{allSoftware.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allSoftware.map(skill => (
                <Card
                  key={skill.id}
                  className={`cursor-pointer transition-all duration-200 border-2 ${
                    selectedSkills.includes(skill.id)
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border/50 hover:border-primary/30"
                  }`}
                  onClick={() => toggleSkill(skill.id)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <Checkbox
                      checked={selectedSkills.includes(skill.id)}
                      onCheckedChange={() => toggleSkill(skill.id)}
                      className="pointer-events-none"
                    />
                    {(() => {
                      const IconComp = skillIconMap[skill.name] || Code;
                      return (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          selectedSkills.includes(skill.id) ? "bg-primary/10" : "bg-muted"
                        }`}>
                          <IconComp className={`w-5 h-5 ${selectedSkills.includes(skill.id) ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                      );
                    })()}
                    <div className="flex-1">
                      <p className="font-medium">{skill.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{skill.description}</p>
                    </div>
                    {selectedSkills.includes(skill.id) && (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Hardware */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold font-display">Hardware Skills</h2>
              <Badge variant="secondary">{allHardware.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allHardware.map(skill => (
                <Card
                  key={skill.id}
                  className={`cursor-pointer transition-all duration-200 border-2 ${
                    selectedSkills.includes(skill.id)
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-border/50 hover:border-primary/30"
                  }`}
                  onClick={() => toggleSkill(skill.id)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <Checkbox
                      checked={selectedSkills.includes(skill.id)}
                      onCheckedChange={() => toggleSkill(skill.id)}
                      className="pointer-events-none"
                    />
                    {(() => {
                      const IconComp = skillIconMap[skill.name] || Code;
                      return (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          selectedSkills.includes(skill.id) ? "bg-primary/10" : "bg-muted"
                        }`}>
                          <IconComp className={`w-5 h-5 ${selectedSkills.includes(skill.id) ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                      );
                    })()}
                    <div className="flex-1">
                      <p className="font-medium">{skill.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{skill.description}</p>
                    </div>
                    {selectedSkills.includes(skill.id) && (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Confirm */}
          <div className="sticky bottom-4 flex justify-center">
            <Button
              size="lg"
              onClick={confirmSelection}
              disabled={selectedSkills.length === 0}
              className="shadow-lg gap-2 px-8"
            >
              Continue with {selectedSkills.length} skill{selectedSkills.length !== 1 ? "s" : ""}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome */}
        <div className="mb-8 animate-fade-in flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">Track your progress on selected skill assessments.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowSelection(true)}>
            Change Skills
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Per-skill progress summary */}
        <section className="mb-10">
          <h2 className="text-xl font-bold font-display mb-5">Your Progress</h2>
          <div className="space-y-3">
            {filteredSkills.map(skill => {
              const skillAttempts = progress.filter(p => p.skill_id === skill.id);
              const passedLevels = new Set(skillAttempts.filter(p => p.passed).map(p => p.level)).size;
              const pct = Math.round((passedLevels / 3) * 100);
              const bestScores = [1, 2, 3].map(lvl => {
                const lvlAttempts = skillAttempts.filter(a => a.level === lvl && a.passed);
                return lvlAttempts.length > 0
                  ? Math.max(...lvlAttempts.map(a => a.percentage ?? 0))
                  : null;
              });

              return (
                <Card key={skill.id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{skill.name}</span>
                        <Badge variant="outline" className="text-xs capitalize">{skill.domain}</Badge>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {passedLevels}/3 levels • {skillAttempts.length} attempt{skillAttempts.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <Progress value={pct} className="h-2 mb-2" />
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {[1, 2, 3].map(lvl => (
                        <span key={lvl} className={bestScores[lvl - 1] !== null ? "text-success font-medium" : ""}>
                          L{lvl}: {bestScores[lvl - 1] !== null ? `${bestScores[lvl - 1]}%` : "—"}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Software Skills */}
        {softwareSkills.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-bold font-display">Software Skills</h2>
              <Badge variant="secondary">{softwareSkills.length} skills</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {softwareSkills.map(skill => (
                <SkillCard
                  key={skill.id}
                  {...skill}
                  progress={progress.filter(p => p.skill_id === skill.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Hardware Skills */}
        {hardwareSkills.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-xl font-bold font-display">Hardware Skills</h2>
              <Badge variant="secondary">{hardwareSkills.length} skills</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hardwareSkills.map(skill => (
                <SkillCard
                  key={skill.id}
                  {...skill}
                  progress={progress.filter(p => p.skill_id === skill.id)}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
