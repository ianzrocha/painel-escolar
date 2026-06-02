import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Search, Trash2, Pencil, Save, X, Megaphone, GraduationCap } from "lucide-react";
import { schoolStore, statusMeta, useSchool, type Teacher, type TeacherStatus } from "@/lib/school-store";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração — Painel Escolar" },
      { name: "description", content: "Gerencie professores, status e avisos da escola." },
    ],
  }),
  component: Admin,
});

const ADMIN_PASS = "admin123";

function Admin() {
  const [authed, setAuthed] = useState(() => typeof window !== "undefined" && sessionStorage.getItem("admin-ok") === "1");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pass === ADMIN_PASS) {
              sessionStorage.setItem("admin-ok", "1");
              setAuthed(true);
            } else setErr("Senha incorreta");
          }}
          className="glass-strong rounded-3xl p-8 w-full max-w-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-info flex items-center justify-center text-white shadow-soft mb-4">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold">Área Administrativa</h1>
          <p className="text-sm text-muted-foreground mt-1">Digite a senha para continuar.</p>
          <input
            type="password"
            value={pass}
            onChange={(e) => { setPass(e.target.value); setErr(""); }}
            placeholder="Senha"
            className="mt-5 w-full px-4 py-3 rounded-xl bg-secondary/60 border border-border outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
          {err && <p className="text-xs text-rose-600 mt-2">{err}</p>}
          <button type="submit" className="mt-4 w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
            Entrar
          </button>
          <p className="text-xs text-muted-foreground mt-3 text-center">Dica: senha padrão <code>admin123</code></p>
        </form>
      </div>
    );
  }

  return <AdminPanel />;
}

function AdminPanel() {
  const { teachers, notices, schoolName } = useSchool();
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<TeacherStatus | "">("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newNotice, setNewNotice] = useState("");  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const subjects = useMemo(() => Array.from(new Set(teachers.map((t) => t.subject))).sort(), [teachers]);

  const filtered = useMemo(() => teachers.filter((t) => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (subjectFilter && t.subject !== subjectFilter) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    return true;
  }), [teachers, search, subjectFilter, statusFilter]);

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <header className="glass-strong rounded-3xl p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="glass rounded-xl p-2 hover:scale-105 transition" aria-label="Voltar ao painel">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Administração</div>
            <h1 className="text-2xl font-bold">{schoolName}</h1>
          </div>
        </div>
        <input
          value={schoolName}
          onChange={(e) => schoolStore.setSchoolName(e.target.value)}
          className="hidden md:block px-3 py-2 rounded-xl bg-secondary/60 border border-border text-sm outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          placeholder="Nome da escola"
        />
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-3xl p-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar professor..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-secondary/60 border border-border outline-none focus:ring-2 focus:ring-primary text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="px-3 py-2 rounded-xl bg-secondary/60 border border-border text-sm outline-none text-foreground">
                <option value="">Todas disciplinas</option>
                {subjects.map((s) => <option key={s}>{s}</option>)}
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as TeacherStatus | "")} className="px-3 py-2 rounded-xl bg-secondary/60 border border-border text-sm outline-none text-foreground">
                <option value="">Todos status</option>
                <option value="active">Ativo</option>
                <option value="incoming">A Caminho</option>
                <option value="absent">Ausente</option>
              </select>
              <button onClick={() => { setShowForm(true); setEditingId(null); }} className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition">
                <Plus className="w-4 h-4" /> Novo
              </button>
            </div>
          </div>

          {showForm && <TeacherForm onClose={() => setShowForm(false)} />}

          <div className="space-y-3">
            {filtered.map((t) => (
              editingId === t.id
                ? <TeacherForm key={t.id} teacher={t} onClose={() => setEditingId(null)} />
                : <TeacherRow key={t.id} teacher={t} onEdit={() => setEditingId(t.id)} onDelete={() => setDeleteConfirm({ id: t.id, name: t.name })} />
            ))}
            {filtered.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhum professor encontrado.</p>}
          </div>
        </div>

        {deleteConfirm && (
          <AlertDialog open={true} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remover Professor</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja remover <strong>{deleteConfirm.name}</strong>? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeleteConfirm(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => { 
                    schoolStore.removeTeacher(deleteConfirm.id); 
                    setDeleteConfirm(null); 
                  }}
                  className="bg-rose-600 hover:bg-rose-700"
                >
                  Remover
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <aside className="glass rounded-3xl p-5 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold">Avisos</h2>
          </div>
          <div className="flex gap-2 mb-4">
            <input
              value={newNotice}
              onChange={(e) => setNewNotice(e.target.value)}
              placeholder="Novo aviso..."
              className="flex-1 px-3 py-2 rounded-xl bg-secondary/60 border border-border text-sm outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
            <button
              onClick={() => { if (newNotice.trim()) { schoolStore.addNotice(newNotice.trim()); setNewNotice(""); } }}
              className="bg-primary text-primary-foreground px-3 rounded-xl"
            ><Plus className="w-4 h-4" /></button>
          </div>
          <ul className="space-y-2">
            {notices.map((n) => (
              <li key={n.id} className="flex items-start gap-2 text-sm bg-secondary/40 rounded-xl p-3">
                <span className="flex-1">{n.text}</span>
                <button onClick={() => schoolStore.removeNotice(n.id)} className="text-rose-400 hover:text-rose-300" aria-label="Remover">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}

function TeacherRow({ teacher, onEdit, onDelete }: { teacher: Teacher; onEdit: () => void; onDelete: () => void }) {
  const meta = statusMeta[teacher.status];
  return (
    <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3">
      <div className="flex-1 min-w-[200px]">
        <div className="font-semibold">{teacher.name}</div>
        <div className="text-xs text-muted-foreground">{teacher.subject} • {teacher.room}</div>
      </div>
      <select
        value={teacher.status}
        onChange={(e) => schoolStore.updateTeacher(teacher.id, { status: e.target.value as TeacherStatus })}
        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${meta.bg} ${meta.color} border-0 outline-none cursor-pointer`}
      >
        <option value="active">🟢 Ativo</option>
        <option value="incoming">🟠 A Caminho</option>
        <option value="absent">🔴 Ausente</option>
      </select>
      <button onClick={onEdit} className="p-2 rounded-lg hover:bg-secondary" aria-label="Editar">
        <Pencil className="w-4 h-4" />
      </button>
      <button onClick={onDelete} className="p-2 rounded-lg hover:bg-rose-50 text-rose-600" aria-label="Remover">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function TeacherForm({ teacher, onClose }: { teacher?: Teacher; onClose: () => void }) {
  const [form, setForm] = useState({
    name: teacher?.name ?? "",
    subject: teacher?.subject ?? "",
    room: teacher?.room ?? "",
    phone: teacher?.phone ?? "",
    email: teacher?.email ?? "",
    status: teacher?.status ?? ("active" as TeacherStatus),
    note: teacher?.note ?? "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (teacher) schoolStore.updateTeacher(teacher.id, form);
    else schoolStore.addTeacher(form);
    onClose();
  };

  const input = "px-3 py-2 rounded-xl bg-secondary/60 border border-border text-sm outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground";

  return (
    <form onSubmit={submit} className="glass-strong rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in-up">
      <input className={input} placeholder="Nome completo" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <input className={input} placeholder="Disciplina" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
      <input className={input} placeholder="Sala" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} />
      <select className={input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TeacherStatus })}>
        <option value="active">Ativo</option>
        <option value="incoming">A Caminho</option>
        <option value="absent">Ausente</option>
      </select>
      <input className={`${input} md:col-span-2`} placeholder="Observação (opcional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
      <div className="md:col-span-2 flex gap-2 justify-end">
        <button type="button" onClick={onClose} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary text-sm">
          <X className="w-4 h-4" /> Cancelar
        </button>
        <button type="submit" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
          <Save className="w-4 h-4" /> Salvar
        </button>
      </div>
    </form>
  );
}
