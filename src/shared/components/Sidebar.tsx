import { Link, NavLink } from "react-router-dom";
import { PawPrint, Plus, LogOut } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 bg-gradient-to-b from-teal-600 to-teal-700 text-white flex-col">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold">Pet-MT</div>
            <div className="text-xs text-white/70">Mato Grosso</div>
          </div>
        </div>
      </div>

      <nav className="p-4 text-sm flex-1">
        <div className="text-xs text-white/60 uppercase tracking-wide mb-2">Menu Principal</div>

        <NavLink
          to="/pets"
          className={({ isActive }) =>
            [
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
              isActive ? "bg-teal-800/60" : "hover:bg-teal-800/40",
            ].join(" ")
          }
        >
          <PawPrint className="w-4 h-4" />
          Pets Lista
        </NavLink>

        <NavLink
          to="/tutores"
          className={({ isActive }) =>
            [
              "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
              isActive ? "bg-teal-800/60" : "hover:bg-teal-800/40",
            ].join(" ")
          }
        >
          <PawPrint className="w-4 h-4" />
          Tutores Lista
        </NavLink>

        <div className="text-xs text-white/60 uppercase tracking-wide mt-6 mb-2">Ações Rápidas</div>

        <Link 
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-teal-800/40 transition-colors" 
          to="/pets/novo"
        >
          <Plus className="w-4 h-4" />
          Novo Pet
        </Link>

        <Link 
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-teal-800/40 transition-colors" 
          to="/tutores/novo"
        >
          <Plus className="w-4 h-4" />
          Novo Tutor
        </Link>
      </nav>

      <div className="p-4 border-t border-white/10 text-sm">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-teal-800/40 transition-colors">
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
