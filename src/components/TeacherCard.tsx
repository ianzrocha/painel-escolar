import { DoorOpen, BookOpen } from "lucide-react";
import { statusMeta, type Teacher } from "@/lib/school-store";

export function TeacherCard({ teacher }: { teacher: Teacher }) {
  const meta = statusMeta[teacher.status];

  return (
    <div className={`glass rounded-xl p-3 ring-1 ${meta.ring} animate-fade-in-up flex flex-col gap-2 min-h-24`}>
      <div className="flex-grow">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg truncate">{teacher.name}</h3>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${meta.bg} ${meta.color} shrink-0`}>
            <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} animate-pulse-dot`} />
            {meta.label}
          </span>
        </div>

        <div className="flex items-stretch gap-1.5">
          <div className="flex-0.8 flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/20 px-2 py-1">
            <DoorOpen className="w-3.5 h-3.5 text-primary shrink-0" />
            <div className="min-w-0">
              {/* SALAS PEQUENA <div className="text-[8px] uppercase tracking-wider text-primary/70 leading-none font-bold">Sala</div> */}
              <div className="text-sm font-extrabold text-primary leading-tight truncate">{teacher.room}</div>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-1.5 rounded-lg bg-secondary px-2 py-1">
            <BookOpen className="w-4 h-4 text-foreground/60 shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground leading-none font-bold">Matéria</div>
              <div className="text-sm font-semibold leading-tight truncate">{teacher.subject}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
