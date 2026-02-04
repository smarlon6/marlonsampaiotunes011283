import { useEffect } from "react";
import { Link } from "react-router-dom";
import { petsStore } from "../state/pets.store";
import { useObservableState } from "../../../lib/useObservableState";
import { PetCard } from "../components/PetCard";
import { SearchInput } from "../components/SearchInput";
import { Pagination } from "../components/Pagination";
import { Plus } from "lucide-react";

export function PetsPage() {
  const s = useObservableState(petsStore.state$, petsStore.snapshot);

  useEffect(() => {
    petsStore.fetch();
  }, [s.page, s.nome]);

  return (
    <div className="p-8">
      <div className="flex flex-col gap-6">
        {/* Actions Bar */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex gap-3">
            <Link 
              to="/pets/novo" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Novo Pet
            </Link>

            <Link 
              to="/tutores/novo" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Novo Tutor
            </Link>
          </div>

          <SearchInput value={s.nome} onChange={(v) => petsStore.setNome(v)} />
        </div>

        {/* Erros */}
        {s.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-4 text-sm">
            {s.error}
          </div>
        )}

        {s.deleteError && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-4 text-sm">
            {s.deleteError}
          </div>
        )}

        {/* Loading */}
        {s.loading && (
          <div className="text-sm text-gray-500 animate-pulse">Carregando...</div>
        )}

        {/* Pet Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {s.data?.content?.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onDelete={(id) => petsStore.deletePet(id)}
              isDeleting={s.deletingId === pet.id}
            />
          ))}
        </div>

        {/* Empty State */}
        {!s.loading && s.data?.content?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum pet encontrado.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-gray-500">
            Mostrando {s.data?.content?.length ?? 0} de {s.data?.total ?? 0}
          </p>

          <Pagination 
            page={s.page} 
            pageCount={s.data?.pageCount ?? 1} 
            onPage={(p) => petsStore.setPage(p)} 
          />
        </div>
      </div>
    </div>
  );
}
