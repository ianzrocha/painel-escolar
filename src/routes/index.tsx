import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Settings, RefreshCw } from "lucide-react";
import { useSchool } from "@/lib/school-store";
import { LiveClock } from "@/components/LiveClock";
import { SummaryCard } from "@/components/SummaryCard";
import { TeacherCard } from "@/components/TeacherCard";
import { NoticeCarousel } from "@/components/NoticeCarousel";
import { UserCheckIcon } from "@/components/icons/UserCheckIcon";
import { HourglassIcon } from "@/components/icons/HourglassIcon";
import { UserXIcon } from "@/components/icons/UserXIcon";
import { UsersRoundIcon } from "@/components/icons/UsersRoundIcon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel Escolar de Presença dos Professores" },
      { name: "description", content: "Painel digital em tempo real mostrando quais professores estão presentes, a caminho ou ausentes." },
      { property: "og:title", content: "Painel Escolar de Presença" },
      { property: "og:description", content: "Visualize em tempo real a presença dos professores e avisos da escola." },
    ],
  }),
  component: Panel,
});

function Panel() {
  const { schoolName, teachers, notices } = useSchool();
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    setLastSync(new Date());
  }, [teachers, notices]);

  const counts = useMemo(() => ({
    active: teachers.filter((t) => t.status === "active").length,
    incoming: teachers.filter((t) => t.status === "incoming").length,
    absent: teachers.filter((t) => t.status === "absent").length,
    total: teachers.length,
  }), [teachers]);

  const sorted = useMemo(() => {
    const order = { active: 0, incoming: 1, absent: 2 } as const;
    return [...teachers].sort((a, b) => order[a.status] - order[b.status] || a.name.localeCompare(b.name));
  }, [teachers]);

  return (
    <div className="h-screen w-screen p-3 flex flex-col gap-3 overflow-hidden">
      {/* Header */}
      <header className="glass-strong rounded-2xl px-5 py-3 flex items-center justify-between gap-4 animate-fade-in-up shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground shadow-soft">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Painel de Presença</div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">{schoolName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LiveClock />
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 glass rounded-xl px-3 py-2 text-sm hover:scale-105 transition"
            aria-label="Área administrativa"
          >
            <Settings className="w-4 h-4" /> Admin
          </Link>
        </div>
      </header>

      {/* Summary */}
      <section className="grid grid-cols-4 gap-3 shrink-0">
        <SummaryCard label="Ativos" value={counts.active} total={counts.total} icon={UserCheckIcon} tone="success" />
        <SummaryCard label="A Caminho" value={counts.incoming} total={counts.total} icon={HourglassIcon} tone="warning" />
        <SummaryCard label="Ausentes" value={counts.absent} total={counts.total} icon={UserXIcon} tone="destructive" />
        <SummaryCard label="Total" value={counts.total} icon={UsersRoundIcon} tone="primary" />
      </section>

      {/* Main grid */}
      <section className="grid grid-cols-3 gap-3 flex-1 min-h-0">
        <div className="col-span-2 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2 px-1 shrink-0">
            <h2 className="text-base font-semibold">Professores</h2>
            <div className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground" suppressHydrationWarning>
              <RefreshCw className="w-3 h-3" />
              <span suppressHydrationWarning>
                Sincronizado às {lastSync ? lastSync.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
              </span>
            </div>
          </div>
          <div
            className="grid gap-2 flex-1 min-h-0 overflow-y-auto"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
              gridAutoRows: "auto",
            }}
          >
            {sorted.map((t) => <TeacherCard key={t.id} teacher={t} />)}
          </div>
        </div>

        <aside className="col-span-1 min-h-0">
          <NoticeCarousel notices={notices} />
        </aside>
      </section>
    </div>
  );
}
