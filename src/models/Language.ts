export default class Language {
    private _id: string
    private _name: string
    private _isDefault: boolean
    private _flagUrl: string

    constructor(id: string, name: string, isDefault: boolean, flagUrl: string) {
        this._id = id
        this._name = name
        this._isDefault = isDefault
        this._flagUrl = flagUrl
    }

    get id(): string {
        return this._id
    }

    get name(): string {
        return this._name
    }

    get flagUrl(): string {
        return this._flagUrl
    }

    get isDefault(): boolean {
        return Boolean(this._isDefault)
    }
}
