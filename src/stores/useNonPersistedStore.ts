import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface NonPersistedStore {
  hasFetchedUser: boolean;
}

const useNonPersistedStore = create<NonPersistedStore>()(
  immer((set, get) => ({
    hasFetchedUser: false,
  }))
);

export default useNonPersistedStore;
