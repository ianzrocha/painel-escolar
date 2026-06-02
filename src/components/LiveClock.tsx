import { useEffect, useState } from "react";

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now ? now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--";
  const date = now ? now.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }) : "";

  return (
    <div className="text-right" suppressHydrationWarning>
      <div className="text-3xl md:text-4xl font-semibold tabular-nums tracking-tight text-foreground" suppressHydrationWarning>{time}</div>
      <div className="text-sm text-muted-foreground capitalize" suppressHydrationWarning>{date}</div>
    </div>
  );
}
