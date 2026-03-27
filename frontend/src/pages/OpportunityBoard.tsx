import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Search, Briefcase, Trophy, Code2, MapPin, Clock, ExternalLink,
  Bookmark, BookmarkCheck, Filter, TrendingUp, Star, ChevronRight,
  Building2, GraduationCap, IndianRupee, Globe, CheckCircle2,
  Circle, XCircle, Zap, Award, Users, CalendarDays, Bell
} from "lucide-react";

// ---------- Data Types ----------
type OpportunityType = "Internship" | "Hackathon" | "Competition" | "Research";
type AppStatus = "saved" | "applied" | "interview" | "rejected" | "offered";
type Mode = "Remote" | "On-site" | "Hybrid";

interface Opportunity {
  id: number;
  title: string;
  company: string;
  type: OpportunityType;
  domain: string[];
  skills: string[];
  location: string;
  mode: Mode;
  stipend: string;
  duration: string;
  deadline: string;
  description: string;
  logo: string;
  applyLink: string;
  featured?: boolean;
  openings?: number;
}

interface TrackedApp {
  id: number;
  status: AppStatus;
  appliedDate?: string;
  notes: string;
}

// ---------- Sample Data ----------
const opportunities: Opportunity[] = [
  {
    id: 1,
    title: "Software Engineering Intern",
    company: "Google India",
    type: "Internship",
    domain: ["software"],
    skills: ["Python", "React", "System Design"],
    location: "Bengaluru, India",
    mode: "Hybrid",
    stipend: "₹80,000 / month",
    duration: "3 months",
    deadline: "April 10, 2026",
    description:
      "Work alongside Google engineers to build scalable backend services and contribute to real products used by billions. Strong fundamentals in DSA and system design required.",
    logo: "G",
    applyLink: "https://careers.google.com/students/",
    featured: true,
    openings: 12,
  },
  {
    id: 2,
    title: "AI/ML Research Intern",
    company: "Microsoft Research",
    type: "Internship",
    domain: ["software"],
    skills: ["Python", "Machine Learning", "PyTorch"],
    location: "Hyderabad, India",
    mode: "Hybrid",
    stipend: "₹70,000 / month",
    duration: "6 months",
    deadline: "April 15, 2026",
    description:
      "Conduct cutting-edge research in natural language processing, computer vision, or reinforcement learning under the guidance of world-class researchers.",
    logo: "M",
    applyLink: "https://careers.microsoft.com/students/us/en/",
    featured: true,
    openings: 5,
  },
  {
    id: 3,
    title: "Smart India Hackathon 2026",
    company: "Ministry of Education, GOI",
    type: "Hackathon",
    domain: ["software", "hardware"],
    skills: ["IoT", "AI", "Web Dev", "Embedded Systems"],
    location: "Pan-India (Multiple Venues)",
    mode: "On-site",
    stipend: "₹1,00,000 Prize",
    duration: "36 Hours",
    deadline: "May 1, 2026",
    description:
      "India's biggest national hackathon inviting student teams to build tech solutions for real government challenges. Over ₹1 crore in total prizes.",
    logo: "S",
    applyLink: "https://www.sih.gov.in/",
    featured: true,
    openings: 999,
  },
  {
    id: 4,
    title: "Embedded Systems Intern",
    company: "Texas Instruments",
    type: "Internship",
    domain: ["hardware"],
    skills: ["C++", "Embedded Systems", "VLSI"],
    location: "Bengaluru, India",
    mode: "On-site",
    stipend: "₹50,000 / month",
    duration: "4 months",
    deadline: "April 20, 2026",
    description:
      "Work on next-gen microcontroller firmware and analog IC testing. Strong knowledge of embedded C and hardware debugging tools required.",
    logo: "T",
    applyLink: "https://careers.ti.com/",
    featured: false,
    openings: 8,
  },
  {
    id: 5,
    title: "Frontend Developer Intern",
    company: "Swiggy",
    type: "Internship",
    domain: ["software"],
    skills: ["React", "JavaScript", "CSS"],
    location: "Remote",
    mode: "Remote",
    stipend: "₹35,000 / month",
    duration: "2 months",
    deadline: "April 25, 2026",
    description:
      "Help build and improve Swiggy's customer-facing apps. Work on real features shipped to millions of users. Knowledge of React and performance optimization is a plus.",
    logo: "Sw",
    applyLink: "https://careers.swiggy.com/",
    featured: false,
    openings: 20,
  },
  {
    id: 6,
    title: "ISRO Young Scientist Research Program",
    company: "ISRO",
    type: "Research",
    domain: ["hardware", "common"],
    skills: ["Mathematics", "Physics", "Aptitude"],
    location: "Bengaluru / Thiruvananthapuram",
    mode: "On-site",
    stipend: "₹20,000 / month",
    duration: "6 months",
    deadline: "May 15, 2026",
    description:
      "A prestigious research fellowship program for top engineering and science students to work on live space missions and satellite systems.",
    logo: "I",
    applyLink: "https://www.isro.gov.in/",
    featured: false,
    openings: 30,
  },
  {
    id: 7,
    title: "ICPC – Asia Regional Contest",
    company: "ICPC Foundation",
    type: "Competition",
    domain: ["software"],
    skills: ["DSA", "Algorithms", "C++", "Java"],
    location: "Multiple Venues Across Asia",
    mode: "On-site",
    stipend: "Cash Prizes + Global Recognition",
    duration: "5 Hours",
    deadline: "September 30, 2026",
    description:
      "The world's oldest and most prestigious collegiate programming contest. Compete against top teams globally and qualify for the ICPC World Finals.",
    logo: "IC",
    applyLink: "https://icpc.global/",
    featured: false,
    openings: 999,
  },
  {
    id: 8,
    title: "Data Engineering Intern",
    company: "Flipkart",
    type: "Internship",
    domain: ["software"],
    skills: ["SQL", "Python", "Spark", "Kafka"],
    location: "Bengaluru, India",
    mode: "Hybrid",
    stipend: "₹40,000 / month",
    duration: "3 months",
    deadline: "April 30, 2026",
    description:
      "Build and manage data pipelines that process petabytes of e-commerce data. Work with Spark, Kafka, and Airflow to enable real-time analytics.",
    logo: "F",
    applyLink: "https://www.flipkartcareers.com/",
    featured: false,
    openings: 15,
  },
];

const allDomains = ["All", "software", "hardware", "common"];
const allTypes: (OpportunityType | "All")[] = ["All", "Internship", "Hackathon", "Competition", "Research"];
const allModes: (Mode | "All")[] = ["All", "Remote", "On-site", "Hybrid"];
const allSkillFilters = ["All", "Python", "React", "JavaScript", "C++", "SQL", "IoT", "AI", "DSA", "Embedded Systems", "Machine Learning"];

const typeStyles: Record<OpportunityType, string> = {
  Internship: "bg-blue-500/10 text-blue-400 border-blue-400/30",
  Hackathon: "bg-purple-500/10 text-purple-400 border-purple-400/30",
  Competition: "bg-yellow-500/10 text-yellow-500 border-yellow-400/30",
  Research: "bg-emerald-500/10 text-emerald-400 border-emerald-400/30",
};

const modeStyles: Record<Mode, string> = {
  Remote: "bg-cyan-500/10 text-cyan-400 border-cyan-400/30",
  "On-site": "bg-orange-500/10 text-orange-400 border-orange-400/30",
  Hybrid: "bg-violet-500/10 text-violet-400 border-violet-400/30",
};

const statusConfig: Record<AppStatus, { label: string; color: string; icon: React.ElementType }> = {
  saved: { label: "Saved", color: "text-muted-foreground", icon: Bookmark },
  applied: { label: "Applied", color: "text-blue-400", icon: CheckCircle2 },
  interview: { label: "Interview", color: "text-yellow-400", icon: Users },
  rejected: { label: "Rejected", color: "text-destructive", icon: XCircle },
  offered: { label: "Offered 🎉", color: "text-emerald-400", icon: Award },
};

const logoColors = [
  "from-violet-600 to-indigo-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-pink-500 to-rose-600",
  "from-yellow-500 to-amber-600",
];

const STORAGE_KEY = "opportunity_tracker";

export default function OpportunityBoard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<OpportunityType | "All">("All");
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [selectedMode, setSelectedMode] = useState<Mode | "All">("All");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [activeTab, setActiveTab] = useState<"browse" | "tracker">("browse");
  const [tracked, setTracked] = useState<Record<number, TrackedApp>>({});
  const [noteInput, setNoteInput] = useState<Record<number, string>>({});

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setTracked(JSON.parse(saved));
  }, []);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tracked));
  }, [tracked]);

  const filtered = opportunities.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      o.title.toLowerCase().includes(q) ||
      o.company.toLowerCase().includes(q) ||
      o.skills.some((s) => s.toLowerCase().includes(q));
    const matchType = selectedType === "All" || o.type === selectedType;
    const matchDomain = selectedDomain === "All" || o.domain.includes(selectedDomain);
    const matchMode = selectedMode === "All" || o.mode === selectedMode;
    const matchSkill = selectedSkill === "All" || o.skills.includes(selectedSkill);
    return matchSearch && matchType && matchDomain && matchMode && matchSkill;
  });

  const featured = filtered.filter((o) => o.featured);
  const regular = filtered.filter((o) => !o.featured);
  const trackedList = opportunities.filter((o) => tracked[o.id]);

  function updateStatus(id: number, status: AppStatus) {
    setTracked((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        id,
        status,
        appliedDate: status === "applied" ? new Date().toLocaleDateString() : prev[id]?.appliedDate,
        notes: prev[id]?.notes || "",
      },
    }));
  }

  function toggleSave(id: number) {
    if (tracked[id]) {
      setTracked((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } else {
      updateStatus(id, "saved");
    }
  }

  function saveNote(id: number) {
    setTracked((prev) => ({
      ...prev,
      [id]: { ...prev[id], notes: noteInput[id] || "" },
    }));
  }

  const trackerStats = {
    total: trackedList.length,
    applied: trackedList.filter((o) => tracked[o.id]?.status === "applied").length,
    interview: trackedList.filter((o) => tracked[o.id]?.status === "interview").length,
    offered: trackedList.filter((o) => tracked[o.id]?.status === "offered").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-blue-500/5 via-background to-purple-500/5">
        <div className="container mx-auto px-4 py-12 max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 font-medium mb-5">
            <Briefcase className="w-3.5 h-3.5" />
            Internships · Hackathons · Competitions · Research
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Opportunity Board
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Curated opportunities for college students — matched to your skills. Track your applications in one place.
          </p>
          <div className="flex flex-wrap items-center gap-6 justify-center mt-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-blue-400" /> {opportunities.filter(o => o.type === "Internship").length} Internships</span>
            <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-yellow-400" /> {opportunities.filter(o => o.type === "Hackathon" || o.type === "Competition").length} Contests</span>
            <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-emerald-400" /> {opportunities.filter(o => o.type === "Research").length} Research</span>
            <span className="flex items-center gap-1.5"><Bell className="w-4 h-4 text-violet-400" /> {trackedList.length} Tracked by You</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 bg-muted/50 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "browse" ? "bg-card shadow text-foreground border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Globe className="w-4 h-4 inline mr-2" />Browse All
          </button>
          <button
            onClick={() => setActiveTab("tracker")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "tracker" ? "bg-card shadow text-foreground border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
          >
            <CheckCircle2 className="w-4 h-4 inline mr-2" />My Tracker
            {trackedList.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">{trackedList.length}</span>
            )}
          </button>
        </div>

        {activeTab === "browse" && (
          <>
            {/* Filters */}
            <div className="space-y-3 mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title, company, or skill..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground">Type:</span>
                {allTypes.map((t) => (
                  <button key={t} onClick={() => setSelectedType(t as any)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${selectedType === t ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border/50 text-muted-foreground hover:border-primary/40"}`}>
                    {t}
                  </button>
                ))}
                <div className="w-px h-4 bg-border/50 mx-1" />
                <span className="text-xs text-muted-foreground">Domain:</span>
                {allDomains.map((d) => (
                  <button key={d} onClick={() => setSelectedDomain(d)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize ${selectedDomain === d ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border/50 text-muted-foreground hover:border-primary/40"}`}>
                    {d}
                  </button>
                ))}
                <div className="w-px h-4 bg-border/50 mx-1" />
                <span className="text-xs text-muted-foreground">Mode:</span>
                {allModes.map((m) => (
                  <button key={m} onClick={() => setSelectedMode(m as any)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${selectedMode === m ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 border-border/50 text-muted-foreground hover:border-primary/40"}`}>
                    {m}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-muted-foreground ml-6">Skills:</span>
                {allSkillFilters.map((s) => (
                  <button key={s} onClick={() => setSelectedSkill(s)}
                    className={`px-2.5 py-1 rounded-md text-xs border transition-all ${selectedSkill === s ? "bg-primary/20 text-primary border-primary/50" : "bg-muted/30 border-border/40 text-muted-foreground hover:border-primary/30"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Cards */}
            {featured.length > 0 && (
              <div className="mb-10">
                <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Featured Opportunities
                </h2>
                <div className="grid md:grid-cols-3 gap-5">
                  {featured.map((opp, i) => {
                    const isTracked = !!tracked[opp.id];
                    const status = tracked[opp.id]?.status;
                    return (
                      <Card key={opp.id} className="relative border-border/50 shadow-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${logoColors[i % logoColors.length]}`} />
                        <CardHeader className="pb-2 pt-5">
                          <div className="flex items-start justify-between">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${logoColors[i % logoColors.length]} flex items-center justify-center text-white font-bold text-lg shadow`}>
                              {opp.logo}
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                              <Badge className={`text-xs border ${typeStyles[opp.type]}`}>{opp.type}</Badge>
                              <Badge className={`text-xs border ${modeStyles[opp.mode]}`}>{opp.mode}</Badge>
                            </div>
                          </div>
                          <div className="mt-3">
                            <h3 className="font-bold text-base group-hover:text-primary transition-colors leading-snug">{opp.title}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3" /> {opp.company}
                            </p>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{opp.description}</p>
                          <div className="space-y-1.5 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5"><IndianRupee className="w-3 h-3 text-emerald-500" /><span className="font-medium text-emerald-500">{opp.stipend}</span></div>
                            <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{opp.duration}</div>
                            <div className="flex items-center gap-1.5"><CalendarDays className="w-3 h-3 text-red-400" />Deadline: {opp.deadline}</div>
                            <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-blue-400" />{opp.location}</div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {opp.skills.map((s) => (
                              <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-muted/60 border border-border/40 text-muted-foreground">{s}</span>
                            ))}
                          </div>
                          {status && <div className={`text-xs font-medium flex items-center gap-1 ${statusConfig[status].color}`}>
                            {(() => { const Ic = statusConfig[status].icon; return <Ic className="w-3 h-3" />; })()} {statusConfig[status].label}
                          </div>}
                          <div className="flex gap-2 pt-1">
                            <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => window.open(opp.applyLink, "_blank", "noopener,noreferrer")}>
                            Apply <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                            <Button size="sm" variant="outline" className={`h-8 px-2.5 ${isTracked ? "text-primary border-primary/50" : ""}`} onClick={() => toggleSave(opp.id)}>
                              {isTracked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Regular List */}
            {regular.length > 0 && (
              <div>
                <h2 className="text-base font-semibold mb-4">All Opportunities <span className="text-muted-foreground font-normal text-sm">({filtered.length})</span></h2>
                <div className="space-y-3">
                  {regular.map((opp, i) => {
                    const isTracked = !!tracked[opp.id];
                    const status = tracked[opp.id]?.status;
                    return (
                      <Card key={opp.id} className="border-border/50 shadow-card hover:border-primary/30 hover:shadow-md transition-all group">
                        <CardContent className="p-5">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${logoColors[(i + 3) % logoColors.length]} flex items-center justify-center text-white font-bold text-base shadow shrink-0`}>
                              {opp.logo}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{opp.title}</h3>
                                <Badge className={`text-[10px] border ${typeStyles[opp.type]}`}>{opp.type}</Badge>
                                <Badge className={`text-[10px] border ${modeStyles[opp.mode]}`}>{opp.mode}</Badge>
                                {status && (
                                  <span className={`text-[10px] font-medium flex items-center gap-0.5 ${statusConfig[status].color}`}>
                                    {(() => { const Ic = statusConfig[status].icon; return <Ic className="w-2.5 h-2.5" />; })()} {statusConfig[status].label}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><Building2 className="w-3 h-3" />{opp.company}</p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                                <span className="flex items-center gap-1 text-emerald-500 font-medium"><IndianRupee className="w-3 h-3" />{opp.stipend}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{opp.duration}</span>
                                <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3 text-red-400" />Deadline: {opp.deadline}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-400" />{opp.location}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {opp.skills.map((s) => (
                                  <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-muted/60 border border-border/40 text-muted-foreground">{s}</span>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => window.open(opp.applyLink, "_blank", "noopener,noreferrer")}>
                              Apply <ChevronRight className="w-3 h-3" />
                            </Button>
                              <Button size="sm" variant="ghost" className={`h-8 px-2 ${isTracked ? "text-primary" : "text-muted-foreground"}`} onClick={() => toggleSave(opp.id)}>
                                {isTracked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                <p className="text-muted-foreground text-lg">No opportunities match your filters.</p>
                <Button variant="ghost" className="mt-3" onClick={() => { setSearch(""); setSelectedType("All"); setSelectedDomain("All"); setSelectedMode("All"); setSelectedSkill("All"); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}

        {/* ── Tracker Tab ── */}
        {activeTab === "tracker" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Saved", value: trackerStats.total, color: "text-muted-foreground", icon: Bookmark },
                { label: "Applied", value: trackerStats.applied, color: "text-blue-400", icon: CheckCircle2 },
                { label: "Interview", value: trackerStats.interview, color: "text-yellow-400", icon: Users },
                { label: "Offers", value: trackerStats.offered, color: "text-emerald-400", icon: Award },
              ].map(({ label, value, color, icon: Icon }) => (
                <Card key={label} className="border-border/50 shadow-card">
                  <CardContent className="p-5 flex items-center gap-4">
                    <Icon className={`w-7 h-7 ${color}`} />
                    <div>
                      <p className="text-2xl font-bold font-display">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Progress Bar */}
            {trackerStats.applied > 0 && (
              <Card className="border-border/50 shadow-card">
                <CardContent className="p-5">
                  <p className="text-sm font-medium mb-2">Application Pipeline</p>
                  <div className="space-y-2">
                    {(["applied", "interview", "offered", "rejected"] as AppStatus[]).map((s) => {
                      const count = trackedList.filter((o) => tracked[o.id]?.status === s).length;
                      const pct = trackerStats.total ? Math.round((count / trackerStats.total) * 100) : 0;
                      return (
                        <div key={s} className="flex items-center gap-3 text-xs">
                          <span className={`w-20 text-right font-medium ${statusConfig[s].color}`}>{statusConfig[s].label}</span>
                          <Progress value={pct} className="flex-1 h-2" />
                          <span className="w-8 text-muted-foreground">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tracked Items */}
            {trackedList.length === 0 ? (
              <div className="text-center py-20">
                <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
                <p className="text-muted-foreground text-lg">No opportunities tracked yet.</p>
                <Button variant="ghost" className="mt-3" onClick={() => setActiveTab("browse")}>
                  Browse Opportunities
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-base font-semibold">Tracked Opportunities</h2>
                {trackedList.map((opp, i) => {
                  const app = tracked[opp.id];
                  return (
                    <Card key={opp.id} className="border-border/50 shadow-card">
                      <CardContent className="p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${logoColors[i % logoColors.length]} flex items-center justify-center text-white font-bold text-sm shadow shrink-0`}>
                            {opp.logo}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm">{opp.title}</p>
                            <p className="text-xs text-muted-foreground">{opp.company} · {opp.type}</p>
                            {app.appliedDate && <p className="text-xs text-muted-foreground mt-0.5">Applied: {app.appliedDate}</p>}
                          </div>
                          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs h-7" onClick={() => toggleSave(opp.id)}>
                            Remove
                          </Button>
                        </div>

                        {/* Status buttons */}
                        <div className="flex flex-wrap gap-1.5">
                          {(Object.keys(statusConfig) as AppStatus[]).map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(opp.id, s)}
                              className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${app.status === s ? `${statusConfig[s].color} bg-muted border-current` : "text-muted-foreground border-border/40 hover:border-primary/30 bg-muted/30"}`}
                            >
                              {statusConfig[s].label}
                            </button>
                          ))}
                        </div>

                        {/* Notes */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add a note (interview date, contact, etc.)..."
                            value={noteInput[opp.id] ?? app.notes ?? ""}
                            onChange={(e) => setNoteInput((prev) => ({ ...prev, [opp.id]: e.target.value }))}
                            className="text-xs h-8"
                          />
                          <Button size="sm" variant="outline" className="h-8 text-xs shrink-0" onClick={() => saveNote(opp.id)}>
                            Save Note
                          </Button>
                        </div>
                        {app.notes && noteInput[opp.id] === undefined && (
                          <p className="text-xs text-muted-foreground italic">📝 {app.notes}</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
