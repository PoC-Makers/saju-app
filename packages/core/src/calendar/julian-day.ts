import type { CalendarDate } from "../types/saju.types";

/**
 * 그레고리력 날짜 → 율리우스 적일(JDN). 정수 연산만 쓴다 (Fliegel–Van Flandern).
 * 1900년 이후 날짜에서는 모든 피연산자가 양수라 Math.floor가 곧 정수 나눗셈이다.
 */
export function toJulianDayNumber({ year, month, day }: CalendarDate): number {
    const monthsBeforeMarch = Math.floor((14 - month) / 12);
    const y = year + 4800 - monthsBeforeMarch;
    const m = month + 12 * monthsBeforeMarch - 3;

    return (
        day +
        Math.floor((153 * m + 2) / 5) +
        365 * y +
        Math.floor(y / 4) -
        Math.floor(y / 100) +
        Math.floor(y / 400) -
        32045
    );
}
