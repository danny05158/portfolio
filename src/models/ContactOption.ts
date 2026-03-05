import Locales from "/src/models/Locales"

export default class ContactOption {
    private _id: string
    private _value: string
    private _valueShort: string
    private _faIcon: string
    private _href: string | null
    private _locales: Locales

    constructor(jsonData: Record<string, unknown>) {
        this._id = jsonData["id"] as string
        this._value = jsonData["value"] as string
        this._valueShort = jsonData["valueShort"] as string
        this._faIcon = jsonData["faIcon"] as string
        this._href = (jsonData["href"] as string) || null
        this._locales = new Locales((jsonData["locales"] as Record<string, unknown>) || {})
    }

    get id(): string {
        return this._id
    }

    getValue(localizationClosure: (locales: Locales, key: string, flag: boolean) => string | null, shorten: boolean): string {
        const key = shorten ? "valueShort" : "value"
        const localizedKey = localizationClosure(this._locales, key, true)

        if(localizedKey) return localizedKey
        return this.getStaticValue(shorten)
    }

    getStaticValue(shorten: boolean): string {
        return shorten ? this._valueShort : this._value
    }

    get faIcon(): string {
        return this._faIcon
    }

    get href(): string | null {
        return this._href
    }
}
