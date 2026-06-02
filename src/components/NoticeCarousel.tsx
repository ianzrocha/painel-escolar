import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import type { Notice } from "@/lib/school-store";

export function NoticeCarousel({ notices }: { notices: Notice[] }) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (notices.length <= 1) return;
    setIdx((i) => i % notices.length);
    const id = setInterval(() => setIdx((i) => (i + 1) % notices.length), 6000);
    return () => clearInterval(id);
  }, [notices.length]);

  const current = notices[idx];

  return (
    <div className="glass rounded-2xl p-4 h-full flex flex-col min-h-0">
      <div className="flex items-center gap-2.5 mb-3 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-primary-foreground shadow-soft">
          <Megaphone className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-primary font-bold">Comunicados</div>
          <div className="font-semibold text-sm">Avisos da Escola</div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
        {current ? (
          <p key={current.id} className="text-lg md:text-xl font-medium leading-snug animate-fade-in-up text-center text-foreground/90 line-clamp-6 transition-all duration-300">
            "{current.text}"
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">Nenhum aviso no momento.</p>
        )}
      </div>

      {notices.length > 1 && (
        <div className="flex gap-1.5 mt-3 justify-center shrink-0">
          {notices.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${i === idx ? "w-8 bg-red-900" : "w-2 bg-foreground/30"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
