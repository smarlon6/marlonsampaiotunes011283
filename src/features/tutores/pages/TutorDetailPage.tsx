import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useObservableState } from "../../../lib/useObservableState";
import { tutorDetailStore } from "../state/tutorDetail.store";
import { petsFacade } from "../../pets/api/pets.facade";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  PawPrint,
  Search,
  LinkIcon,
  X,
  ChevronLeft,
  ChevronRight,
  UserCircle,
} from "lucide-react";

type PetListItem = {
  id: number;
  nome: string;
  raca?: string;
  idade?: number;
  foto?: { url?: string } | null;
};

type PageResp<T> = {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: T[];
};

export function TutorDetailPage() {
  const { id } = useParams();
  const tutorId = useMemo(() => Number(id), [id]);

  const s = useObservableState(tutorDetailStore.state$, tutorDetailStore.snapshot);
  const tutor = s.tutor;

  const [petQuery, setPetQuery] = useState("");
  const [petPage, setPetPage] = useState(0);
  const [petList, setPetList] = useState<PageResp<PetListItem> | null>(null);
  const [petListLoading, setPetListLoading] = useState(false);
  const [petListError, setPetListError] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  const linkedPetIds = useMemo(() => new Set((tutor?.pets ?? []).map((p) => p.id)), [tutor]);

  useEffect(() => {
    tutorDetailStore.clear();
    if (Number.isFinite(tutorId) && tutorId > 0) {
      tutorDetailStore.fetch(tutorId);
    }
  }, [tutorId]);

  useEffect(() => {
    let alive = true;
    const t = setTimeout(async () => {
      try {
        setPetListLoading(true);
        setPetListError(null);
        const data = await petsFacade.list({
          page: petPage,
          size: 10,
          nome: petQuery.trim() || undefined,
        });
        if (!alive) return;
        const filtered = {
          ...data,
          content: (data.content ?? []).filter((p: PetListItem) => !linkedPetIds.has(p.id)),
        };
        setPetList(filtered);
      } catch (e: any) {
        if (!alive) return;
        setPetListError(e?.message ?? "Erro ao carregar lista de pets");
      } finally {
        if (alive) setPetListLoading(false);
      }
    }, 350);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [petQuery, petPage, linkedPetIds]);

  function pickPet(p: PetListItem) {
    setSelectedPetId(p.id);
  }

  async function vincularSelecionado() {
    if (!tutor || !selectedPetId) return;
    await tutorDetailStore.vincularPet(tutor.id, selectedPetId);
    setSelectedPetId(null);
  }

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <p className="text-sm text-teal-600 font-medium mb-1">Detalhamento do Tutor</p>
          <h1 className="text-3xl font-bold text-gray-900">{tutor?.nome ?? "—"}</h1>

          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
              <span>{tutor?.email || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-gray-400 shrink-0" />
              <span>{tutor?.telefone || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="truncate">{tutor?.endereco || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CreditCard className="h-4 w-4 text-gray-400 shrink-0" />
              <span>CPF: {tutor?.cpf ? String(tutor.cpf) : "—"}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to="/tutores"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          {tutor && (
            <Link
              to={`/tutores/${tutor.id}/editar`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Editar
            </Link>
          )}
        </div>
      </div>

      {/* Erros globais */}
      {s.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-6">
          {s.error}
        </div>
      )}

      {s.loading && (
        <div className="text-sm text-gray-500 animate-pulse mb-6">Carregando...</div>
      )}

      {tutor && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pets vinculados */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <PawPrint className="h-5 w-5 text-teal-600" />
                <h2 className="text-lg font-bold text-gray-800">Pets vinculados</h2>
                <span className="ml-auto text-sm text-gray-400">
                  {(tutor.pets ?? []).length} pet{(tutor.pets ?? []).length !== 1 ? "s" : ""}
                </span>
              </div>

              {(tutor.pets ?? []).length === 0 ? (
                <div className="py-8 text-center">
                  <PawPrint className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                  <p className="text-sm text-gray-500">Nenhum pet vinculado.</p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {(tutor.pets ?? []).map((p) => (
                    <div
                      key={p.id}
                      className="rounded-lg border bg-gray-50 p-4 flex items-start justify-between gap-3 hover:bg-gray-100 transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-800 truncate">{p.nome}</div>
                        <div className="text-sm text-gray-600 truncate">{p.raca}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {p.idade} ano(s) • ID #{p.id}
                        </div>
                      </div>
                      <button
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-white text-red-500 text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                        disabled={s.vinculoLoading}
                        onClick={() => tutorDetailStore.removerVinculo(tutor.id, p.id)}
                        title="Remover vínculo"
                      >
                        <X className="h-3.5 w-3.5" />
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vincular novo Pet */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <LinkIcon className="h-5 w-5 text-teal-600" />
                <h2 className="text-lg font-bold text-gray-800">Vincular novo Pet</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Busque um pet e selecione na lista para vincular ao tutor.
              </p>

              {s.vinculoError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4">
                  {s.vinculoError}
                </div>
              )}

              {petListError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 mb-4">
                  {petListError}
                </div>
              )}

              {/* Busca + botão */}
              <div className="flex gap-3 flex-wrap items-center mb-4">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={petQuery}
                    onChange={(e) => {
                      setPetQuery(e.target.value);
                      setPetPage(0);
                    }}
                    className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-400 transition-colors"
                    placeholder="Buscar pet por nome..."
                  />
                </div>

                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={s.vinculoLoading || !selectedPetId}
                  onClick={vincularSelecionado}
                >
                  <LinkIcon className="h-4 w-4" />
                  {s.vinculoLoading
                    ? "Processando..."
                    : selectedPetId
                    ? `Vincular #${selectedPetId}`
                    : "Selecione um pet"}
                </button>

                {selectedPetId && (
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => setSelectedPetId(null)}
                  >
                    <X className="h-3.5 w-3.5" />
                    Limpar
                  </button>
                )}
              </div>

              {/* Lista de pets */}
              {petListLoading ? (
                <div className="text-sm text-gray-500 animate-pulse py-4">Carregando pets...</div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {(petList?.content ?? []).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => pickPet(p)}
                      className={`text-left rounded-lg border p-4 transition-all ${
                        selectedPetId === p.id
                          ? "ring-2 ring-teal-500 border-teal-400 bg-teal-50"
                          : "bg-white hover:border-gray-400 hover:shadow-sm"
                      }`}
                    >
                      <div className="font-semibold text-gray-800 truncate">{p.nome}</div>
                      <div className="text-sm text-gray-600 truncate">{p.raca ?? "—"}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {p.idade ?? "—"} ano(s) • ID #{p.id}
                      </div>
                      <div
                        className={`mt-3 text-xs inline-flex px-2.5 py-1 rounded-full font-medium ${
                          selectedPetId === p.id
                            ? "bg-teal-100 text-teal-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {selectedPetId === p.id ? "✓ Selecionado" : "Selecionar"}
                      </div>
                    </button>
                  ))}

                  {(petList?.content ?? []).length === 0 && (
                    <div className="col-span-2 py-8 text-center">
                      <PawPrint className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                      <p className="text-sm text-gray-500">Nenhum pet disponível para vincular.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Paginação */}
              {petList && petList.pageCount > 1 && (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    disabled={petPage <= 0}
                    onClick={() => setPetPage((p) => Math.max(0, p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </button>
                  <span className="text-sm text-gray-500">
                    Página <b>{petPage + 1}</b> de <b>{petList.pageCount}</b>
                  </span>
                  <button
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    disabled={petPage >= petList.pageCount - 1}
                    onClick={() => setPetPage((p) => p + 1)}
                  >
                    Próxima
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Coluna lateral — Foto */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border bg-white p-6 shadow-sm sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <UserCircle className="h-5 w-5 text-teal-600" />
                <h2 className="text-lg font-bold text-gray-800">Foto do Tutor</h2>
              </div>

              <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                {tutor.foto?.url ? (
                  <img
                    src={tutor.foto.url}
                    alt={tutor.nome}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-center">
                    <UserCircle className="mx-auto h-16 w-16 text-gray-300" />
                    <p className="text-sm text-gray-400 mt-2">Sem foto</p>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 mt-3 text-center">
                Upload disponível na tela de edição
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
