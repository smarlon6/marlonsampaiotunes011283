import { BehaviorSubject } from "rxjs";
import type { PetDetail, Tutor } from "../types/pet.types";
import { petsFacade } from "../api/pets.facade";
import { tutoresFacade } from "../../tutores/api/tutores.facade";

type PetDetailState = {
  loading: boolean;
  error: string | null;
  pet: PetDetail | null;
  tutoresDetalhados: Tutor[];
};

const initialState: PetDetailState = {
  loading: false,
  error: null,
  pet: null,
  tutoresDetalhados: [],
};

const subject = new BehaviorSubject<PetDetailState>(initialState);

export const petDetailStore = {
  state$: subject.asObservable(),
  get snapshot() {
    return subject.value;
  },

  clear() {
    subject.next(initialState);
  },

  async fetch(id: number) {
    subject.next({ ...subject.value, loading: true, error: null });

    try {
      const pet = await petsFacade.getById(id);

      // Se vier tutor dentro do pet, buscamos dados completos do tutor
      const tutorIds = (pet.tutores ?? []).map((t) => t.id).filter(Boolean);

      let tutoresDetalhados: Tutor[] = [];
      if (tutorIds.length > 0) {
        // busca em paralelo
        tutoresDetalhados = await Promise.all(tutorIds.map((tid) => tutoresFacade.getById(tid)));
      }

      subject.next({
        loading: false,
        error: null,
        pet,
        tutoresDetalhados,
      });
    } catch (e: any) {
      subject.next({
        ...subject.value,
        loading: false,
        error: e?.message ?? "Erro ao carregar detalhamento do pet",
      });
    }
  },
};
