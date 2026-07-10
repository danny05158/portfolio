import ArticleItem from "/src/models/ArticleItem"
import Locales from "/src/models/Locales"
import type Section from "/src/models/Section"

export default class Article {
    private _id: string
    private _component: string
    private _settings: Record<string, unknown>
    private _locales: Locales
    private _faIcon: string
    private _items: ArticleItem[]
    private _section: Section

    static readonly ItemSortingTypes = {
        ASCENDING: "asc",
        DESCENDING: "desc"
    } as const

    constructor(data: Record<string, unknown>, section: Section) {
        this._id = data.id as string
        this._component = data.component as string
        this._settings = (data.settings as Record<string, unknown>) || {}
        this._locales = new Locales((data.locales as Record<string, unknown>) || {})
        this._faIcon = data.faIcon as string

        this._items = (data.items as Record<string, unknown>[] | undefined)?.map(rawItem => new ArticleItem(rawItem)) || []
        this._section = section
    }

    get id(): string {
        return this._id
    }

    get faIcon(): string {
        return this._faIcon
    }

    get componentName(): string {
        return this._component
    }

    get items(): ArticleItem[] {
        const itemsCopy = [...this._items]
        const sortingKey = this.getSetting("order_items_by", "id") as keyof ArticleItem
        const sortingType = this.getSetting("order_items_sort", Article.ItemSortingTypes.ASCENDING)

        itemsCopy.sort((a, b) => (a[sortingKey] > b[sortingKey] ? 1 : -1))
        if (sortingType === Article.ItemSortingTypes.DESCENDING)
            itemsCopy.reverse()

        return itemsCopy
    }

    get section(): Section {
        return this._section
    }

    get locales(): Locales {
        return this._locales
    }

    getSetting(key: string, fallback?: unknown): unknown {
        return this._settings[key] || fallback
    }
}
