import { ref } from "vue";
import { defineStore } from "pinia";
import { useUtils } from "/src/composables/utils";
import Category from "/src/models/Category";
import Locales from "/src/models/Locales";
import Profile from "/src/models/Profile";
import Section from "/src/models/Section";
import Settings from "/src/models/Settings";

export const useDataManagerStore = defineStore("dataManager", () => {
  const categories = ref<Category[] | null>(null);
  const profile = ref<Profile | null>(null);
  const sections = ref<Section[] | null>(null);
  const settings = ref<Settings | null>(null);
  const strings = ref<Locales | null>(null);
  const didLoadAllJsonFiles = ref(false);
  const languageId = ref<string | null>(null);

  const loadData = async (): Promise<void> => {
    const jSettings = await loadJson("/settings.json");
    settings.value = new Settings(jSettings);

    const jStrings = await loadJson("/strings.json");
    strings.value = new Locales(jStrings);

    const jProfile = await loadJson("/profile.json");
    profile.value = new Profile(jProfile);

    const jSections = await loadJson("/sections.json");
    const jCategories = await loadJson("/categories.json");

    parseSectionsAndCategories(
      jSections["sections"] as Record<string, unknown>[],
      jCategories["categories"] as Record<string, unknown>[]
    );
    validateSectionsAndCategories();
    await loadSectionJsonFiles();
    didLoadAllJsonFiles.value = true;
  };

  const parseSectionsAndCategories = (sectionsList: Record<string, unknown>[], categoriesList: Record<string, unknown>[]): void => {
    const parsedSections: Section[] = [];
    const parsedCategories: Category[] = [];

    for (const categoryListItem of categoriesList) {
      const category = new Category(
        categoryListItem["id"] as string,
        categoryListItem["faIcon"] as string,
        categoryListItem["locales"] as Record<string, unknown>
      );
      parsedCategories.push(category);
    }

    for (const sectionsListItem of sectionsList) {
      const section = new Section(
        sectionsListItem["id"] as string,
        parsedSections.length === 0,
        sectionsListItem["faIcon"] as string,
        sectionsListItem["jsonPath"] as string,
        sectionsListItem["type"] as string,
        sectionsListItem["locales"] as Record<string, unknown>
      );

      const sectionCategory = parsedCategories.find(
        (category) => category.id === sectionsListItem["categoryId"]
      );
      if (!sectionCategory) {
        throw new Error(
          `The section with id "${section.id}" has an invalid category id. Make sure the category with id "${sectionsListItem["categoryId"]}" exists.`
        );
      }

      parsedSections.push(section);
      section.category = sectionCategory;
      sectionCategory.addSection(section);
    }

    sections.value = parsedSections;
    categories.value = parsedCategories.filter(
      (category) => category.sections.length
    );
  };

  const validateSectionsAndCategories = (): void => {
    const utils = useUtils();

    if (utils.hasDuplications(sections.value as Record<string, unknown>[], "id")) {
      throw new Error("Each section must have an unique id!");
    }

    if (utils.hasDuplications(categories.value as Record<string, unknown>[], "id")) {
      throw new Error("Each category must have an unique id!");
    }
  };

  const loadSectionJsonFiles = async (): Promise<void> => {
    for (const section of sections.value!) {
      const path = section.jsonPath;
      if (!path) continue;

      const json = await loadJson(path);
      const articles = json["articles"] as Record<string, unknown>[];
      if (!articles) {
        throw new Error(`${path} doesn't have an articles array.`);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (section as any).articles = articles;
    }
  };

  const loadJson = async (path: string): Promise<Record<string, unknown>> => {
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

    try {
      const response = await fetch(basePath + "/data/" + path);
      return await response.json();
    } catch (_e) {
      throw new Error(
        `Couldn't load ${path}. Make sure the file exists and is a valid JSON object.`
      );
    }
  };

  return {
    // state
    categories,
    profile,
    sections,
    settings,
    strings,
    didLoadAllJsonFiles,
    languageId,

    loadData,
    parseSectionsAndCategories,
    validateSectionsAndCategories,
    loadSectionJsonFiles,
  };
});
