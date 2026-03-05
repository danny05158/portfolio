import Locales from "/src/models/Locales"

interface DatePreset {
    year?: number
    month?: number
    day?: number
    string?: string
}

export default class ArticleItem {
    private _id: string
    private _img: string
    private _fallbackFaIcon: string
    private _fallbackFaIconColor: string
    private _dateStart: DatePreset | null
    private _dateEnd: DatePreset | null
    private _percentage: number | undefined
    private _locales: Locales
    private _links: unknown[]
    private _category: string

    constructor(data: Record<string, unknown>) {
        this._id = data.id as string
        this._img = data.img as string
        this._fallbackFaIcon = data['fallbackFaIcon'] as string
        this._fallbackFaIconColor = data['fallbackFaIconColor'] as string
        this._dateStart = (data['dateStart'] as DatePreset) || null
        this._dateEnd = (data['dateEnd'] as DatePreset) || null
        this._percentage = data['percentage'] as number | undefined
        this._locales = new Locales((data.locales as Record<string, unknown>) || {})
        this._links = (data.links as unknown[]) || []
        this._category = data['category'] as string
    }

    get id(): string {
        return this._id
    }

    get img(): string {
        return this._img
    }

    get fallbackFaIcon(): string {
        return this._fallbackFaIcon
    }

    get fallbackFaIconColor(): string {
        return this._fallbackFaIconColor
    }

    get dateStart(): Date | string | null {
        return this._parseDate(this._dateStart)
    }

    get dateEnd(): Date | string | null {
        return this._parseDate(this._dateEnd)
    }

    private _parseDate(datePreset: DatePreset | null): Date | string | null {
        if(!datePreset) return null
        if(datePreset.string) return datePreset.string

        return new Date(
            datePreset.year!,
            datePreset.month!,
            datePreset.day || 1
        )
    }

    get locales(): Locales {
        return this._locales
    }

    get percentage(): number | undefined {
        return this._percentage
    }

    get hasPercentage(): boolean {
        return this._percentage !== null && this._percentage !== undefined
    }

    get links(): unknown[] {
        return this._links
    }

    get categoryId(): string {
        return this._category
    }
}
