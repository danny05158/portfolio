import Locales from "/src/models/Locales"
import type Section from "/src/models/Section"

export default class Category {
    private _id: string
    private _faIcon: string
    private _locales: Locales
    private _sections: Section[]
    private _lastVisitedSection: Section | undefined

    constructor(id: string, faIcon: string, locales: Record<string, unknown>) {
        this._id = id
        this._faIcon = faIcon
        this._locales = new Locales(locales)
        this._sections = []
    }

    get id(): string {
        return this._id
    }

    get faIcon(): string {
        return this._faIcon
    }

    get sections(): Section[] {
        return this._sections
    }

    get locales(): Locales {
        return this._locales
    }

    get lastVisitedSection(): Section | undefined {
        return this._lastVisitedSection
    }

    set lastVisitedSection(section: Section) {
        this._lastVisitedSection = section
    }

    addSection(section: Section): void {
        if(this._sections.indexOf(section) === -1) {
            this._sections.push(section)
        }
    }

    removeSection(section: Section): void {
        const index = this._sections.indexOf(section)
        if(index !== -1) {
            this._sections.splice(index, 1)
        }
    }
}
