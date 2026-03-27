import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Calendar, MapPin, Users, Trophy, Code2, Cpu, Globe, Lightbulb,
  Search, Filter, Clock, ExternalLink, ChevronRight, Zap, Star
} from "lucide-react";

interface TechEvent {
  id: number;
  title: string;
  organizer: string;
  date: string;
  deadline: string;
  location: string;
  mode: "Online" | "Offline" | "Hybrid";
  category: string;
  description: string;
  prize: string;
  teamSize: string;
  registrationLink: string;
  tags: string[];
  featured?: boolean;
  icon: React.ElementType;
  gradient: string;
}

const events: TechEvent[] = [
  {
    id: 1,
    title: "HackSpark 2026",
    organizer: "BIT Sathy – IEEE Student Chapter",
    date: "April 12–13, 2026",
    deadline: "April 5, 2026",
    location: "BIT Sathy Campus, Coimbatore",
    mode: "Offline",
    category: "Hackathon",
    description:
      "A 24-hour national-level hackathon inviting college students to build innovative solutions around AI, IoT, and sustainability. Compete with the best minds and pitch your prototype to industry mentors.",
    prize: "₹1,00,000 Total Prize Pool",
    teamSize: "2–4 members",
    registrationLink: "https://unstop.com/hackathons",
    tags: ["AI", "IoT", "Sustainability", "Prototyping"],
    featured: true,
    icon: Zap,
    gradient: "from-violet-600 to-indigo-600",
  },
  {
    id: 2,
    title: "CodeQuest 2026",
    organizer: "CSE Department, BITS Pilani",
    date: "April 20, 2026",
    deadline: "April 15, 2026",
    location: "Online (HackerRank Platform)",
    mode: "Online",
    category: "Coding Contest",
    description:
      "An algorithmic coding competition featuring problems across data structures, dynamic programming, graphs, and competitive problem-solving. Open to all UG and PG students across India.",
    prize: "₹30,000 + Internship Opportunities",
    teamSize: "Individual",
    registrationLink: "https://www.hackerrank.com/contests",
    tags: ["DSA", "Algorithms", "Competitive Programming"],
    featured: false,
    icon: Code2,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: 3,
    title: "RoboSphere 2026",
    organizer: "Robotics Club, NIT Trichy",
    date: "May 3–4, 2026",
    deadline: "April 25, 2026",
    location: "NIT Trichy Campus",
    mode: "Offline",
    category: "Robotics",
    description:
      "Design, build, and battle autonomous robots in exciting arenas. Events include line-following, maze solver, obstacle avoidance, and a free-style robot showcase.",
    prize: "₹50,000 Total Prize Pool",
    teamSize: "2–5 members",
    registrationLink: "https://unstop.com/competitions",
    tags: ["Robotics", "Embedded Systems", "Automation"],
    featured: false,
    icon: Cpu,
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: 4,
    title: "IdeaThon – Smart Cities",
    organizer: "TechFest, IIT Bombay",
    date: "May 10, 2026",
    deadline: "May 1, 2026",
    location: "Hybrid – IIT Bombay + Online",
    mode: "Hybrid",
    category: "Ideathon",
    description:
      "Submit your innovative ideas for building smarter, greener cities. Shortlisted teams present to a panel of industry experts and government officials. Best ideas get incubation support.",
    prize: "₹75,000 + Incubation Support",
    teamSize: "1–3 members",
    registrationLink: "https://techfest.org",
    tags: ["Smart Cities", "Green Tech", "Urban Planning"],
    featured: true,
    icon: Lightbulb,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: 5,
    title: "WebWarz 2026",
    organizer: "GDSC, Anna University",
    date: "May 18, 2026",
    deadline: "May 10, 2026",
    location: "Online",
    mode: "Online",
    category: "Web Development",
    description:
      "A UI/UX and full-stack web development challenge where teams design and deploy functional web apps within 8 hours. Theme is revealed on the day of the contest.",
    prize: "₹25,000 + Google Goodies",
    teamSize: "2–3 members",
    registrationLink: "https://gdsc.community.dev",
    tags: ["Web Dev", "UI/UX", "React", "Node.js"],
    featured: false,
    icon: Globe,
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: 6,
    title: "Tech Quiz Invitational",
    organizer: "Quizzing Society, VIT Vellore",
    date: "June 1, 2026",
    deadline: "May 25, 2026",
    location: "VIT Vellore Campus",
    mode: "Offline",
    category: "Quiz",
    description:
      "An inter-college technical quiz covering topics in computer science, electronics, physics, and current tech trends. Teams of two compete in multiple elimination rounds.",
    prize: "₹20,000 + Trophies",
    teamSize: "2 members",
    registrationLink: "https://unstop.com/quizzes",
    tags: ["General Tech", "CS", "Electronics", "Quiz"],
    featured: false,
    icon: Star,
    gradient: "from-yellow-500 to-amber-600",
  },
];

const categories = ["All", "Hackathon", "Coding Contest", "Robotics", "Ideathon", "Web Development", "Quiz"];
const modes = ["All", "Online", "Offline", "Hybrid"];

const modeBadgeClass: Record<string, string> = {
  Online: "bg-emerald-500/10 text-emerald-400 border-emerald-400/30",
  Offline: "bg-blue-500/10 text-blue-400 border-blue-400/30",
  Hybrid: "bg-purple-500/10 text-purple-400 border-purple-400/30",
};

export default function TechEvents() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");

  const filtered = events.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.organizer.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory === "All" || e.category === selectedCategory;
    const matchMode = selectedMode === "All" || e.mode === selectedMode;
    return matchSearch && matchCat && matchMode;
  });

  const featured = filtered.filter((e) => e.featured);
  const regular = filtered.filter((e) => !e.featured);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      {/* Hero Banner */}
      <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        <div className="container mx-auto px-4 py-14 max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Upcoming Technical Events for Students
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Tech Events Hub
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Discover hackathons, coding contests, robotics competitions and more — curated for college students across India.
          </p>
          <div className="flex items-center gap-6 justify-center mt-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {events.length} Upcoming Events</span>
            <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-yellow-500" /> ₹3L+ in Prizes</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-blue-500" /> Open to All Colleges</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events, tags, or organizers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  selectedCategory === c
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
            <div className="w-px h-5 bg-border/50 mx-1" />
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMode(m)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  selectedMode === m
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-muted/50 border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Events */}
        {featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold font-display mb-5 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Featured Events
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((event) => {
                const Icon = event.icon;
                return (
                  <Card
                    key={event.id}
                    className="relative overflow-hidden border-border/50 shadow-card hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                  >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${event.gradient}`} />
                    <CardHeader className="pb-3 pt-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${event.gradient} text-white shadow`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex gap-2">
                          <Badge className={`text-xs border ${modeBadgeClass[event.mode]}`}>{event.mode}</Badge>
                          <Badge variant="outline" className="text-xs">{event.category}</Badge>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{event.organizer}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 text-orange-500" />
                          <span>Deadline: {event.deadline}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{event.teamSize}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-sm font-semibold text-yellow-500">{event.prize}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {event.tags.map((t) => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-muted/70 text-muted-foreground border border-border/40">{t}</span>
                        ))}
                      </div>
                      <Button 
                        className={`w-full bg-gradient-to-r ${event.gradient} text-white border-0 hover:opacity-90 transition-opacity`}
                        onClick={() => window.open(event.registrationLink, "_blank", "noopener,noreferrer")}
                      >
                        Register Now <ExternalLink className="w-3.5 h-3.5 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Events */}
        {regular.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold font-display mb-5">All Events</h2>
            <div className="grid gap-4">
              {regular.map((event) => {
                const Icon = event.icon;
                return (
                  <Card
                    key={event.id}
                    className="border-border/50 shadow-card hover:shadow-md transition-all duration-200 group hover:border-primary/30"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-5">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${event.gradient} text-white shadow shrink-0 self-start`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-base font-bold font-display group-hover:text-primary transition-colors">{event.title}</h3>
                            <Badge className={`text-xs border ${modeBadgeClass[event.mode]}`}>{event.mode}</Badge>
                            <Badge variant="outline" className="text-xs">{event.category}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{event.organizer}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{event.description}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-primary" />{event.date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-orange-500" />Deadline: {event.deadline}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-500" />{event.location}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3 text-emerald-500" />{event.teamSize}</span>
                            <span className="flex items-center gap-1 font-semibold text-yellow-500"><Trophy className="w-3 h-3" />{event.prize}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {event.tags.map((t) => (
                              <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-muted/70 text-muted-foreground border border-border/40">{t}</span>
                            ))}
                          </div>
                        </div>
                        <div className="shrink-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-1.5 group-hover:border-primary group-hover:text-primary transition-colors"
                          onClick={() => window.open(event.registrationLink, "_blank", "noopener,noreferrer")}
                        >
                          Register <ChevronRight className="w-3.5 h-3.5" />
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
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
            <p className="text-muted-foreground text-lg">No events found matching your filters.</p>
            <Button variant="ghost" className="mt-3" onClick={() => { setSearch(""); setSelectedCategory("All"); setSelectedMode("All"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
