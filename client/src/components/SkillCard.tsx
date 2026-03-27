import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code, Database, Globe, Palette, Cpu, Zap, Microchip, MonitorSmartphone,
  Layout, Layers, Server, Terminal, Bot, HardDrive, CircuitBoard, Binary, Cpu as Chip
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconMap: Record<string, React.ElementType> = {
  code: Code,
  database: Database,
  globe: Globe,
  palette: Palette,
  cpu: Cpu,
  zap: Zap,
  chip: Chip,
  microchip: Microchip,
  layout: Layout,
  layers: Layers,
  server: Server,
  terminal: Terminal,
  bot: Bot,
  "hard-drive": HardDrive,
  "circuit-board": CircuitBoard,
  binary: Binary,
};

interface SkillCardProps {
  id: string;
  name: string;
  domain: string;
  description: string;
  icon: string;
  totalLevels?: number;
  progress?: { level: number; passed: boolean }[];
}

export default function SkillCard({ id, name, domain, description, icon, totalLevels = 3, progress }: SkillCardProps) {
  const navigate = useNavigate();
  const Icon = iconMap[icon] || MonitorSmartphone;
  const completedLevels = progress?.filter(p => p.passed).length || 0;

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 border-border/50 overflow-hidden"
      onClick={() => navigate(`/skill/${id}`)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center shadow-glow group-hover:animate-pulse-glow transition-all">
            <Icon className="w-6 h-6 text-primary-foreground" />
          </div>
          <Badge variant="outline" className="text-xs capitalize">
            {domain}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold font-display mb-1 group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>

        {/* Progress indicator */}
        <div className="flex gap-2">
          {Array.from({ length: totalLevels }).map((_, i) => {
            const level = i + 1;
            const levelProgress = progress?.find(p => p.level === level);
            return (
              <div
                key={level}
                className={`h-1.5 flex-1 rounded-full transition-colors ${levelProgress?.passed
                    ? "bg-success"
                    : "bg-muted"
                  }`}
              />
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {completedLevels}/{totalLevels} level{totalLevels !== 1 ? 's' : ''} completed
        </p>
      </CardContent>
    </Card>
  );
}
