interface ScheduledItem {
    id: ReturnType<typeof setTimeout> | ReturnType<typeof setInterval>
    tag: string
}

const timeouts: ScheduledItem[] = []
const intervals: ScheduledItem[] = []

export const useScheduler = () => {
    const schedule = (callback: () => void, timeInMilliseconds: number, tag: string): void => {
        const timeoutId = setTimeout(callback, timeInMilliseconds)
        timeouts.push({id: timeoutId, tag: tag})
    }

    const interval = (callback: () => void, timeInMilliseconds: number, tag: string): void => {
        const intervalId = setInterval(callback, timeInMilliseconds)
        intervals.push({id: intervalId, tag: tag})
    }

    const clearAllWithTag = (tag: string): void => {
        for (let i = timeouts.length - 1; i >= 0; i--) {
            if (timeouts[i].tag === tag) {
                clearTimeout(timeouts[i].id as ReturnType<typeof setTimeout>)
                timeouts.splice(i, 1)
            }
        }

        for (let i = intervals.length - 1; i >= 0; i--) {
            if (intervals[i].tag === tag) {
                clearInterval(intervals[i].id as ReturnType<typeof setInterval>)
                intervals.splice(i, 1)
            }
        }
    }

    const clearAll = (): void => {
        timeouts.forEach(timeout => {
            clearTimeout(timeout.id as ReturnType<typeof setTimeout>)
        })

        intervals.forEach(interval => {
            clearInterval(interval.id as ReturnType<typeof setInterval>)
        })

        timeouts.length = 0
        intervals.length = 0
    }

    return {
        schedule,
        interval,
        clearAllWithTag,
        clearAll
    }
}
