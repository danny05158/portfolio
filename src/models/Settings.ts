import Language from "/src/models/Language"

export default class Settings {
    private _preloaderEnabled: boolean
    private _navToggleEnabled: boolean
    private _supportedLanguages: Language[]

    constructor(jsonData: Record<string, unknown>) {
        this._preloaderEnabled = jsonData['preloaderEnabled'] as boolean
        this._navToggleEnabled = jsonData['navToggleEnabled'] as boolean
        this._supportedLanguages = (jsonData['supportedLanguages'] as Array<{ id: string; name: string; default: boolean; flagUrl: string }>).map(
            ({ id, name, default: isDefault, flagUrl }) => new Language(id, name, isDefault, flagUrl)
        )
    }

    get preloaderEnabled(): boolean {
        return this._preloaderEnabled
    }

    get supportedLanguages(): Language[] {
        return this._supportedLanguages
    }

    get navToggleEnabled(): boolean {
        return this._navToggleEnabled
    }
}
