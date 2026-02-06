import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useObservableState } from "../../../lib/useObservableState";
import { SearchInput } from "../../pets/components/SearchInput";
import { Pagination } from "../../pets/components/Pagination";
import { tutoresStore } from "../state/tutores.store";
import { Users, UserPlus, Phone, MapPin, UserCircle, PawPrint } from "lucide-react";


export function TutoresPage() {
  const s = useObservableState(tutoresStore.state$, tutoresStore.snapshot);

  useEffect(() => {
    tutoresStore.fetch();
  }, [s.page, s.nome]);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Users className="h-8 w-8 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Registro de Tutores
          </h1>
        </div>
        <p className="text-gray-500">
          Gerencie tutores e seus pets vinculados
        </p>
<div className="mt-4 flex items-center justify-center gap-3">
  <Link
    to="/pets"
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
  >
    <PawPrint className="h-4 w-4" />
    Ir para Pets
  </Link>
  <Link
    to="/tutores/novo"
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
  >
    <UserPlus className="h-4 w-4" />
    Cadastrar Tutor
  </Link>
</div>
      </header>

      {/* Search */}
      <div className="mx-auto mb-8 max-w-md">
        <SearchInput
          value={s.nome}
          onChange={(v) => tutoresStore.setNome(v)}
        />
      </div>

      {/* Erros */}
      {s.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 p-4 text-sm mb-4">
          {s.error}
        </div>
      )}

      {/* Loading */}
      {s.loading && (
        <div className="text-sm text-gray-500 animate-pulse mb-4">Carregando...</div>
      )}

      {/* Results count */}
      <p className="mb-4 text-sm text-gray-500">
        {s.data?.total ?? 0} tutor{(s.data?.total ?? 0) !== 1 ? "es" : ""} encontrado{(s.data?.total ?? 0) !== 1 ? "s" : ""}
      </p>

      {/* Tutor Grid */}
      {(s.data?.content?.length ?? 0) > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {s.data?.content?.map((t) => (
            <Link
              key={t.id}
              to={`/tutores/${t.id}`}
              className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start gap-4">
                {/* Foto do tutor */}
                <div className="h-14 w-14 shrink-0 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {t.foto?.url ? (
                    <img
                      src={t.foto.url}
                      alt={t.nome}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <UserCircle className="h-8 w-8 text-gray-300" />
                  )}
                </div>

                {/* Infos */}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-800 truncate group-hover:text-teal-600 transition-colors">
                    {t.nome}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-2 truncate">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {t.telefone}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1.5 truncate">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    {t.endereco || "Sem endereço"}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        !s.loading && (
          <div className="py-12 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <p className="text-gray-500">Nenhum tutor encontrado.</p>
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
          onPage={(p) => tutoresStore.setPage(p)}
        />
      </div>
    </div>
  );
}
