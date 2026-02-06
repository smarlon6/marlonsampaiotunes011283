import { useEffect } from "react";
import { Link } from "react-router-dom";
import { petsStore } from "../state/pets.store";
import { useObservableState } from "../../../lib/useObservableState";
import { PetCard } from "../components/PetCard";
import { SearchInput } from "../components/SearchInput";
import { Pagination } from "../components/Pagination";
import { Plus, UserPlus, PawPrint } from "lucide-react";

export function PetsPage() {
  const s = useObservableState(petsStore.state$, petsStore.snapshot);

  useEffect(() => {
    petsStore.fetch();
  }, [s.page, s.nome]);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <PawPrint className="h-8 w-8 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Registro Público de Pets
          </h1>
        </div>
        <p className="text-gray-500">
          Encontre e cadastre pets e seus tutores
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <Link
            to="/tutores"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Tutores
          </Link>
          <Link
            to="/pets/novo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Cadastrar Pet
          </Link>
        </div>
      </header>

      {/* Search */}
      <div className="mx-auto mb-8 max-w-md">
        <SearchInput value={s.nome} onChange={(v) => petsStore.setNome(v)} />
      </div>

      {/* Erros */}
      {s.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-4 text-sm mb-4">
          {s.error}
        </div>
      )}
      {s.deleteError && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-4 text-sm mb-4">
          {s.deleteError}
        </div>
      )}

      {/* Loading */}
      {s.loading && (
        <div className="text-sm text-gray-500 animate-pulse mb-4">Carregando...</div>
      )}

      {/* Results count */}
      <p className="mb-4 text-sm text-gray-500">
        {s.data?.total ?? 0} pet{(s.data?.total ?? 0) !== 1 ? "s" : ""} encontrado{(s.data?.total ?? 0) !== 1 ? "s" : ""}
      </p>

      {/* Pet Grid */}
      {(s.data?.content?.length ?? 0) > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {s.data?.content?.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onDelete={(id) => petsStore.deletePet(id)}
              isDeleting={s.deletingId === pet.id}
            />
          ))}
        </div>
      ) : (
        !s.loading && (
          <div className="py-12 text-center">
            <PawPrint className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">Nenhum pet encontrado.</p>
          </div>
        )
      )}

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
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
  );
}
