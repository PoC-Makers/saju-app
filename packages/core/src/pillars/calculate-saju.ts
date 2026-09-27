import { isValidCalendarDate, nextDay } from "../calendar/calendar-date";
import { solarMonthIndex } from "../calendar/solar-terms";
import { koreanWallClockToUtc } from "../calendar/timezone";
import { toTrueSolarTime } from "../calendar/true-solar-time";
import type { Birth, CalendarDate, ClockTime, Pillar, Pillars, SajuOptions, ZiBoundary } from "../types/saju.types";
import { dayPillar } from "./day-pillar";
import { hourPillar, isLateZiHour } from "./hour-pillar";
import { monthPillar } from "./month-pillar";
import { BirthTimeRequiredError, InvalidBirthError } from "./saju-errors";
import { sajuYearOf, yearPillar } from "./year-pillar";

const DEFAULT_ZI_BOUNDARY: ZiBoundary = "keep-day";
const START_OF_DAY: ClockTime = { hour: 0, minute: 0 };
const END_OF_DAY: ClockTime = { hour: 23, minute: 59 };
const MAX_LONGITUDE = 180;

export function calculateSaju(birth: Birth, options: SajuOptions = {}): Pillars {
    assertValidBirth(birth);

    return birth.time
        ? calculateFourPillars(birth, birth.time, options.ziBoundary ?? DEFAULT_ZI_BOUNDARY)
        : calculateThreePillars(birth);
}

function calculateFourPillars(birth: Birth, time: ClockTime, ziBoundary: ZiBoundary): Pillars {
    const birthUtc = koreanWallClockToUtc(birth.date, time);
    const { year, month } = pillarsBySolarTerm(birth.date, birthUtc);

    // 날짜 경계·시지 판정은 진태양시 보정 이후에 한다 — 순서가 바뀌면 23시 전후가 통째로 틀린다
    const trueSolar = toTrueSolarTime(birthUtc, birth.longitude);

    // 야자시의 시주는 다음날 자시다 (갑일 23시 → 병자시). ziBoundary는 일주만 바꾼다
    const isLateZi = isLateZiHour(trueSolar.time);
    const nextDayPillar = dayPillar(nextDay(trueSolar.date));
    const hour = hourPillar(isLateZi ? nextDayPillar : dayPillar(trueSolar.date), trueSolar.time);

    const shouldRollToNextDay = ziBoundary === "next-day" && isLateZi;
    const day = shouldRollToNextDay ? nextDayPillar : dayPillar(trueSolar.date);

    return { year, month, day, hour };
}

/** 시각 미상 — 시주를 빼고 년·월·일주만 (D6). 임의 시각으로 채우지 않는다 */
function calculateThreePillars(birth: Birth): Pillars {
    const atStartOfDay = solarMonthIndex(koreanWallClockToUtc(birth.date, START_OF_DAY));
    const atEndOfDay = solarMonthIndex(koreanWallClockToUtc(birth.date, END_OF_DAY));
    const solarTermChangedThatDay = atStartOfDay !== atEndOfDay;
    if (solarTermChangedThatDay) {
        throw new BirthTimeRequiredError("출생일에 절기가 바뀌어 시각 없이는 년주·월주를 정할 수 없습니다");
    }

    const { year, month } = pillarsBySolarTerm(birth.date, koreanWallClockToUtc(birth.date, START_OF_DAY));
    return { year, month, day: dayPillar(birth.date), hour: null };
}

/** 년주·월주는 절기(태양 황경)로 정해진다 — 출생 순간 그대로 본다 */
function pillarsBySolarTerm(date: CalendarDate, birthUtc: number): { year: Pillar; month: Pillar } {
    const solarMonth = solarMonthIndex(birthUtc);
    const year = yearPillar(sajuYearOf(date, solarMonth));
    return { year, month: monthPillar(year, solarMonth) };
}

function assertValidBirth({ date, time, longitude }: Birth): void {
    if (!isValidCalendarDate(date)) {
        throw new InvalidBirthError(`존재하지 않는 날짜입니다: ${date.year}-${date.month}-${date.day}`);
    }
    if (time && !isValidClockTime(time)) {
        throw new InvalidBirthError(`잘못된 시각입니다: ${time.hour}:${time.minute}`);
    }
    if (!Number.isFinite(longitude) || Math.abs(longitude) > MAX_LONGITUDE) {
        throw new InvalidBirthError(`잘못된 경도입니다: ${longitude}`);
    }
}

function isValidClockTime({ hour, minute }: ClockTime): boolean {
    return Number.isInteger(hour) && Number.isInteger(minute) && hour >= 0 && hour < 24 && minute >= 0 && minute < 60;
}
