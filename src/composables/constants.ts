export function useConstants() {
    const BASE_URL: string = import.meta.env.BASE_URL

    const BOOTSTRAP_BREAKPOINTS = {
        xs: 0,
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200,
        xxl: 1400,
    } as const

    const NAV_SECTION_PICKER_HEIGHT: number = 50

    const NAV_SECTION_PICKER_COMPRESSED_HEIGHT: number = 45

    const PresentationModes = {
        ONE_AT_ONCE: "mode_one_at_once",
        ALL_AT_ONCE: "mode_all_at_once",
        NONE: "mode_none"
    } as const

    return {
        // Global Constants...
        BASE_URL,
        BOOTSTRAP_BREAKPOINTS,
        NAV_SECTION_PICKER_HEIGHT,
        NAV_SECTION_PICKER_COMPRESSED_HEIGHT,

        // Enums...
        PresentationModes,
    }
}
