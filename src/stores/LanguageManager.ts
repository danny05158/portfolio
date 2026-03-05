import { useDataManagerStore } from "./DataManager"
import {computed} from "vue"
import { defineStore } from "pinia"

interface HasTranslation {
    getTranslation: (key: string, language?: { id: string }, fallbackLanguage?: { id: string }) => string
}

export const useLanguageManagerStore = defineStore("languageManager", () => {
  const dataManagerStore = useDataManagerStore()

  const supportedLanguages = dataManagerStore.settings!.supportedLanguages

  const defaultLanguage = computed(() => {
    return supportedLanguages.find((language) => language.isDefault);
  });

  const selectedLanguage = computed(() => {
    if (!supportedLanguages.length) {
      throw new Error(
        "You must add at least one language to the supported languages setting."
      );
    }

    const savedId = dataManagerStore.languageId;

    return (
      supportedLanguages.find((language) => language.id === savedId) ||
      supportedLanguages.find((language) =>
        navigator.language.includes(language.id)
      ) ||
      defaultLanguage.value ||
      supportedLanguages[0]
    )
  })

  function localizeDate(dateOrString: Date | string | null): string {
    if (!dateOrString) return "date.null";

    if (typeof dateOrString === "string")
      return `<strong>${localizeFromStrings(dateOrString)}</strong>`;

    const languageId =
      selectedLanguage.value?.id || defaultLanguage.value?.id || "en";
    const localeString = dateOrString.toLocaleString(String(languageId), {
      year: "numeric",
      month: "short",
    });

    const formattedString =
      localeString.charAt(0).toUpperCase() +
      localeString.slice(1).replaceAll(".", "");
    return formattedString.replace(
      /\d{4}/,
      (year) => `<strong>${year}</strong>`
    );
  }

  function localize(locales: HasTranslation | null, key: string, returnNullIfNotFound?: boolean): string | null {
    if (!locales) return "";

    const translation = locales.getTranslation(
      key,
      selectedLanguage.value,
      defaultLanguage.value
    );
    if (typeof translation !== "string" || !translation.includes("locales."))
      return translation;

    return returnNullIfNotFound ? null : translation;
  }

  function localizeFromStrings(key: string): string | null {
    const { strings } = useDataManagerStore();
    return localize(strings, key);
  }

  return {
    //state
    selectedLanguage,

    localizeDate,
    localize,
    localizeFromStrings,
  };
});
