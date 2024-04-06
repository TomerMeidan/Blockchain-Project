import { create } from "zustand";

export const useStore = create((set) => ({
  form: {
    network: "",
    seed: "",
    seed_type: "",
    from_address: "",
    to_address: "",
    amount: "",
    number_of_addresses: "",
  },
  setForm: (form) => set({ form }),
  accounts: [],
  setAccounts: (accounts) => set({ accounts }),
  step: 0,
  setStep: (step) => set({ step }),
  isTransactionPossible: false,
  setIsTransactionPossible: (isTransactionPossible) => set({ isTransactionPossible }),
  isTransactionVisible: false,
  setIsTransactionVisible: (isTransactionVisible) => set({ isTransactionVisible }),
}));
