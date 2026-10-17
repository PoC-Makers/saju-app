import type { CalendarDate } from "../types/saju.types";

export function isValidCalendarDate({ year, month, day }: CalendarDate): boolean {
    if (![year, month, day].every(Number.isInteger)) return false;

    const normalized = new Date(Date.UTC(year, month - 1, day));
    return (
        normalized.getUTCFullYear() === year &&
        normalized.getUTCMonth() === month - 1 &&
        normalized.getUTCDate() === day
    );
}

export function nextDay({ year, month, day }: CalendarDate): CalendarDate {
    const next = new Date(Date.UTC(year, month - 1, day + 1));
    return { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1, day: next.getUTCDate() };
}
