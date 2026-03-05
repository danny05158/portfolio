import Locales from "/src/models/Locales"
import Article from "/src/models/Article"
import type Category from "/src/models/Category"

export default class Section {
    private _id: string
    private _faIcon: string
    private _jsonPath: string
    private _category: Category | null
    private _type: string
    private _locales: Locales
    private _isCover: boolean
    private _articles: Article[]

    /** @enum */
    static readonly Types = {
        CENTERED: "centered",
        COLUMN: "column",
        ROW: "row"
    } as const

    constructor(id: string, isCover: boolean, faIcon: string, jsonPath: string, type: string, locales: Record<string, unknown>) {
        this._id = id
        this._faIcon = faIcon
        this._jsonPath = jsonPath
        this._category = null
        this._type = type
        this._locales = new Locales(locales)
        this._isCover = isCover
        this._articles = []

        if(!Object.values(Section.Types).find(existingType => existingType === type)) {
            throw new Error(`Section with ID "${id}" has an invalid type "${type}"`)
        }
    }

    get id(): string {
        return this._id
    }

    get faIcon(): string {
        return this._faIcon
    }

    get type(): string {
        return this._type
    }

    get isCentered(): boolean {
        return this._type === Section.Types.CENTERED
    }

    get isDefault(): boolean {
        return this._type === Section.Types.ROW || this._type === Section.Types.COLUMN
    }

    get jsonPath(): string {
        return this._jsonPath
    }

    get urlHashId(): string {
        return this.id
    }

    get htmlId(): string {
        return 'resume-section-' + this.id
    }

    get isCover(): boolean {
        return this._isCover
    }

    set category(category: Category) {
        this._category = category
    }

    get category(): Category | null {
        return this._category
    }

    set articles(rawArticles: unknown[]) {
        this._articles = (rawArticles as Record<string, unknown>[]).map(rawArticle => {
            return new Article(rawArticle, this)
        })
    }

    get articles(): Article[] {
        return this._articles
    }

    get locales(): Locales {
        return this._locales
    }
}
