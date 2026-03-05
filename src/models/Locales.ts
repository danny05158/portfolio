export default class Locales {
    private _localesHash: Record<string, Record<string, string>>

    constructor(localesHash: Record<string, unknown>) {
        this._localesHash = (localesHash['locales'] || localesHash) as Record<string, Record<string, string>>
    }

    getTranslation(key: string, language?: { id: string }, fallbackLanguage?: { id: string }): string {
        const targetLanguageId = language?.id
        const defaultLanguageId = fallbackLanguage?.id

        const targetLanguageHash = targetLanguageId ? this._localesHash[targetLanguageId] : undefined
        const defaultLanguageHash = defaultLanguageId ? this._localesHash[defaultLanguageId] : undefined

        if(targetLanguageHash && targetLanguageHash[key])
            return this._parse(targetLanguageHash[key])
        if(defaultLanguageHash && defaultLanguageHash[key])
            return this._parse(defaultLanguageHash[key])
        return `locales.${key}`
    }

    private _parse(text: unknown): string {
        if(!text)
            return `locales.error`

        if(!(typeof text === 'string'))
            return String(text)

        return text.replace(/\*(.*?)\*/g, '<span class="text-primary">$1</span>')
    }
}
