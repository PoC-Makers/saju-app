import { Body, HourAngle, Observer } from "astronomy-engine";

import type { CalendarDate, ClockTime } from "../types/saju.types";

const MS_PER_HOUR = 3_600_000;
const HOURS_PER_DAY = 24;
/** 지구는 1시간에 15°씩 돈다 — 경도 15°가 평균태양시 1시간 차이 */
const DEGREES_PER_HOUR = 15;
/** 태양 시각(時角) 0 = 남중 = 진태양시 정오 */
const SOLAR_NOON_HOUR = 12;
/** 태양 시각은 위도와 사실상 무관하다(시차 8.8″ → 1초 미만). 적도 관측자로 계산한다 */
const EQUATOR_LATITUDE = 0;

export type SolarDateTime = { date: CalendarDate; time: ClockTime };

/** UTC 순간 → 해당 경도의 진태양시 (평균태양시 + 균시차) */
export function toTrueSolarTime(utcMs: number, longitude: number): SolarDateTime {
    const meanSolarMs = utcMs + (longitude / DEGREES_PER_HOUR) * MS_PER_HOUR;
    const trueSolarMs = meanSolarMs + equationOfTimeMs(utcMs, longitude, meanSolarMs);

    // 진태양시 벽시계를 UTC 필드에 담아 읽는다 — 로컬 타임존이 끼어들지 않게
    const solar = new Date(trueSolarMs);
    return {
        date: { year: solar.getUTCFullYear(), month: solar.getUTCMonth() + 1, day: solar.getUTCDate() },
        time: { hour: solar.getUTCHours(), minute: solar.getUTCMinutes() },
    };
}

/** 균시차(EoT) = 진태양시 − 평균태양시. 연중 −14분 ~ +16분 */
function equationOfTimeMs(utcMs: number, longitude: number, meanSolarMs: number): number {
    const observer = new Observer(EQUATOR_LATITUDE, longitude, 0);
    const sunHourAngle = HourAngle(Body.Sun, new Date(utcMs), observer);
    const trueSolarHours = (sunHourAngle + SOLAR_NOON_HOUR) % HOURS_PER_DAY;
    const meanSolarHours = (meanSolarMs / MS_PER_HOUR) % HOURS_PER_DAY;

    // 자정을 사이에 두면 차이가 ±24시간 근처로 튄다 — ±12시간 안으로 되돌린다
    const differenceHours = trueSolarHours - meanSolarHours;
    const wrappedHours =
        ((differenceHours + HOURS_PER_DAY * 1.5) % HOURS_PER_DAY) - HOURS_PER_DAY / 2;
    return wrappedHours * MS_PER_HOUR;
}
