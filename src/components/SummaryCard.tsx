import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

type Tone = "success" | "warning" | "destructive" | "primary";

interface Props {
  label: string;
  value: number;
  total?: number;
  icon: LucideIcon | ComponentType<{ className?: string }>;
  tone: Tone;
}

const toneMap: Record<Tone, { chip: string; icon: string; bar: string }> = {
  success:     { chip: "text-emerald-700 bg-emerald-100", icon: "bg-red-700",  bar: "bg-emerald-500" },
  warning:     { chip: "text-amber-700 bg-amber-100",     icon: "bg-red-700",    bar: "bg-amber-500" },
  destructive: { chip: "text-rose-700 bg-rose-100",       icon: "bg-red-700",     bar: "bg-rose-500" },
  primary:     { chip: "text-primary bg-accent",          icon: "bg-red-700", bar: "bg-primary" },
};

export function SummaryCard({ label, value, total, icon: Icon, tone }: Props) {
  const pct = total ? Math.round((value / total) * 100) : 100;
  const t = toneMap[tone];
  return (
    <div className="glass rounded-2xl p-3 relative overflow-hidden animate-fade-in-up">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
          <div className="mt-0.5 text-3xl font-bold tabular-nums leading-none">{value}</div>
           {total !== undefined && (
            <div className={`text-[10px] mt-1 font-medium inline-block px-1.5 py-0.5 rounded ${t.chip}`}>{pct}% do total</div>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${t.icon} flex items-center justify-center text-white shadow-soft shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {total !== undefined && (
        <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
          <div className={`h-full ${t.bar} transition-all`} style={{ width: `${pct}%` }} />
        </div>
      )}
    </div>
  );
}
