import {useConstants} from "/src/composables/constants"

const constants = useConstants()

export function useUtils() {
    const clamp = (value: number, min: number, max: number): number => {
        if(isNaN(Number(value)) || value === null || value === undefined)
            return min

        return Math.min(Math.max(value, min), max)
    }

    const isAndroid = (): boolean => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /android/.test(userAgent);
    }

    const isIOS = (): boolean => {
        const userAgent = window.navigator.userAgent.toLowerCase()
        return /iphone|ipad|ipod/.test(userAgent)
            || /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    }

    const isChromeOS = (): boolean => {
        const userAgent = window.navigator.userAgent.toLowerCase()
        return /cros/.test(userAgent);
    }

    const isStringAnImageUrl = (string: string): boolean => {
        return /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(string)
    }

    const isTouchDevice = (): boolean => {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0))
    }

    const isValidEmail = (string: string): boolean => {
        return Boolean(String(string)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            ))
    }

    const isElementOutsideBounds = (element: HTMLElement): boolean => {
        const rect = element.getBoundingClientRect()

        return (
            rect.bottom < 0 ||
            rect.right < 0 ||
            rect.left > window.innerWidth ||
            rect.top > window.innerHeight
        )
    }

    const hasDuplications = (array: Record<string, unknown>[], key: string): boolean => {
        const seen = new Set()
        for (const item of array) {
            if (seen.has(item[key])) return true
            seen.add(item[key])
        }
        return false
    }

    const getRootSCSSVariable = (colorName: string): string => {
        const root = document.documentElement
        return getComputedStyle(root).getPropertyValue('--' + colorName).trim()
    }

    const getYearsPassedSince = (date: Date): number => {
        const currentDate = new Date()
        const differenceInMilliseconds = currentDate.getTime() - date.getTime()
        const millisecondsPerYear = 365.25 * 24 * 60 * 60 * 1000
        return differenceInMilliseconds / millisecondsPerYear
    }

    const generateUniqueRandomString = (prefix?: string): string => {
        prefix = prefix || 'key'
        window.randStrGenCount = window.randStrGenCount || 0
        window.randStrGenCount++
        return prefix + "-rand-" + window.randStrGenCount
    }

    const resolvePath = (path: string): string => {
        const baseUrl = constants.BASE_URL || ''
        return baseUrl + path
    }

    const getAbsoluteLocation = (): string => {
        const { protocol, host, pathname, search, hash } = window.location
        return `${protocol}//${host}${pathname}${search}${hash}`
    }

    const getRootLocation = (): string => {
        const { protocol, host } = window.location
        const basePath = import.meta.env.BASE_URL
        const path = `${protocol}//${host}${basePath}`
        return path.endsWith('/') ? path : `${path}/`
    }

    return {
        clamp,
        isAndroid,
        isIOS,
        isChromeOS,
        isStringAnImageUrl,
        isTouchDevice,
        isValidEmail,
        isElementOutsideBounds,
        hasDuplications,
        getRootSCSSVariable,
        getYearsPassedSince,
        generateUniqueRandomString,
        resolvePath,
        getAbsoluteLocation,
        getRootLocation
    }
}
