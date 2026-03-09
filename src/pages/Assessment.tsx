import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { sampleQuestions, theoryQuestions, type SampleQuestion, type TheoryQuestion } from "@/lib/sample-questions";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { toast } from "sonner";

import MCQAssessment from "@/components/assessment/MCQAssessment";
import TheoryAssessment from "@/components/assessment/TheoryAssessment";

export default function Assessment() {
  const { skillId, level } = useParams<{ skillId: string; level: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const levelNum = parseInt(level || "1");

  const [skillName, setSkillName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkill() {
      const { data } = await supabase.from("skills").select("name").eq("id", skillId!).single();
      if (data) setSkillName(data.name);
      setLoading(false);
    }
    if (skillId) loadSkill();
  }, [skillId]);

  if (loading || !skillName) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (levelNum === 2) {
    const questions = theoryQuestions[skillName];
    if (!questions || questions.length === 0) {
      return (
        <div className="min-h-screen bg-background">
          <DashboardHeader />
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-muted-foreground">No theory questions available for this skill.</p>
          </div>
        </div>
      );
    }
    return <TheoryAssessment skillId={skillId!} skillName={skillName} questions={questions} userId={user!.id} />;
  }

  // Level 1 - MCQ
  const questions = sampleQuestions[skillName];
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">No questions available for this skill.</p>
        </div>
      </div>
    );
  }
  return <MCQAssessment skillId={skillId!} skillName={skillName} questions={questions.slice(0, 30)} userId={user!.id} />;
}
