import { create } from "zustand";

type LocaleStoreType = {
  locale: string;
  setLocale: (newLocale: string) => void;
};

const useLocale = create<LocaleStoreType>((set) => {
  return {
    locale: "en",
    setLocale: (newLocale: string) => {
      set({ locale: newLocale });
    },
  };
});

export default useLocale;
