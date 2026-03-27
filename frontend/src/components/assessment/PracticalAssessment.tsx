import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { type PracticalAssessment as PracticalType } from "@/lib/sample-questions";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, Lightbulb, ClipboardCheck, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Props {
    skillId: string;
    skillName: string;
    tasks: PracticalType[];
    userId: string;
}

export default function PracticalAssessment({ skillId, skillName, tasks, userId }: Props) {
    const navigate = useNavigate();
    const [currentTaskIdx, setCurrentTaskIdx] = useState(0);
    const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({});
    const [submitted, setSubmitted] = useState(false);
    const [startTime] = useState(() => Date.now());
    const [timeLeft, setTimeLeft] = useState(2400); // 40 minutes in seconds

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

    const toggleTaskCompletion = (idx: number) => {
        if (submitted) return;
        setCompletedTasks(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const handleSubmit = async () => {
        const completedCount = Object.values(completedTasks).filter(Boolean).length;
        const totalMarks = tasks.reduce((sum, t) => sum + t.total_marks, 0);
        const earnedMarks = tasks.reduce((sum, t, idx) => sum + (completedTasks[idx] ? t.total_marks : 0), 0);
        const percentage = (earnedMarks / totalMarks) * 100;
        const passed = percentage >= 80; // Level 3 is harder
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);

        setSubmitted(true);

        try {
            await supabase.from("assessment_attempts").insert({
                user_id: userId,
                skill_id: skillId,
                level: 3,
                score: earnedMarks,
                total_marks: totalMarks,
                percentage,
                passed,
                completed: true,
                completed_at: new Date().toISOString(),
                time_taken_seconds: timeTaken,
                metadata: { completed_tasks: completedTasks } as any
            });
            toast.success(passed ? "Practical Assessment Completed! Well done!" : "Assessment Saved. Review and try again!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to save practical results");
        }
    };

    const currentTask = tasks[currentTaskIdx];
    const progress = ((currentTaskIdx + 1) / tasks.length) * 100;
    const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    if (submitted) {
        const completedCount = Object.values(completedTasks).filter(Boolean).length;
        const passed = (completedCount / tasks.length) >= 0.8;

        return (
            <div className="min-h-screen bg-background">
                <DashboardHeader />
                <main className="container mx-auto px-4 py-8 max-w-2xl">
                    <Card className="shadow-elevated border-border/50 animate-fade-in text-center p-8">
                        <ClipboardCheck className={`w-16 h-16 mx-auto mb-4 ${passed ? "text-success" : "text-primary"}`} />
                        <CardTitle className="text-2xl font-display mb-2">
                            {passed ? "Practical Mastery Achieved!" : "Assessment Summary"}
                        </CardTitle>
                        <CardDescription className="text-lg">
                            You completed {completedCount} out of {tasks.length} practical tasks.
                        </CardDescription>
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-2xl font-bold">{((completedCount / tasks.length) * 100).toFixed(0)}%</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Completion</p>
                            </div>
                            <div className="bg-muted p-4 rounded-lg">
                                <p className="text-2xl font-bold">{formatTime(Math.floor((Date.now() - startTime) / 1000))}</p>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Time Taken</p>
                            </div>
                        </div>
                        <div className="mt-8 flex gap-3 flex-col sm:flex-row">
                            <Button variant="outline" className="flex-1" onClick={() => navigate(`/skill/${skillId}`)}>Review Skill</Button>
                            <Button className="flex-1 gradient-accent border-0" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
                        </div>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <DashboardHeader />
            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-destructive hover:bg-destructive/80">Level 3</Badge>
                            <h1 className="text-2xl font-bold font-display">{skillName} Practical</h1>
                        </div>
                        <p className="text-muted-foreground italic">Hands-on application of concepts</p>
                    </div>
                    <div className="flex items-center gap-4 bg-card px-4 py-2 rounded-lg border border-border shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>Time Left: {formatTime(timeLeft)}</span>
                        </div>
                        <div className="h-4 w-px bg-border" />
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <div className="flex items-center gap-1 text-success">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{Object.values(completedTasks).filter(Boolean).length} Done</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Navigation Sidebar */}
                    <div className="lg:col-span-3 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Task Progress</p>
                        {tasks.map((task, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentTaskIdx(i)}
                                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between group ${currentTaskIdx === i
                                        ? "border-primary bg-primary/5 shadow-sm text-primary"
                                        : "border-border/50 hover:border-border hover:bg-muted/50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono opacity-50">0{i + 1}</span>
                                    <span className={`text-sm font-medium truncate ${currentTaskIdx === i ? "max-w-[120px]" : "max-w-[150px]"}`}>
                                        {task.task_title}
                                    </span>
                                </div>
                                {completedTasks[i] ? (
                                    <CheckCircle2 className="w-4 h-4 text-success" />
                                ) : (
                                    <Circle className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/50" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Task Content */}
                    <div className="lg:col-span-9 space-y-6">
                        <Card className="border-border/50 shadow-elevated h-full flex flex-col">
                            <CardHeader className="border-b border-border/30 bg-muted/20">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline" className="text-xs">Task {currentTaskIdx + 1} of {tasks.length}</Badge>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <ClipboardCheck className="w-3 h-3" />
                                        <span>{currentTask.total_marks} Marks</span>
                                    </div>
                                </div>
                                <CardTitle className="text-xl font-display">{currentTask.task_title}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 flex-1 flex flex-col">
                                <div className="prose prose-sm dark:prose-invert max-w-none flex-1">
                                    <div className="p-4 bg-muted/40 rounded-lg border border-border/40 mb-6 leading-relaxed">
                                        <p className="text-base text-card-foreground whitespace-pre-wrap">{currentTask.task_description}</p>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <h4 className="flex items-center gap-2 text-sm font-semibold text-primary">
                                            <Lightbulb className="w-4 h-4" />
                                            Implementation Hints
                                        </h4>
                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {currentTask.hints.map((hint, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs bg-muted/50 p-2 rounded border border-border/20">
                                                    <span className="text-primary font-bold">•</span>
                                                    {hint}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <button
                                        onClick={() => toggleTaskCompletion(currentTaskIdx)}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${completedTasks[currentTaskIdx]
                                                ? "bg-success text-success-foreground shadow-glow"
                                                : "bg-muted text-muted-foreground hover:bg-muted-foreground/10 border border-border"
                                            }`}
                                    >
                                        {completedTasks[currentTaskIdx] ? (
                                            <><CheckCircle2 className="w-5 h-5" /> Task Completed</>
                                        ) : (
                                            <><Circle className="w-5 h-5" /> Mark as Done</>
                                        )}
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentTaskIdx(prev => prev - 1)}
                                            disabled={currentTaskIdx === 0}
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setCurrentTaskIdx(prev => prev + 1)}
                                            disabled={currentTaskIdx === tasks.length - 1}
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                        {currentTaskIdx === tasks.length - 1 && (
                                            <Button
                                                onClick={handleSubmit}
                                                className="gradient-accent border-0 ml-2"
                                            >
                                                Finish & Submit
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
