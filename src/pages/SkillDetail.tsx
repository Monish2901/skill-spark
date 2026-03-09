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

interface Attempt {
  id: string;
  level: number;
  score: number | null;
  percentage: number | null;
  passed: boolean | null;
  completed: boolean | null;
  created_at: string;
  time_taken_seconds: number | null;
  answers: Record<number, number> | null;
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
      const [skillRes, attemptsRes] = await Promise.all([
        supabase.from("skills").select("*").eq("id", skillId!).single(),
        supabase
          .from("assessment_attempts")
          .select("*")
          .eq("user_id", user!.id)
          .eq("skill_id", skillId!)
          .order("created_at", { ascending: false }),
      ]);
      if (skillRes.data) setSkill(skillRes.data as Skill);
      if (attemptsRes.data) setAttempts(attemptsRes.data as Attempt[]);
      setLoading(false);
    }
    if (user && skillId) load();
  }, [user, skillId]);

  const bestAttemptForLevel = (level: number) =>
    attempts.find(a => a.level === level && a.passed);

  const canAccessLevel = (level: number) => {
    if (level === 1) return true;
    return !!bestAttemptForLevel(level - 1);
  };

  const levelInfo = [
    { level: 1, title: "Basic Conceptual Knowledge", type: "MCQ (30 questions)", passing: "70%", desc: "Multiple choice questions testing core concepts. Negative marking: -1 for every 2 wrong answers." },
    { level: 2, title: "Theoretical Understanding", type: "Descriptive", passing: "80%", desc: "Written responses demonstrating deep conceptual understanding." },
    { level: 3, title: "Practical Competency", type: "Task-based", passing: "100% completion", desc: "Hands-on tasks including coding exercises and implementation activities." },
  ];

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
          {levelInfo.map(({ level, title, type, passing, desc }) => {
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
                  <p className="text-sm text-muted-foreground mb-4">{desc}</p>
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
                      <Button size="sm" variant="outline" disabled>
                        Coming Soon
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
                    if (level === 2) {
                      // Theory answer review
                      const qs = theoryQuestions[skill.name] || [];
                      const savedAnswers = (best as any).answers as Record<number, string> || {};
                      return (
                        <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
                          <p className="text-sm font-medium text-muted-foreground">Theory Answer Review — Passed Attempt</p>
                          {qs.map((q, i) => {
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
                    // MCQ answer review (Level 1)
                    const qs = sampleQuestions[skill.name]?.slice(0, 30) || [];
                    const savedAnswers = (best as Attempt).answers as Record<number, number> || {};
                    return (
                      <div className="mt-4 space-y-3 border-t border-border/50 pt-4">
                        <p className="text-sm font-medium text-muted-foreground">Answer Review — Passed Attempt</p>
                        {qs.map((q, i) => {
                          const userAnswer = savedAnswers[i];
                          const correctIndex = q.options.findIndex(o => o.is_correct);
                          const isCorrect = userAnswer !== undefined && q.options[userAnswer]?.is_correct;

                          return (
                            <div key={i} className="p-3 rounded-lg border border-border/30 space-y-2">
                              <div className="flex items-start gap-2">
                                <span className="text-xs font-medium text-muted-foreground mt-0.5">Q{i + 1}.</span>
                                <p className="text-sm font-medium">{q.question_text}</p>
                              </div>
                              <div className="space-y-1.5 pl-6">
                                {q.options.map((option, j) => {
                                  const isUserChoice = userAnswer === j;
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
                              {userAnswer === undefined && (
                                <p className="text-xs text-muted-foreground pl-6 italic">Not answered</p>
                              )}
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
