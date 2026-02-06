import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useObservableState } from "../../../lib/useObservableState";
import { petDetailStore } from "../state/petDetail.store";
import {
  ArrowLeft,
  Pencil,
  PawPrint,
  Tag,
  Calendar,
  Hash,
  Users,
  Mail,
  Phone,
  UserCircle,
} from "lucide-react";

export function PetDetailPage() {
  const { id } = useParams();
  const petId = Number(id);

  const s = useObservableState(petDetailStore.state$, petDetailStore.snapshot);

  useEffect(() => {
    petDetailStore.clear();
    if (Number.isFinite(petId) && petId > 0) {
      petDetailStore.fetch(petId);
    }
  }, [petId]);

  if (!Number.isFinite(petId) || petId <= 0) {
    return (
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
          ID inválido.
        </div>
        <Link
          className="inline-flex items-center gap-2 mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium"
          to="/"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <p className="text-sm text-teal-600 font-medium mb-1">Detalhamento do Pet</p>
          <h1 className="text-3xl font-bold text-gray-900">{s.pet?.nome ?? "—"}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              {s.pet?.raca ?? "—"}
            </span>
            <span className="text-gray-300">•</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {s.pet?.idade ?? "—"} ano(s)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <Link
            to={`/pets/${s.pet?.id}/editar`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Link>
        </div>
      </div>

      {/* Feedback */}
      {s.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-6">
          {s.error}
        </div>
      )}

      {s.loading && (
        <div className="text-sm text-gray-500 animate-pulse mb-6">Carregando...</div>
      )}

      {s.pet && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna lateral — Foto + Info rápida */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border bg-white overflow-hidden shadow-sm sticky top-8">
              <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                {s.pet.foto?.url ? (
                  <img
                    src={s.pet.foto.url}
                    alt={s.pet.nome}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-center">
                    <PawPrint className="mx-auto h-16 w-16 text-gray-300" />
                    <p className="text-sm text-gray-400 mt-2">Sem foto</p>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <span>
                    ID: <span className="font-semibold text-gray-800">#{s.pet.id}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Tag className="h-4 w-4 text-gray-400" />
                  <span>
                    Raça: <span className="font-semibold text-gray-800">{s.pet.raca}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    Idade: <span className="font-semibold text-gray-800">{s.pet.idade} ano(s)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna principal — Tutores */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Users className="h-5 w-5 text-teal-600" />
                <h2 className="text-lg font-bold text-gray-800">Tutores Vinculados</h2>
              </div>

              {s.tutoresDetalhados.length === 0 ? (
                <div className="py-8 text-center">
                  <Users className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p className="text-gray-500 text-sm">Nenhum tutor vinculado a este pet.</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {s.tutoresDetalhados.map((t) => (
                    <div
                      key={t.id}
                      className="rounded-lg border bg-gray-50 p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                          {(t as any).foto?.url ? (
                            <img
                              src={(t as any).foto.url}
                              alt={t.nome}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <UserCircle className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-800 truncate">{t.nome}</div>
                          {t.email && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1 truncate">
                              <Mail className="h-3.5 w-3.5 shrink-0" />
                              {t.email}
                            </div>
                          )}
                          {t.telefone && (
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5 truncate">
                              <Phone className="h-3.5 w-3.5 shrink-0" />
                              {t.telefone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
