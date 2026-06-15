import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  student_name: string;
  highlight: string;
}

interface AppState {
  studentId: string | null;
  scenarioId: string | null;
  sidebarOpen: boolean;
  isLoggedIn: boolean;
  setStudentId: (id: string) => void;
  setScenarioId: (id: string) => void;
  setSidebarOpen: (open: boolean) => void;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      studentId: null,
      scenarioId: "first_year",
      sidebarOpen: true,
      isLoggedIn: false,
      setStudentId: (id) => set({ studentId: id }),
      setScenarioId: (id) => set({ scenarioId: id }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      login: (user, pass) => {
        if (user.trim() === "123" && pass.trim() === "123") {
          set({ isLoggedIn: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isLoggedIn: false }),
    }),
    { name: "campusverse-store" }
  )
);
