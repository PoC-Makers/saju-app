import { toJulianDayNumber } from "../calendar/julian-day";
import type { CalendarDate, Pillar } from "../types/saju.types";
import { toPillar } from "./pillar";

/**
 * JDN과 일진의 위상차. 기준일 상수 없이 JDN에서 바로 유도한다 (D1).
 * 1900-01-01 ~ 2050-12-31 전 55,152일을 KASI 데이터 기반 라이브러리와 대조해 불일치 0.
 */
const JDN_STEM_OFFSET = 9;
const JDN_BRANCH_OFFSET = 1;

/** 일주는 달력 날짜만으로 정해진다 — 표준시·서머타임과 무관 */
export function dayPillar(date: CalendarDate): Pillar {
    const jdn = toJulianDayNumber(date);
    return toPillar(jdn + JDN_STEM_OFFSET, jdn + JDN_BRANCH_OFFSET);
}
