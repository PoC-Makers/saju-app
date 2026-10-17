import { isBeforeLichunMonth } from "../calendar/solar-terms";
import type { CalendarDate, Pillar } from "../types/saju.types";
import { toPillar } from "./pillar";

/** 서기 4년이 갑자년 — 1984년(갑자년)도 여기서 60년씩 떨어져 있다 */
const FIRST_GAPJA_YEAR = 4;
const LAST_MONTH_BEFORE_LICHUN = 2;

/** 사주의 해는 1월 1일이 아니라 입춘에 바뀐다 — 입춘 전 1~2월은 전년도 */
export function sajuYearOf(date: CalendarDate, solarMonth: number): number {
    const isBeforeLichun = date.month <= LAST_MONTH_BEFORE_LICHUN && isBeforeLichunMonth(solarMonth);
    return isBeforeLichun ? date.year - 1 : date.year;
}

export function yearPillar(sajuYear: number): Pillar {
    const yearsSinceGapja = sajuYear - FIRST_GAPJA_YEAR;
    return toPillar(yearsSinceGapja, yearsSinceGapja);
}
