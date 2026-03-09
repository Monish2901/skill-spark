import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Brain, LogOut, Users, BookOpen, Edit, Trash2, Plus, Shield } from "lucide-react";
import { toast } from "sonner";

interface Skill {
  id: string;
  name: string;
  domain: string;
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

export default function Admin() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
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
    if (skillsRes.data) setSkills(skillsRes.data);
    if (questionsRes.data) setQuestions(questionsRes.data as Question[]);
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
    const options = [
      { text: newQuestion.option1, is_correct: newQuestion.correct_option === "0" },
      { text: newQuestion.option2, is_correct: newQuestion.correct_option === "1" },
      { text: newQuestion.option3, is_correct: newQuestion.correct_option === "2" },
      { text: newQuestion.option4, is_correct: newQuestion.correct_option === "3" },
    ];
    const correctText = [newQuestion.option1, newQuestion.option2, newQuestion.option3, newQuestion.option4][parseInt(newQuestion.correct_option)];

    const { data, error } = await supabase.from("questions").insert({
      skill_id: newQuestion.skill_id,
      level: newQuestion.level,
      question_text: newQuestion.question_text,
      question_type: newQuestion.question_type,
      options,
      correct_answer: correctText,
      marks: newQuestion.marks,
    }).select();

    if (error) {
      toast.error("Failed to add question");
    } else if (data) {
      setQuestions(prev => [...prev, data[0] as Question]);
      setShowAddDialog(false);
      setNewQuestion({ skill_id: "", level: 1, question_text: "", question_type: "mcq", option1: "", option2: "", option3: "", option4: "", correct_option: "0", marks: 1 });
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
                          <Label>Question Text</Label>
                          <Input value={newQuestion.question_text} onChange={e => setNewQuestion(p => ({ ...p, question_text: e.target.value }))} />
                        </div>
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
                        <div>
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
              <CardHeader>
                <CardTitle className="text-xl">User Profiles & Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Assessments Taken</TableHead>
                      <TableHead>Passed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((p, idx) => {
                      const userAttempts = (attempts as any[]).filter((a: any) => a.user_id === p.user_id);
                      const passedCount = userAttempts.filter((a: any) => a.passed).length;
                      return (
                        <TableRow key={p.id}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                          <TableCell>{p.email || "—"}</TableCell>
                          <TableCell>{new Date(p.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{userAttempts.length}</TableCell>
                          <TableCell>
                            <Badge variant={passedCount > 0 ? "default" : "secondary"}>
                              {passedCount}
                            </Badge>
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
