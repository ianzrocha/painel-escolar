import { useSyncExternalStore } from "react";

export type TeacherStatus = "active" | "incoming" | "absent";

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  room: string;
  phone: string;
  email: string;
  status: TeacherStatus;
  note?: string;
  updatedAt: number;
}

export interface Notice {
  id: string;
  text: string;
  createdAt: number;
}

interface State {
  schoolName: string;
  teachers: Teacher[];
  notices: Notice[];
}

const KEY = "school-attendance-v1";

const defaultState: State = {
  schoolName: "Escola Modelo",
  teachers: [
    { id: "1", name: "Ana Carolina Silva", subject: "Matemática", room: "Sala 12", phone: "(11) 99999-0001", email: "ana@escola.edu", status: "active", updatedAt: Date.now() },
    { id: "2", name: "Roberto Mendes", subject: "Português", room: "Sala 08", phone: "(11) 99999-0002", email: "roberto@escola.edu", status: "active", updatedAt: Date.now() },
    { id: "3", name: "Juliana Pereira", subject: "História", room: "Sala 15", phone: "(11) 99999-0003", email: "juliana@escola.edu", status: "incoming", updatedAt: Date.now() },
    { id: "4", name: "Marcos Antônio", subject: "Geografia", room: "Sala 10", phone: "(11) 99999-0004", email: "marcos@escola.edu", status: "active", updatedAt: Date.now() },
    { id: "5", name: "Patrícia Lopes", subject: "Biologia", room: "Lab. 02", phone: "(11) 99999-0005", email: "patricia@escola.edu", status: "absent", note: "Atestado médico", updatedAt: Date.now() },
    { id: "6", name: "Fernando Costa", subject: "Física", room: "Lab. 01", phone: "(11) 99999-0006", email: "fernando@escola.edu", status: "active", updatedAt: Date.now() },
    { id: "7", name: "Camila Rocha", subject: "Química", room: "Lab. 03", phone: "(11) 99999-0007", email: "camila@escola.edu", status: "incoming", updatedAt: Date.now() },
    { id: "8", name: "Luiz Eduardo", subject: "Educação Física", room: "Quadra", phone: "(11) 99999-0008", email: "luiz@escola.edu", status: "active", updatedAt: Date.now() },
    { id: "9", name: "Beatriz Almeida", subject: "Inglês", room: "Sala 06", phone: "(11) 99999-0009", email: "beatriz@escola.edu", status: "absent", updatedAt: Date.now() },
    { id: "10", name: "Ricardo Nogueira", subject: "Artes", room: "Ateliê", phone: "(11) 99999-0010", email: "ricardo@escola.edu", status: "active", updatedAt: Date.now() },
  ],
  notices: [
    { id: "n1", text: "Professor substituto na Sala 12 durante o período da tarde.", createdAt: Date.now() },
    { id: "n2", text: "Reunião pedagógica nesta sexta-feira às 18h no auditório.", createdAt: Date.now() },
    { id: "n3", text: "Feira de Ciências acontece no próximo sábado — participe!", createdAt: Date.now() },
    { id: "n4", text: "Aula de Química do 3º ano cancelada hoje.", createdAt: Date.now() },
  ],
};

let state: State = defaultState;
if (typeof window !== "undefined") state = load();
const listeners = new Set<() => void>();

function load(): State {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      state = load();
      listeners.forEach((l) => l());
    }
  });
}

export const schoolStore = {
  getState: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  setSchoolName(name: string) {
    state = { ...state, schoolName: name };
    persist();
  },
  addTeacher(t: Omit<Teacher, "id" | "updatedAt">) {
    const teacher: Teacher = { ...t, id: crypto.randomUUID(), updatedAt: Date.now() };
    state = { ...state, teachers: [...state.teachers, teacher] };
    persist();
  },
  updateTeacher(id: string, patch: Partial<Teacher>) {
    state = {
      ...state,
      teachers: state.teachers.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t)),
    };
    persist();
  },
  removeTeacher(id: string) {
    state = { ...state, teachers: state.teachers.filter((t) => t.id !== id) };
    persist();
  },
  addNotice(text: string) {
    state = { ...state, notices: [...state.notices, { id: crypto.randomUUID(), text, createdAt: Date.now() }] };
    persist();
  },
  removeNotice(id: string) {
    state = { ...state, notices: state.notices.filter((n) => n.id !== id) };
    persist();
  },
};

export function useSchool() {
  return useSyncExternalStore(
    schoolStore.subscribe,
    schoolStore.getState,
    schoolStore.getState,
  );
}

export const statusMeta: Record<TeacherStatus, { label: string; color: string; bg: string; ring: string; dot: string }> = {
  active: { label: "Ativo", color: "text-emerald-700", bg: "bg-emerald-100", ring: "ring-emerald-300", dot: "bg-emerald-500" },
  incoming: { label: "A Caminho", color: "text-amber-700", bg: "bg-amber-100", ring: "ring-amber-300", dot: "bg-amber-500" },
  absent: { label: "Ausente", color: "text-rose-700", bg: "bg-rose-100", ring: "ring-rose-300", dot: "bg-rose-500" },
};
