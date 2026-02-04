import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

type Foto = {
  id: number;
  nome: string;
  contentType: string;
  url: string;
};

type Pet = {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: Foto | null;
};

type Props = {
  pet: Pet;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
};

export function PetCard({ pet, onDelete, isDeleting }: Props) {
  return (
    <div className="rounded-xl border bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/pets/${pet.id}`} className="block">
        <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
          {pet.foto?.url ? (
            <img
              src={pet.foto.url}
              alt={pet.nome}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
              Sem foto
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="font-semibold text-slate-800 truncate">{pet.nome}</div>
          <div className="text-sm text-slate-500 truncate">{pet.raca || "—"}</div>

          <div className="mt-3 flex items-center justify-between">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200">
              Pet
            </span>
            <span className="text-sm text-slate-500">
              {pet.idade} ano{pet.idade !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </Link>

      {onDelete && (
        <div className="px-4 pb-4">
          <button
            type="button"
            disabled={!!isDeleting}
            onClick={() => {
              const ok = window.confirm(`Excluir o pet "${pet.nome}" (ID #${pet.id})?`);
              if (ok) onDelete(pet.id);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-amber-300 bg-amber-50/50 text-red-500 font-medium hover:bg-amber-100 hover:border-amber-400 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      )}
    </div>
  );
}
