import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, Calendar, LayoutDashboard, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardHeader() {
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").then(({ data }) => {
        if (data && data.length > 0) setIsAdmin(true);
      });
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <img src="/project-logo.png" alt="EngagePredict Logo" className="w-9 h-9" />
          <span className="font-display font-bold text-lg">EngagePredict</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="hidden sm:flex">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/events")} className="hidden sm:flex">
            <Calendar className="w-4 h-4 mr-2" />
            Events
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate("/opportunities")} className="hidden sm:flex">
            <Briefcase className="w-4 h-4 mr-2" />
            Opportunities
          </Button>
          <span className="text-sm text-muted-foreground hidden md:block">{user?.email}</span>
          <ThemeToggle />
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
              <Shield className="w-4 h-4 mr-2" />
              Admin
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
