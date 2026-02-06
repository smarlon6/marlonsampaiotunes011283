import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useObservableState } from "../../../lib/useObservableState";
import { petFormStore } from "../state/petForm.store";
import { petsFacade } from "../api/pets.facade";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  PawPrint,
  Dog,
  Calendar,
  Tag,
  ImagePlus,
  X,
} from "lucide-react";

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export function PetFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const petId = useMemo(() => Number(id), [id]);
  const isEdit = Number.isFinite(petId) && petId > 0;

  const s = useObservableState(petFormStore.state$, petFormStore.snapshot);

  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit) petFormStore.loadForEdit(petId);
    else petFormStore.resetCreate();
  }, [isEdit, petId]);

  useEffect(() => {
    if (!fotoFile) {
      setFotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(fotoFile);
    setFotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [fotoFile]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const saved = await petFormStore.save();
    if (!saved) return;

    if (fotoFile) {
      try {
        await petsFacade.uploadFoto(saved.id, fotoFile);
      } catch (err) {
        console.error(err);
      }
    }

    navigate(`/pets/${saved.id}`);
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-teal-600/30 focus:border-teal-400 transition-colors";

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <p className="text-sm text-teal-600 font-medium mb-1">
            {isEdit ? "Edição de Pet" : "Novo Pet"}
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? `Editar: ${s.nome || "—"}` : "Cadastrar Pet"}
          </h1>
        </div>

        <Link
          to={isEdit ? `/pets/${petId}` : "/"}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>

      {/* Feedback */}
      {s.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-6">
          {s.error}
        </div>
      )}
      {s.success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 mb-6">
          {s.success}
        </div>
      )}

      {s.loading ? (
        <div className="text-sm text-gray-500 animate-pulse">Carregando...</div>
      ) : (
        <form onSubmit={onSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Formulário principal */}
            <div className="lg:col-span-2 rounded-xl border bg-white p-6 shadow-sm">
              <div className="space-y-5">
                {/* Nome */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <PawPrint className="h-4 w-4 text-gray-400" />
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={s.nome}
                    onChange={(e) => petFormStore.setField("nome", e.target.value)}
                    className={inputClass}
                    placeholder="Ex.: Rex"
                  />
                </div>

                {/* Espécie + Idade */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Dog className="h-4 w-4 text-gray-400" />
                      Espécie
                    </label>
                    <select
                      value={s.especie}
                      onChange={(e) => petFormStore.setField("especie", e.target.value)}
                      className={inputClass + " bg-white"}
                    >
                      <option value="">Selecione</option>
                      <option value="cachorro">Cachorro</option>
                      <option value="gato">Gato</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      Idade (anos) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={s.idade}
                      onChange={(e) => petFormStore.setField("idade", onlyDigits(e.target.value).slice(0, 2))}
                      className={inputClass}
                      placeholder="Ex.: 3"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                {/* Raça */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <Tag className="h-4 w-4 text-gray-400" />
                    Raça <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={s.raca}
                    onChange={(e) => petFormStore.setField("raca", e.target.value)}
                    className={inputClass}
                    placeholder="Ex.: Labrador Retriever"
                  />
                </div>
              </div>

              {/* Ações */}
              <div className="mt-8 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={s.saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  {s.saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar"}
                </button>

                {!isEdit && (
                  <button
                    type="button"
                    onClick={() => petFormStore.resetCreate()}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {/* Coluna lateral — Foto */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border bg-white p-6 shadow-sm sticky top-8">
                <div className="flex items-center gap-2 mb-4">
                  <ImagePlus className="h-5 w-5 text-teal-600" />
                  <h2 className="text-lg font-bold text-gray-800">Foto do Pet</h2>
                </div>

                {/* Preview */}
                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <PawPrint className="mx-auto h-16 w-16 text-gray-300" />
                      <p className="text-sm text-gray-400 mt-2">Sem foto</p>
                    </div>
                  )}
                </div>

                {/* Upload */}
                <label className="block cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-sm font-medium text-gray-600 hover:border-teal-400 hover:text-teal-600 transition-colors">
                    <ImagePlus className="h-4 w-4" />
                    Selecionar imagem
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFotoFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                {fotoFile && (
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-teal-50 border border-teal-200 px-3 py-2">
                    <span className="text-xs text-teal-700 truncate">{fotoFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setFotoFile(null)}
                      className="shrink-0 text-teal-500 hover:text-teal-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3 text-center">
                  A foto será enviada ao salvar o formulário.
                </p>

                {isEdit && (
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    * Em edição, o upload usa o ID do pet atual.
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
