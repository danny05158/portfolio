import { ref } from "vue";
import { defineStore } from "pinia";
import {useUtils} from "../composables/utils"
import Category from "../models/Category"
import Locales from "../models/Locales.js"
import Profile from "../models/Profile.js"
import Section from "../models/Section.js"
import Settings from "../models/Settings.js"

export const useDataManagerStore = defineStore("dataManager", () => {
  const categories = ref(null);
  const profile = ref(null);
  const sections = ref(null);
  const settings = ref(null);
  const strings = ref(null);
  const didLoadAllJsonFiles = ref(false);

  const loadData = async () => {
    const jSettings = await loadJson("/settings.json");
    settings.value = new Settings(jSettings);

    const jStrings = await loadJson("/strings.json");
    strings.value = new Locales(jStrings);

    const jProfile = await loadJson("/profile.json");
    profile.value = new Profile(jProfile);

    const jSections = await loadJson("/sections.json");
    const jCategories = await loadJson("/categories.json");

    parseSectionsAndCategories(
      jSections["sections"],
      jCategories["categories"]
    );
    validateSectionsAndCategories();
    await loadSectionJsonFiles();
    didLoadAllJsonFiles.value = true
  };

  const parseSectionsAndCategories = (sectionsList, categoriesList) => {
    const parsedSections = [];
    const parsedCategories = [];

    for (const categoryListItem of categoriesList) {
      const category = new Category(
        categoryListItem["id"],
        categoryListItem["faIcon"],
        categoryListItem["locales"]
      );
      parsedCategories.push(category);
    }

    for (const sectionsListItem of sectionsList) {
      const section = new Section(
        sectionsListItem["id"],
        parsedSections.length === 0,
        sectionsListItem["faIcon"],
        sectionsListItem["jsonPath"],
        sectionsListItem["type"],
        sectionsListItem["locales"]
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

  const validateSectionsAndCategories = () => {
    const utils = useUtils()

    if (utils.hasDuplications(sections.value, "id")) {
      throw new Error("Each section must have an unique id!");
    }

    if (utils.hasDuplications(categories.value, "id")) {
      throw new Error("Each category must have an unique id!");
    }
  };

  const loadSectionJsonFiles = async () => {
    for (const section of sections.value) {
      const path = section.jsonPath;
      if (!path) continue;

      const json = await loadJson(path);
      const articles = json["articles"];
      if (!articles) {
        throw new Error(`${path} doesn't have an articles array.`);
      }

      section.articles = articles;
    }
  };

  const loadJson = async (path) => {
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')

    try {
      const response = await fetch(basePath + "/data/" + path);
      return await response.json();
    } catch (e) {
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

    loadData,
    parseSectionsAndCategories,
    validateSectionsAndCategories,
    loadSectionJsonFiles
  }
})
