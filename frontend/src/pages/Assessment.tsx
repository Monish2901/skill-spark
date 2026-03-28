import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  sampleQuestions,
  theoryQuestions,
  practicalAssessments,
  type SampleQuestion,
  type TheoryQuestion,
  type PracticalAssessment as PracticalType
} from "@/lib/sample-questions";
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
import PracticalAssessment from "@/components/assessment/PracticalAssessment";

import { getSkillByVirtualId } from "@/lib/skills-data";
import { communicationL1, communicationPassage } from "@/lib/communication-mcq";
import { aptitudeL1, aptitudeL2, aptitudeL3 } from "@/lib/aptitude-mcq";
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
import { 
  htmlL2, htmlL3, cssL2, cssL3, dbmsL2, dbmsL3, cL2, cL3,
  digitalElectronicsL2, digitalElectronicsL3,
  analogElectronicsL2, analogElectronicsL3,
  embeddedSystemsL2, embeddedSystemsL3
} from "@/lib/additional-mcqs";


export default function Assessment() {
  const { skillId, level } = useParams<{ skillId: string; level: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const levelNum = parseInt(level || "1");

  const [skillName, setSkillName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSkill() {
      // Try to find the skill in the database
      const { data, error } = await supabase.from("skills").select("name").eq("id", skillId!).single();
      
      if (data) {
        setSkillName(data.name);
      } else if (error) {
        console.warn("Skill ID lookup failed, trying name fallback:", error);
        // Fallback: if skillId is actually a name or from virtual, try name check
        const virtualSkill = getSkillByVirtualId(skillId);
        if (virtualSkill) {
          setSkillName(virtualSkill.name);
        } else {
          // One last try: check if the skillId is actually a name
          const { data: nameData } = await supabase.from("skills").select("name").ilike("name", skillId!.replace(/-/g, ' ')).single();
          if (nameData) setSkillName(nameData.name);
        }
      }
      setLoading(false);
    }
    if (user && skillId) loadSkill();
  }, [skillId, user]);

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

  // Specialized MCQ content for 3 levels (Aptitude, OOPS, GK, etc.)
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
    "HTML-2": htmlL2, "HTML-3": htmlL3,
    "CSS-2": cssL2, "CSS-3": cssL3,
    "DBMS-2": dbmsL2, "DBMS-3": dbmsL3,
    "C-2": cL2, "C-3": cL3,
    "Digital Electronics-2": digitalElectronicsL2, "Digital Electronics-3": digitalElectronicsL3,
    "Analog Electronics-2": analogElectronicsL2, "Analog Electronics-3": analogElectronicsL3,
    "Embedded Systems-2": embeddedSystemsL2, "Embedded Systems-3": embeddedSystemsL3,
  };

  const specializedKey = `${skillName}-${levelNum}`;
  
  // Define pass marks based on level and skill
  const isExempt = skillName === "Aptitude" || skillName === "Communication Skills";
  let passPercentage = 70;
  if (!isExempt) {
    if (levelNum === 2) passPercentage = 80;
    if (levelNum === 3) passPercentage = 90;
  } else if (skillName === "Communication Skills") {
    passPercentage = 90;
  }

  // 1. Check for specialized MCQ content first
  if (specializedMcqs[specializedKey]) {
    const questions = specializedMcqs[specializedKey];
    
    return (
      <MCQAssessment 
        skillId={skillId!} 
        skillName={skillName} 
        level={levelNum} 
        questions={skillName === "Communication Skills" ? questions : questions.slice(0, 30)} 
        userId={user!.id} 
        passage={skillName === "Communication Skills" ? communicationPassage : undefined}
        passPercentage={passPercentage}
        disableNegativeMarking={isExempt}
      />
    );
  }

  // 2. For regular skills (non-exempt), always use MCQ for all levels
  if (!isExempt) {
    // Try to get questions from sampleQuestions (Level 1 source)
    // We'll use the same pool but maybe slice differently or just take the first 30
    const questions = sampleQuestions[skillName];
    if (questions && questions.length > 0) {
      return (
        <MCQAssessment 
          skillId={skillId!} 
          skillName={skillName} 
          level={levelNum} 
          questions={questions.slice(0, 30)} 
          userId={user!.id}
          passPercentage={passPercentage}
        />
      );
    }
  }

  // 3. Fallback/Original logic for exempt skills or missing data
  
  // Handle Level 3 Practical for original skills
  if (levelNum === 3) {
    const tasks = practicalAssessments[skillName];
    if (tasks && tasks.length > 0) {
      return <PracticalAssessment skillId={skillId!} skillName={skillName} tasks={tasks} userId={user!.id} />;
    }
  }

  // Handle Level 2 Theory for original skills
  if (levelNum === 2) {
    const questions = theoryQuestions[skillName];
    if (questions && questions.length > 0) {
      return <TheoryAssessment skillId={skillId!} skillName={skillName} questions={questions} userId={user!.id} />;
    }
  }

  // Final fallback to Level 1 MCQ or Error
  const questions = sampleQuestions[skillName];
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">No assessment available for {skillName} at Level {levelNum} yet.</p>
        </div>
      </div>
    );
  }
  return <MCQAssessment skillId={skillId!} skillName={skillName} level={levelNum} questions={questions.slice(0, 30)} userId={user!.id} passPercentage={passPercentage} />;
}

