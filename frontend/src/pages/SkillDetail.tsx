import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, CheckCircle, PlayCircle, XCircle, Eye, EyeOff } from "lucide-react";
import { predictEngagement, getEngagementBadgeClass } from "@/lib/engagement";
import { sampleQuestions, theoryQuestions, type SampleQuestion } from "@/lib/sample-questions";

interface Skill {
  id: string;
  name: string;
  domain: string;
  description: string;
}

import { getSkillByVirtualId, getVirtualId } from "@/lib/skills-data";

import { 
  aptitudeL1, aptitudeL2, aptitudeL3 
} from "@/lib/aptitude-mcq";
import { 
  oopsL1, oopsL2, oopsL3, 
  gkL1, gkL2, gkL3 
} from "@/lib/oops-gk-mcq";
import { 
  jsL1, jsL2, jsL3, 
  reactL1, reactL2, reactL3 
} from "@/lib/software-mcq";
import { 
  sqlL1, sqlL2, sqlL3, 
  nodeL1, nodeL2, nodeL3, 
  cppL1, cppL2, cppL3 
} from "@/lib/v2-software-mcq";
import { 
  javaL1, javaL2, javaL3, 
  pythonL1, pythonL2, pythonL3 
} from "@/lib/java-python-mcq";
import { 
  roboticsL1, roboticsL2, roboticsL3,
  vlsiL1, vlsiL2, vlsiL3,
  computerArchL1, computerArchL2, computerArchL3,
  pcbDesignL1, pcbDesignL2, pcbDesignL3 
} from "@/lib/hardware-mcq";

interface Attempt {
  id: string;
  level: number;
  score: number | null;
  percentage: number | null;
  passed: boolean | null;
  completed: boolean | null;
  created_at: string;
  time_taken_seconds: number | null;
  answers: Record<number, number | string> | null;
}

export default function SkillDetail() {
  const { skillId } = useParams<{ skillId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function load() {
      try {
        // If it's a virtual ID, we don't query the skills table
        if (skillId?.startsWith('virtual-')) {
          const virtualSkill = getSkillByVirtualId(skillId);
          
          if (virtualSkill) {
            setSkill({
              id: skillId,
              name: virtualSkill.name,
              domain: virtualSkill.domain,
              description: virtualSkill.description
            });
            
            // Still try to load attempts by name or something? 
            // Better yet, just use the virtual ID for attempts too if they exist
            const { data: attemptsData } = await supabase
              .from("assessment_attempts")
              .select("*")
              .eq("user_id", user!.id)
              .eq("skill_id", skillId)
              .order("created_at", { ascending: false });
            
            if (attemptsData) setAttempts(attemptsData as Attempt[]);
            setLoading(false);
            return;
          }
        }

        // Fetch all attempts for the user to be robust against ID changes
        const { data: allAttempts } = await supabase
          .from("assessment_attempts")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false });

        if (allAttempts && skill) {
          // Filter attempts that match THIS skill by either ID or skill name
          // (assuming we have access to skill name here).
          // We'll filter them after we have the skill object.
        }

        const [skillRes] = await Promise.all([
          supabase.from("skills").select("*").eq("id", skillId!).single(),
        ]);
        
        let currentSkill = skillRes.data as Skill;
        if (!currentSkill && skillId?.startsWith('virtual-')) {
          const v = getSkillByVirtualId(skillId);
          if (v) currentSkill = { id: skillId, ...v };
        }

        if (currentSkill) {
          setSkill(currentSkill);
          if (allAttempts) {
            // Match attempts by either exact ID match OR name-based matching for virtual fallbacks
            const matched = (allAttempts as any[]).filter(a => {
              if (a.skill_id === currentSkill.id) return true;
              // Fallback: If it's a virtual ID in attempts but real in skill, or vice-versa
              const vId = getVirtualId(currentSkill.name);
              return a.skill_id === vId;
            });
            setAttempts(matched as Attempt[]);
          }
        }
      } catch (err) {
        console.error("Error loading skill detail:", err);
      } finally {
        setLoading(false);
      }
    }
    if (user && skillId) load();
  }, [user, skillId]);

  const bestAttemptForLevel = (level: number) =>
    attempts.find(a => a.level === level && a.passed);

  const canAccessLevel = (level: number) => {
    if (level === 1) return true;
    return !!bestAttemptForLevel(level - 1);
  };

  const aptitudeTopics = {
    1: "Topics: Number System, Ratio & Proportion, Percentage, Profit & Loss, Ages, Directions.",
    2: "Topics: Time & Work, Averages, SI & CI, Speed-Distance-Time, Problems on Trains.",
    3: "Topics: Permutations & Combinations, Probability, Roots, Logarithms, Stocks & Shares."
  };


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

  if (!skill) return null;

  const isExempt = skill.name === "Aptitude" || skill.name === "Communication Skills";
  
  const levelInfo = [
    { 
      level: 1, 
      title: "Basic Foundations", 
      type: "MCQ (30 questions)", 
      passing: skill.name === "Communication Skills" ? "90%" : "70%", 
      desc: skill.name === "Aptitude" ? (aptitudeTopics as any)[1] : "" 
    },
    { 
      level: 2, 
      title: "Intermediate Applications", 
      type: "MCQ (30 questions)", 
      passing: isExempt ? "70%" : "80%", 
      desc: skill.name === "Aptitude" ? (aptitudeTopics as any)[2] : "" 
    },
    { 
      level: 3, 
      title: "Advanced Mastery", 
      type: "MCQ (30 questions)", 
      passing: isExempt ? "70%" : "90%", 
      desc: skill.name === "Aptitude" ? (aptitudeTopics as any)[3] : "" 
    },
  ];

  // Communication Skill has only 1 level
  const displayLevels = skill.name === "Communication Skills" ? levelInfo.slice(0, 1) : levelInfo;

  const level1Best = bestAttemptForLevel(1);
  const level2Best = bestAttemptForLevel(2);
  const level3Best = bestAttemptForLevel(3);

  // Calculate average time taken
  const timesArr = attempts.filter(a => a.time_taken_seconds != null).map(a => a.time_taken_seconds!);
  const avgTime = timesArr.length > 0 ? timesArr.reduce((a, b) => a + b, 0) / timesArr.length : null;

  const engagement = predictEngagement({
    level1Score: level1Best?.percentage ?? null,
    level2Score: level2Best?.percentage ?? null,
    level3Completed: !!level3Best,
    totalAttempts: attempts.length,
    level1Passed: !!level1Best,
    level2Passed: !!level2Best,
    avgTimeTakenSeconds: avgTime,
  });

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold font-display">{skill.name}</h1>
            <Badge variant="outline" className="capitalize">{skill.domain}</Badge>
          </div>
          <p className="text-muted-foreground">{skill.description}</p>
        </div>

        {/* Engagement prediction */}
        {attempts.length > 0 && (
          <Card className="mb-8 border-border/50 shadow-card">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Engagement Prediction</p>
                <Badge className={`text-sm px-3 py-1 ${getEngagementBadgeClass(engagement)}`}>
                  {engagement}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Attempts</p>
                <p className="text-2xl font-bold font-display">{attempts.length}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Levels */}
        <div className="space-y-4">
          {displayLevels.map(({ level, title, type, passing, desc }) => {
            const best = bestAttemptForLevel(level);
            const accessible = canAccessLevel(level);
            const levelAttempts = attempts.filter(a => a.level === level);

            return (
              <Card key={level} className={`border-border/50 shadow-card transition-all ${!accessible ? "opacity-60" : ""}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {best ? (
                        <CheckCircle className="w-6 h-6 text-success" />
                      ) : accessible ? (
                        <PlayCircle className="w-6 h-6 text-primary" />
                      ) : (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      )}
                      <div>
                        <CardTitle className="text-lg">Level {level}: {title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{type} • Pass: {passing}</p>
                      </div>
                    </div>
                    {best && (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        {best.percentage?.toFixed(0)}% Score
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {desc && <p className="text-sm text-muted-foreground mb-4 font-medium italic">{desc}</p>}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {levelAttempts.length} attempt{levelAttempts.length !== 1 ? "s" : ""}
                      </p>
                      {best && skill && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs gap-1"
                          onClick={() => setShowAnswers(prev => ({ ...prev, [level]: !prev[level] }))}
                        >
                          {showAnswers[level] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {showAnswers[level] ? "Hide Answers" : "View Answers"}
                        </Button>
                      )}
                    </div>
                    {accessible && level === 1 && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/assessment/${skill.id}/${level}`)}
                      >
                        {best ? "Retake Assessment" : "Start Assessment"}
                      </Button>
                    )}
                    {accessible && level === 2 && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/assessment/${skill.id}/${level}`)}
                      >
                        {best ? "Retake Assessment" : "Start Assessment"}
                      </Button>
                    )}
                    {accessible && level === 3 && (
                      <Button
                        size="sm"
                        onClick={() => navigate(`/assessment/${skill.id}/${level}`)}
                      >
                        {best ? "Retake Assessment" : "Start Assessment"}
                      </Button>
                    )}
                    {!accessible && level > 1 && (
                      <Button size="sm" variant="outline" disabled>
                        <Lock className="w-3 h-3 mr-1" /> Locked
                      </Button>
                    )}
                  </div>

                  {/* Answer Review Section */}
                  {best && showAnswers[level] && skill && (() => {
                    const specializedMcqs: Record<string, SampleQuestion[]> = {
                      "Aptitude-1": aptitudeL1, "Aptitude-2": aptitudeL2, "Aptitude-3": aptitudeL3,
                      "OOPS-1": oopsL1, "OOPS-2": oopsL2, "OOPS-3": oopsL3,
                      "General Knowledge (GK)-1": gkL1, "General Knowledge (GK)-2": gkL2, "General Knowledge (GK)-3": gkL3,
                      "JavaScript-1": jsL1, "JavaScript-2": jsL2, "JavaScript-3": jsL3,
                      "React-1": reactL1, "React-2": reactL2, "React-3": reactL3,
                      "SQL-1": sqlL1, "SQL-2": sqlL2, "SQL-3": sqlL3,
                      "Node.js-1": nodeL1, "Node.js-2": nodeL2, "Node.js-3": nodeL3,
                      "C++-1": cppL1, "C++-2": cppL2, "C++-3": cppL3,
                      "Java-1": javaL1, "Java-2": javaL2, "Java-3": javaL3,
                      "Python-1": pythonL1, "Python-2": pythonL2, "Python-3": pythonL3,
                      "Robotics-1": roboticsL1, "Robotics-2": roboticsL2, "Robotics-3": roboticsL3,
                      "VLSI-1": vlsiL1, "VLSI-2": vlsiL2, "VLSI-3": vlsiL3,
                      "Computer Architecture-1": computerArchL1, "Computer Architecture-2": computerArchL2, "Computer Architecture-3": computerArchL3,
                      "PCB Design-1": pcbDesignL1, "PCB Design-2": pcbDesignL2, "PCB Design-3": pcbDesignL3,
                    };

                    const key = `${skill.name}-${level}`;
                    let qs = specializedMcqs[key];
                    
                    // Fallback to legacy sample questions if no specialized set
                    if (!qs) {
                        if (level === 1) qs = sampleQuestions[skill.name]?.slice(0, 30);
                    }

                    if (!qs && level === 2) {
                        // Theory legacy fallback
                        const tQs = theoryQuestions[skill.name] || [];
                        const savedAnswers = (best as any).answers as Record<number, string> || {};
                        return (
                          <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
                            <p className="text-sm font-medium text-muted-foreground">Theory Answer Review — Passed Attempt</p>
                            {tQs.map((q, i) => {
                              const userAnswer = savedAnswers[i] || "";
                              const accepted = typeof userAnswer === "string" && userAnswer.trim().length >= 20;
                              return (
                                <div key={i} className="p-3 rounded-lg border border-border/30 space-y-2">
                                  <div className="flex items-start gap-2">
                                    <span className="text-xs font-medium text-muted-foreground mt-0.5">Q{i + 1}.</span>
                                    <p className="text-sm font-medium">{q.question_text}</p>
                                  </div>
                                  <div className="pl-6 space-y-2">
                                    <div className={`p-3 rounded border text-sm ${accepted ? "border-success/50 bg-success/10" : "border-destructive/50 bg-destructive/10"}`}>
                                      <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                                        {accepted ? <CheckCircle className="w-3 h-3 text-success" /> : <XCircle className="w-3 h-3 text-destructive" />}
                                        Your Answer:
                                      </p>
                                      <p className="whitespace-pre-wrap text-sm">{userAnswer || <span className="italic text-muted-foreground">Not answered</span>}</p>
                                    </div>
                                    <div className="p-3 rounded border border-primary/30 bg-primary/5 text-sm">
                                      <p className="text-xs font-medium text-muted-foreground mb-1">Expected Answer:</p>
                                      <p className="whitespace-pre-wrap text-sm">{q.expected_answer}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                    }

                    if (!qs) return null;

                    const savedAnswers = (best as Attempt).answers as Record<number, number> || {};
                    return (
                      <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
                        <p className="text-sm font-medium text-muted-foreground">MCQ Answer Review — Level {level} Passed Attempt</p>
                        {qs.map((q, i) => {
                          const userAnswer = savedAnswers[i];
                          const isCorrect = userAnswer !== undefined && q.options[userAnswer]?.is_correct;

                          return (
                            <div key={i} className="p-3 rounded-lg border border-border/30 space-y-2">
                              <div className="flex items-start gap-2">
                                <span className="text-xs font-medium text-muted-foreground mt-0.5">Q{i + 1}.</span>
                                <p className="text-sm font-medium">{q.question_text}</p>
                              </div>
                              <div className="space-y-1.5 pl-6">
                                {q.options.map((option, j) => {
                                  const isUserChoice = Number(userAnswer) === j;
                                  const isCorrectOption = option.is_correct;
                                  let borderClass = "border-border/30";
                                  let bgClass = "";
                                  if (isCorrectOption) { borderClass = "border-success/50"; bgClass = "bg-success/10"; }
                                  else if (isUserChoice && !isCorrectOption) { borderClass = "border-destructive/50"; bgClass = "bg-destructive/10"; }
                                  return (
                                    <div key={j} className={`flex items-center gap-2 p-2 rounded border text-sm ${borderClass} ${bgClass}`}>
                                      <span className="font-medium text-muted-foreground w-5">{String.fromCharCode(65 + j)}.</span>
                                      <span>{option.text}</span>
                                      {isCorrectOption && <CheckCircle className="w-4 h-4 text-success ml-auto shrink-0" />}
                                      {isUserChoice && !isCorrectOption && <XCircle className="w-4 h-4 text-destructive ml-auto shrink-0" />}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
