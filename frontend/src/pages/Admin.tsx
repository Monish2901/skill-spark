import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Brain, LogOut, Users, BookOpen, Edit, Trash2, Plus, Shield } from "lucide-react";
import { toast } from "sonner";
import { NEW_SKILLS_DATA as SHARED_NEW_SKILLS, getVirtualId } from "@/lib/skills-data";
import { sampleQuestions, theoryQuestions, practicalAssessments, type SampleQuestion } from "@/lib/sample-questions";
import { aptitudeL1, aptitudeL2, aptitudeL3 } from "@/lib/aptitude-mcq";
import { communicationL1 } from "@/lib/communication-mcq";
import { oopsL1, oopsL2, oopsL3, gkL1, gkL2, gkL3 } from "@/lib/oops-gk-mcq";
import { jsL1, jsL2, jsL3, reactL1, reactL2, reactL3 } from "@/lib/software-mcq";
import { sqlL1, sqlL2, sqlL3, nodeL1, nodeL2, nodeL3, cppL1, cppL2, cppL3 } from "@/lib/v2-software-mcq";
import { javaL1, javaL2, javaL3, pythonL1, pythonL2, pythonL3 } from "@/lib/java-python-mcq";
import { 
  roboticsL1, roboticsL2, roboticsL3,
  vlsiL1, vlsiL2, vlsiL3,
  computerArchL1, computerArchL2, computerArchL3,
  pcbDesignL1, pcbDesignL2, pcbDesignL3 
} from "@/lib/hardware-mcq";

interface Skill {
  id: string;
  name: string;
  domain: string;
  created_at: string;
  description?: string | null;
  icon?: string | null;
}

interface Question {
  id: string;
  skill_id: string;
  level: number;
  question_text: string;
  question_type: string;
  options: any;
  correct_answer: string | null;
  marks: number;
  task_description: string | null;
}

interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string | null;
  created_at: string;
}

interface Attempt {
  skill_id: string;
  level: number;
  passed: boolean | null;
  percentage: number | null;
  completed_at: string | null;
}

const NEW_SKILLS_DATA = SHARED_NEW_SKILLS.map(s => ({
  id: getVirtualId(s.name),
  name: s.name,
  domain: s.domain,
  created_at: new Date().toISOString()
}));

export default function Admin() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    skill_id: "",
    level: 1,
    question_text: "",
    question_type: "mcq",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correct_option: "0",
    expected_answer: "",
    task_description: "",
    hints: "",
    marks: 1,
  });

  useEffect(() => {
    checkAdmin();
  }, [user]);

  async function checkAdmin() {
    if (!user) return;
    const { data } = await supabase
      .from("user_roles" as any)
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");
    const roles = data as any[] | null;
    if (roles && roles.length > 0) {
      setIsAdmin(true);
      loadData();
    } else {
      setIsAdmin(false);
    }
  }

  async function loadData() {
    const [skillsRes, questionsRes, profilesRes, attemptsRes] = await Promise.all([
      supabase.from("skills").select("*"),
      supabase.from("questions").select("*").order("skill_id").order("level"),
      supabase.from("profiles").select("*"),
      supabase.from("assessment_attempts").select("skill_id, level, passed, percentage, completed_at, user_id"),
    ]);

    let allSkills: Skill[] = skillsRes.data || [];
    // Inject missing virtual skills for admin management
    NEW_SKILLS_DATA.forEach(ns => {
      if (!allSkills.find((s: Skill) => s.id === ns.id || s.name === ns.name)) {
        allSkills.push(ns as Skill);
      }
    });

    let allQuestions: Question[] = (questionsRes.data || []) as Question[];

    // Inject virtual questions for skills that aren't fully in the DB
    allSkills.forEach(skill => {
      const dbQuestionsForSkill = allQuestions.filter(q => q.skill_id === skill.id || q.skill_id === skill.name);
      
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
        "Communication Skills-1": communicationL1,
      };

      [1, 2, 3].forEach(lvl => {
        const key = `${skill.name}-${lvl}`;
        const dbQsAtLvl = dbQuestionsForSkill.filter(q => q.level === lvl);
        
        if (dbQsAtLvl.length === 0 && specializedMcqs[key]) {
          specializedMcqs[key].forEach((q, idx) => {
            allQuestions.push({
              id: `v-sm-${skill.name}-${lvl}-${idx}`,
              skill_id: skill.id,
              level: lvl,
              question_text: q.question_text,
              question_type: "mcq",
              options: q.options,
              correct_answer: q.options.find(o => o.is_correct)?.text || null,
              marks: q.marks || 1,
              task_description: null
            } as Question);
          });
        }
      });

      // Re-filter after injection to check for complete emptiness
      const finalQuestionsForSkill = allQuestions.filter(q => q.skill_id === skill.id || q.skill_id === skill.name);
      if (finalQuestionsForSkill.length === 0) {
        // Fallback for legacy sample data if still nothing
        const mcq = sampleQuestions[skill.name] || [];
        const theory = theoryQuestions[skill.name] || [];
        const practical = practicalAssessments[skill.name] || [];

        mcq.forEach((q, idx) => {
          allQuestions.push({
            id: `v-m-${skill.name}-${idx}`,
            skill_id: skill.id,
            level: 1,
            question_text: q.question_text,
            question_type: "mcq",
            options: q.options,
            correct_answer: q.options.find(o => o.is_correct)?.text || null,
            marks: q.marks || 1,
            task_description: null
          } as Question);
        });

        theory.forEach((q, idx) => {
          allQuestions.push({
            id: `v-t-${skill.name}-${idx}`,
            skill_id: skill.id,
            level: 2,
            question_text: q.question_text,
            question_type: "theory",
            options: null,
            correct_answer: q.expected_answer,
            marks: q.marks || 1,
            task_description: null
          } as Question);
        });

        practical.forEach((q, idx) => {
          allQuestions.push({
            id: `v-p-${skill.name}-${idx}`,
            skill_id: skill.id,
            level: 3,
            question_text: q.task_title,
            question_type: "practical",
            options: { hints: q.hints },
            correct_answer: "Practical task - see description",
            marks: q.total_marks || 5,
            task_description: q.task_description
          } as Question);
        });
      }
    });

    setSkills(allSkills);
    setQuestions(allQuestions);
    if (profilesRes.data) setProfiles(profilesRes.data);
    if (attemptsRes.data) setAttempts(attemptsRes.data as any[]);
  }

  const filteredQuestions = questions.filter(q => {
    if (selectedSkill !== "all" && q.skill_id !== selectedSkill) return false;
    if (selectedLevel !== "all" && q.level !== parseInt(selectedLevel)) return false;
    return true;
  });

  const getSkillName = (skillId: string) => skills.find(s => s.id === skillId)?.name || skillId;

  async function handleDeleteQuestion(id: string) {
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete question");
    } else {
      setQuestions(prev => prev.filter(q => q.id !== id));
      toast.success("Question deleted");
    }
  }

  async function handleUpdateQuestion(q: Question) {
    const { error } = await supabase
      .from("questions")
      .update({
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        marks: q.marks,
        task_description: q.task_description,
      })
      .eq("id", q.id);
    if (error) {
      toast.error("Failed to update question");
    } else {
      setQuestions(prev => prev.map(old => (old.id === q.id ? q : old)));
      setEditingQuestion(null);
      toast.success("Question updated");
    }
  }

  async function handleAddQuestion() {
    let options = null;
    let correctAnswer = newQuestion.expected_answer;
    let qType = newQuestion.level === 1 ? "mcq" : newQuestion.level === 2 ? "theory" : "practical";

    if (newQuestion.level === 1) {
      options = [
        { text: newQuestion.option1, is_correct: newQuestion.correct_option === "0" },
        { text: newQuestion.option2, is_correct: newQuestion.correct_option === "1" },
        { text: newQuestion.option3, is_correct: newQuestion.correct_option === "2" },
        { text: newQuestion.option4, is_correct: newQuestion.correct_option === "3" },
      ];
      correctAnswer = [newQuestion.option1, newQuestion.option2, newQuestion.option3, newQuestion.option4][parseInt(newQuestion.correct_option)];
    } else if (newQuestion.level === 3) {
      // Store hints in options for practical
      options = { hints: newQuestion.hints.split(",").map(h => h.trim()) };
    }

    const { data, error } = await supabase.from("questions").insert({
      skill_id: newQuestion.skill_id,
      level: newQuestion.level,
      question_text: newQuestion.question_text,
      question_type: qType,
      options,
      correct_answer: correctAnswer,
      marks: newQuestion.marks,
      task_description: newQuestion.task_description,
    }).select();

    if (error) {
      toast.error("Failed to add question");
    } else if (data) {
      setQuestions(prev => [...prev, data[0] as Question]);
      setShowAddDialog(false);
      setNewQuestion({
        skill_id: "", level: 1, question_text: "", question_type: "mcq",
        option1: "", option2: "", option3: "", option4: "", correct_option: "0",
        expected_answer: "", task_description: "", hints: "", marks: 1
      });
      toast.success("Question added");
    }
  }


  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">You do not have admin privileges.</p>
            <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-destructive flex items-center justify-center">
              <Shield className="w-5 h-5 text-destructive-foreground" />
            </div>
            <span className="font-display font-bold text-lg">Admin Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
              User Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="questions">
          <TabsList className="mb-6">
            <TabsTrigger value="questions" className="gap-2">
              <BookOpen className="w-4 h-4" /> Questions
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" /> Users
            </TabsTrigger>
          </TabsList>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Question Management</CardTitle>
                <div className="flex items-center gap-3">
                  <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by skill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skills</SelectItem>
                      {skills.map(s => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter by level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="1">Level 1</SelectItem>
                      <SelectItem value="2">Level 2</SelectItem>
                      <SelectItem value="3">Level 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm"><Plus className="w-4 h-4 mr-1" /> Add Question</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Question</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Skill</Label>
                          <Select value={newQuestion.skill_id} onValueChange={v => setNewQuestion(p => ({ ...p, skill_id: v }))}>
                            <SelectTrigger><SelectValue placeholder="Select skill" /></SelectTrigger>
                            <SelectContent>
                              {skills.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Level</Label>
                          <Select value={String(newQuestion.level)} onValueChange={v => setNewQuestion(p => ({ ...p, level: parseInt(v) }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">Level 1</SelectItem>
                              <SelectItem value="2">Level 2</SelectItem>
                              <SelectItem value="3">Level 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>{newQuestion.level === 3 ? "Task Title" : "Question Text"}</Label>
                          <Input value={newQuestion.question_text} onChange={e => setNewQuestion(p => ({ ...p, question_text: e.target.value }))} />
                        </div>

                        {newQuestion.level === 1 && (
                          <div className="space-y-4 pt-2 border-t border-border/30">
                            <div>
                              <Label>Option 1</Label>
                              <Input value={newQuestion.option1} onChange={e => setNewQuestion(p => ({ ...p, option1: e.target.value }))} />
                            </div>
                            <div>
                              <Label>Option 2</Label>
                              <Input value={newQuestion.option2} onChange={e => setNewQuestion(p => ({ ...p, option2: e.target.value }))} />
                            </div>
                            <div>
                              <Label>Option 3</Label>
                              <Input value={newQuestion.option3} onChange={e => setNewQuestion(p => ({ ...p, option3: e.target.value }))} />
                            </div>
                            <div>
                              <Label>Option 4</Label>
                              <Input value={newQuestion.option4} onChange={e => setNewQuestion(p => ({ ...p, option4: e.target.value }))} />
                            </div>
                            <div>
                              <Label>Correct Option</Label>
                              <Select value={newQuestion.correct_option} onValueChange={v => setNewQuestion(p => ({ ...p, correct_option: v }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0">Option 1</SelectItem>
                                  <SelectItem value="1">Option 2</SelectItem>
                                  <SelectItem value="2">Option 3</SelectItem>
                                  <SelectItem value="3">Option 4</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        {newQuestion.level === 2 && (
                          <div className="space-y-4 pt-2 border-t border-border/30">
                            <div>
                              <Label>Expected Answer (Simplified)</Label>
                              <Textarea
                                placeholder="Explain the core concept or keywords..."
                                value={newQuestion.expected_answer}
                                onChange={e => setNewQuestion(p => ({ ...p, expected_answer: e.target.value }))}
                              />
                            </div>
                          </div>
                        )}

                        {newQuestion.level === 3 && (
                          <div className="space-y-4 pt-2 border-t border-border/30">
                            <div>
                              <Label>Task Description</Label>
                              <Textarea
                                placeholder="Detailed steps for the user to follow..."
                                value={newQuestion.task_description}
                                onChange={e => setNewQuestion(p => ({ ...p, task_description: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label>Hints (comma-separated)</Label>
                              <Input
                                placeholder="Hint 1, Hint 2, Hint 3..."
                                value={newQuestion.hints}
                                onChange={e => setNewQuestion(p => ({ ...p, hints: e.target.value }))}
                              />
                            </div>
                          </div>
                        )}

                        <div className="pt-2 border-t border-border/30">
                          <Label>Marks</Label>
                          <Input type="number" value={newQuestion.marks} onChange={e => setNewQuestion(p => ({ ...p, marks: parseInt(e.target.value) || 1 }))} />
                        </div>
                        <Button onClick={handleAddQuestion} className="w-full" disabled={!newQuestion.skill_id || !newQuestion.question_text}>
                          Add Question
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Showing {filteredQuestions.length} questions
                </p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Skill</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead className="max-w-[300px]">Question</TableHead>
                        <TableHead>Correct Answer</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredQuestions.slice(0, 100).map((q, idx) => (
                        <TableRow key={q.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{getSkillName(q.skill_id)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={q.level === 1 ? "default" : q.level === 2 ? "secondary" : "destructive"}>
                              L{q.level}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate">{q.question_text}</TableCell>
                          <TableCell className="text-sm">{q.correct_answer}</TableCell>
                          <TableCell>{q.marks}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => setEditingQuestion({ ...q })}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Edit Question</DialogTitle>
                                  </DialogHeader>
                                  {editingQuestion && editingQuestion.id === q.id && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label>Question Text</Label>
                                        <Input
                                          value={editingQuestion.question_text}
                                          onChange={e => setEditingQuestion(prev => prev ? { ...prev, question_text: e.target.value } : null)}
                                        />
                                      </div>
                                      {Array.isArray(editingQuestion.options) && editingQuestion.options.map((opt: any, i: number) => (
                                        <div key={i}>
                                          <Label>Option {i + 1} {opt.is_correct && "(Correct)"}</Label>
                                          <Input
                                            value={opt.text}
                                            onChange={e => {
                                              const newOpts = [...editingQuestion.options];
                                              newOpts[i] = { ...newOpts[i], text: e.target.value };
                                              setEditingQuestion(prev => prev ? { ...prev, options: newOpts } : null);
                                            }}
                                          />
                                        </div>
                                      ))}
                                      <div>
                                        <Label>Correct Option</Label>
                                        <Select
                                          value={String(editingQuestion.options?.findIndex((o: any) => o.is_correct) ?? 0)}
                                          onValueChange={v => {
                                            const newOpts = editingQuestion.options.map((o: any, i: number) => ({
                                              ...o,
                                              is_correct: i === parseInt(v),
                                            }));
                                            const correctText = newOpts[parseInt(v)].text;
                                            setEditingQuestion(prev => prev ? { ...prev, options: newOpts, correct_answer: correctText } : null);
                                          }}
                                        >
                                          <SelectTrigger><SelectValue /></SelectTrigger>
                                          <SelectContent>
                                            {editingQuestion.options?.map((_: any, i: number) => (
                                              <SelectItem key={i} value={String(i)}>Option {i + 1}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label>Marks</Label>
                                        <Input
                                          type="number"
                                          value={editingQuestion.marks}
                                          onChange={e => setEditingQuestion(prev => prev ? { ...prev, marks: parseInt(e.target.value) || 1 } : null)}
                                        />
                                      </div>
                                      <Button onClick={() => handleUpdateQuestion(editingQuestion)} className="w-full">
                                        Save Changes
                                      </Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(q.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">User Profiles & Progress</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Manage and track all registered students</p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-sm font-medium px-3 py-1 bg-primary/10 rounded-full text-primary border border-primary/20">
                    Total: {profiles.length} Users
                   </div>
                   <div className="relative w-64">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by name or email..." 
                      className="pl-9 h-9"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                    />
                   </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead className="text-center">Tests Taken</TableHead>
                      <TableHead className="text-center">Passed</TableHead>
                      <TableHead>Avg Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles
                      .filter(p => !userSearch || 
                        p.full_name?.toLowerCase().includes(userSearch.toLowerCase()) || 
                        p.email?.toLowerCase().includes(userSearch.toLowerCase()))
                      .map((p, idx) => {
                        const userAttempts = (attempts as any[]).filter((a: any) => a.user_id === p.user_id);
                        const passedCount = userAttempts.filter((a: any) => a.passed).length;
                        const avgScore = userAttempts.length > 0 
                          ? Math.round(userAttempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / userAttempts.length)
                          : 0;
                        
                        return (
                          <TableRow key={p.id}>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell className="font-medium">{p.full_name || "Guest Account"}</TableCell>
                            <TableCell className="text-muted-foreground">{p.email || "No Email"}</TableCell>
                            <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="font-mono">{userAttempts.length}</Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={passedCount > 0 ? "default" : "secondary"}>
                                {passedCount}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${avgScore > 70 ? "bg-emerald-500" : avgScore > 40 ? "bg-amber-500" : "bg-rose-500"}`} 
                                    style={{ width: `${avgScore}%` }}
                                  />
                                </div>
                                <span className={avgScore > 0 ? "font-semibold" : "text-muted-foreground"}>
                                  {avgScore > 0 ? `${avgScore}%` : "—"}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
