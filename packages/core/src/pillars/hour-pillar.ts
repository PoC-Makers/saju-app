import type { ClockTime, HeavenlyStem, Pillar } from "../types/saju.types";
import { stemIndexOf, toPillar } from "./pillar";

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;
/** 시지(時支)는 2시간 단위 */
const MINUTES_PER_BRANCH = 2 * MINUTES_PER_HOUR;
/** 자시(子時)는 23시에 시작한다 */
const ZI_HOUR_START = 23;

/** 오서둔(五鼠遁) — 일간이 정하는 자시(子時)의 천간 */
const ZI_HOUR_STEM_BY_DAY_STEM: Record<HeavenlyStem, HeavenlyStem> = {
    갑: "갑", 기: "갑",
    을: "병", 경: "병",
    병: "무", 신: "무",
    정: "경", 임: "경",
    무: "임", 계: "임",
};

/** 야자시(夜子時) — 자시 중 자정 전 구간(23:00~23:59) */
export const isLateZiHour = (time: ClockTime) => time.hour >= ZI_HOUR_START;

/** 진태양시 → 시지 인덱스 (0 = 자 … 11 = 해) */
export function hourBranchIndex(time: ClockTime): number {
    const minutesOfDay = time.hour * MINUTES_PER_HOUR + time.minute;
    const minutesSinceZiStart =
        (minutesOfDay - ZI_HOUR_START * MINUTES_PER_HOUR + MINUTES_PER_DAY) % MINUTES_PER_DAY;
    return Math.floor(minutesSinceZiStart / MINUTES_PER_BRANCH);
}

/** 시주 — 시간(時干)은 일간에서 유도된다. 일주가 바뀌면 시주도 함께 바뀐다 */
export function hourPillar(day: Pillar, trueSolarTime: ClockTime): Pillar {
    const ziHourStem = ZI_HOUR_STEM_BY_DAY_STEM[day.stem];
    const branchIndex = hourBranchIndex(trueSolarTime);
    return toPillar(stemIndexOf(ziHourStem) + branchIndex, branchIndex);
}
