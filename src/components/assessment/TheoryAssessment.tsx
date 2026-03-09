import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { type TheoryQuestion } from "@/lib/sample-questions";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { toast } from "sonner";

interface Props {
  skillId: string;
  skillName: string;
  questions: TheoryQuestion[];
  userId: string;
}

export default function TheoryAssessment({ skillId, skillName, questions, userId }: Props) {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [results, setResults] = useState<{
    score: number; total: number; percentage: number; passed: boolean; timeTaken: number;
  } | null>(null);

  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime, submitted]);

  const handleAnswer = (text: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [currentQ]: text }));
  };

  const handleSubmit = async () => {
    // For theory, we count answered questions and give full marks for any non-empty answer
    // (In a real system, an evaluator would grade these)
    let answeredCount = 0;
    questions.forEach((_, i) => {
      if (answers[i] && answers[i].trim().length >= 20) {
        answeredCount++;
      }
    });

    const total = questions.length;
    const score = answeredCount;
    const percentage = (score / total) * 100;
    const passed = percentage >= 80;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    setResults({ score, total, percentage, passed, timeTaken });
    setSubmitted(true);

    try {
      await supabase.from("assessment_attempts").insert({
        user_id: userId, skill_id: skillId, level: 2,
        score, total_marks: total, percentage,
        questions_answered: Object.keys(answers).filter(k => answers[parseInt(k)]?.trim().length > 0).length,
        correct_answers: answeredCount, incorrect_answers: total - answeredCount,
        passed, completed: true, completed_at: new Date().toISOString(),
        answers: answers as any, time_taken_seconds: timeTaken,
      });
      toast.success(passed ? "Congratulations! You passed the theory exam!" : "Assessment completed. Write more detailed answers to improve!");
    } catch { toast.error("Failed to save results"); }
  };

  const progress = ((currentQ + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).filter(k => answers[parseInt(k)]?.trim().length > 0).length;
  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (submitted && results) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="shadow-elevated border-border/50 animate-fade-in">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto mb-4">
                {results.passed ? <CheckCircle className="w-16 h-16 text-success mx-auto" /> : <XCircle className="w-16 h-16 text-destructive mx-auto" />}
              </div>
              <CardTitle className="text-2xl font-display">{results.passed ? "Theory Exam Passed! 🎉" : "Theory Exam Not Passed"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-3xl font-bold font-display text-primary">{results.percentage.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Score</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-3xl font-bold font-display">{results.score}/{results.total}</p>
                  <p className="text-sm text-muted-foreground">Questions Accepted</p>
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-3xl font-bold font-display">{formatTime(results.timeTaken)}</p>
                <p className="text-sm text-muted-foreground">Time Taken</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Answers must be at least 20 characters to be accepted. You need 80% to pass.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => navigate(`/skill/${skillId}`)}>View Skill Details</Button>
                <Button className="flex-1" onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
              </div>
            </CardContent>
          </Card>

          {/* Answer Review */}
          {results.passed && (
            <Card className="shadow-elevated border-border/50 animate-fade-in mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-display">Answer Review</CardTitle>
                <p className="text-sm text-muted-foreground">Your written answers and expected answers</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.map((q, i) => {
                  const userAnswer = answers[i] || "";
                  const accepted = userAnswer.trim().length >= 20;
                  return (
                    <div key={i} className="p-4 rounded-lg border border-border/50 space-y-3">
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
                          <p className="whitespace-pre-wrap">{userAnswer || <span className="italic text-muted-foreground">Not answered</span>}</p>
                        </div>
                        <div className="p-3 rounded border border-primary/30 bg-primary/5 text-sm">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Expected Answer:</p>
                          <p className="whitespace-pre-wrap">{q.expected_answer}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    );
  }

  const currentQuestion = questions[currentQ];

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold font-display">{skillName} – Level 2</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <FileText className="w-4 h-4" /> Theory Exam • {questions.length} Questions • Write your answers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1"><Clock className="w-3 h-3" />{formatTime(elapsedSeconds)}</Badge>
            <Badge variant="outline" className="gap-1">{answeredCount}/{questions.length} answered</Badge>
          </div>
        </div>

        <Progress value={progress} className="mb-6 h-2" />

        <Card className="shadow-elevated border-border/50 mb-6 animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">Question {currentQ + 1} of {questions.length}</Badge>
              <Badge variant="outline">1 mark</Badge>
            </div>
            <CardTitle className="text-lg mt-4 font-display leading-relaxed">{currentQuestion.question_text}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write your answer here... (minimum 20 characters)"
              value={answers[currentQ] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              className="min-h-[180px] text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              {(answers[currentQ] || "").length} characters
              {(answers[currentQ] || "").length < 20 && " (minimum 20 required)"}
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />Previous
          </Button>
          {currentQ === questions.length - 1 ? (
            <Button onClick={handleSubmit} className="gradient-accent border-0">Submit Theory Exam</Button>
          ) : (
            <Button onClick={() => setCurrentQ(Math.min(questions.length - 1, currentQ + 1))}>Next<ArrowRight className="w-4 h-4 ml-2" /></Button>
          )}
        </div>

        <Card className="mt-6 border-border/50 shadow-card">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-3">Question Navigator</p>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrentQ(i)}
                  className={`w-8 h-8 rounded text-xs font-medium transition-all ${
                    i === currentQ ? "bg-primary text-primary-foreground"
                    : answers[i]?.trim().length ? "bg-success/20 text-success border border-success/30"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}>{i + 1}</button>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
