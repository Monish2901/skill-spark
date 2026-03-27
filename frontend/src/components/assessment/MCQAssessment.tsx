import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { type SampleQuestion } from "@/lib/sample-questions";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface Props {
  skillId: string;
  skillName: string;
  questions: SampleQuestion[];
  userId: string;
  level?: number;
  passage?: string;
  passPercentage?: number;
  disableNegativeMarking?: boolean;
}

export default function MCQAssessment({ 
  skillId, 
  skillName, 
  questions, 
  userId, 
  level = 1,
  passage,
  passPercentage = 70,
  disableNegativeMarking = false
}: Props) {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(() => Date.now());
  const [timeLeft, setTimeLeft] = useState(2400); // 40 minutes in seconds
  const [results, setResults] = useState<{
    score: number; total: number; percentage: number;
    correct: number; incorrect: number; passed: boolean; timeTaken: number;
  } | null>(null);

  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleAnswer = (optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [currentQ]: optionIndex }));
  };

  const handleSubmit = async () => {
    let correct = 0;
    let incorrect = 0;
    questions.forEach((q, i) => {
      if (answers[i] !== undefined) {
        if (q.options[answers[i]].is_correct) correct++;
        else incorrect++;
      }
    });
    const negativeMarks = disableNegativeMarking ? 0 : Math.floor(incorrect / 2);
    const score = Math.max(0, correct - negativeMarks);
    const total = questions.length;
    const percentage = (score / total) * 100;
    const passed = percentage >= passPercentage;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    setResults({ score, total, percentage, correct, incorrect, passed, timeTaken });
    setSubmitted(true);

    try {
      const { error } = await supabase.from("assessment_attempts").insert({
        user_id: userId, skill_id: skillId, level: level,
        score, total_marks: total, percentage,
        questions_answered: Object.keys(answers).length,
        correct_answers: correct, incorrect_answers: incorrect,
        passed, completed: true, completed_at: new Date().toISOString(),
        answers: answers as any, time_taken_seconds: timeTaken,
      });
      
      if (error) {
        console.error("Supabase Error saving results:", error);
        toast.error("Failed to save results to database. Progress may not be tracked.");
      } else {
        toast.success(passed ? "Congratulations! You passed!" : "Assessment completed. Try again to improve!");
      }
    } catch (e) { 
      console.error("Exception saving results:", e);
      toast.error("An error occurred while saving your results."); 
    }
  };

  const progress = ((currentQ + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
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
              <CardTitle className="text-2xl font-display">{results.passed ? "Assessment Passed! 🎉" : "Assessment Not Passed"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-3xl font-bold font-display text-primary">{results.percentage.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Score</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-3xl font-bold font-display">{results.score}/{results.total}</p>
                  <p className="text-sm text-muted-foreground">Marks</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-3xl font-bold font-display text-success">{results.correct}</p>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-3xl font-bold font-display text-destructive">{results.incorrect}</p>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-3xl font-bold font-display">{formatTime(results.timeTaken)}</p>
                <p className="text-sm text-muted-foreground">Time Taken</p>
              </div>
              {!disableNegativeMarking && (
                <div className="p-4 rounded-lg bg-muted/50 border border-border">
                  <p className="text-sm text-muted-foreground">
                    <strong>Negative Marking Applied:</strong> -{Math.floor(results.incorrect / 2)} marks ({results.incorrect} wrong ÷ 2)
                  </p>
                </div>
              )}
              <div className="flex flex-col gap-3">
                {results.passed ? (
                  level < 3 ? (
                    <Button className="w-full gradient-accent border-0" onClick={() => navigate(`/assessment/${skillId}/${level + 1}`)}>
                      Proceed to Level {level + 1}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button className="w-full gradient-success border-0" onClick={() => navigate(`/skill/${skillId}`)}>
                      Congratulations! Go to Skill Details
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  )
                ) : (
                  <Button className="w-full" onClick={() => window.location.reload()}>
                    Try Again
                  </Button>
                )}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => navigate(`/skill/${skillId}`)}>Skill Details</Button>
                  <Button variant="outline" className="flex-1" onClick={() => navigate("/dashboard")}>Dashboard</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {results.passed && (
            <Card className="shadow-elevated border-border/50 animate-fade-in mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-display">Answer Review</CardTitle>
                <p className="text-sm text-muted-foreground">Review all questions and correct answers</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {questions.map((q, i) => {
                  const userAnswer = answers[i];
                  return (
                    <div key={i} className="p-4 rounded-lg border border-border/50 space-y-3">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-muted-foreground mt-0.5">Q{i + 1}.</span>
                        <p className="text-sm font-medium">{q.question_text}</p>
                      </div>
                      <div className="space-y-2 pl-6">
                        {q.options.map((option, j) => {
                          const isUserChoice = userAnswer === j;
                          const isCorrectOption = option.is_correct;
                          let borderClass = "border-border/30";
                          let bgClass = "";
                          if (isCorrectOption) { borderClass = "border-success/50"; bgClass = "bg-success/10"; }
                          else if (isUserChoice) { borderClass = "border-destructive/50"; bgClass = "bg-destructive/10"; }
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
                      {userAnswer === undefined && <p className="text-xs text-muted-foreground pl-6 italic">Not answered</p>}
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
            <h1 className="text-xl font-bold font-display">{skillName} – Level 1</h1>
            <p className="text-sm text-muted-foreground">MCQ Assessment • {questions.length} Questions</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1 bg-muted/50"><Clock className="w-3 h-3" />Time Remaining: {formatTime(timeLeft)}</Badge>
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
            {passage && (
              <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border/50 text-sm leading-relaxed italic">
                {passage}
              </div>
            )}
            <CardTitle className="text-lg mt-4 font-display leading-relaxed">{currentQuestion.question_text}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, i) => (
                <button key={i} onClick={() => handleAnswer(i)}
                  className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                    answers[currentQ] === i ? "border-primary bg-primary/5 shadow-glow" : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                      answers[currentQ] === i ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 text-muted-foreground"
                    }`}>{String.fromCharCode(65 + i)}</div>
                    <span className="text-sm">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" />Previous
          </Button>
          {currentQ === questions.length - 1 ? (
            <Button onClick={handleSubmit} className="gradient-accent border-0">Submit Assessment</Button>
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
                    : answers[i] !== undefined ? "bg-success/20 text-success border border-success/30"
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
