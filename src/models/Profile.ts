import Locales from "/src/models/Locales"
import ContactOption from "/src/models/ContactOption"

export default class Profile {
    private _name: string
    private _profilePictureUrl: string
    private _locales: Locales
    private _contactOptions: ContactOption[]

    constructor(jsonData: Record<string, unknown>) {
        this._name = jsonData["name"] as string
        this._profilePictureUrl = jsonData["profilePictureUrl"] as string
        this._locales = new Locales(jsonData["locales"] as Record<string, unknown>)
        this._contactOptions = (jsonData["contactOptions"] as Record<string, unknown>[]).map(contactOptionData => {
            return new ContactOption(contactOptionData)
        })
    }

    get name(): string {
        return this._name
    }

    get profilePictureUrl(): string {
        return this._profilePictureUrl
    }

    get contactOptions(): ContactOption[] {
        return this._contactOptions
    }

    getContactOptionWithId(id: string): ContactOption | undefined {
        return this.contactOptions.find(contactOption => contactOption.id === id)
    }

    get locales(): Locales {
        return this._locales
    }
}
