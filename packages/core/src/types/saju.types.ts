import type { FIVE_ELEMENTS } from "../constants/five-elements";
import type { EARTHLY_BRANCHES, HEAVENLY_STEMS } from "../constants/ganji";

export type HeavenlyStem = (typeof HEAVENLY_STEMS)[number];
export type EarthlyBranch = (typeof EARTHLY_BRANCHES)[number];
export type FiveElement = (typeof FIVE_ELEMENTS)[number];

export type Pillar = { stem: HeavenlyStem; branch: EarthlyBranch };

export type Pillars = {
    year: Pillar;
    month: Pillar;
    day: Pillar;
    /** 출생시각 미상이면 null — 3주 모드 (D6) */
    hour: Pillar | null;
};

export type CalendarDate = { year: number; month: number; day: number };
export type ClockTime = { hour: number; minute: number };

export type Birth = {
    /** 한국 벽시계 기준 양력 날짜 */
    date: CalendarDate;
    /** 한국 벽시계 기준 시각. 없으면 3주 모드 (D6) */
    time?: ClockTime;
    /** 출생지 경도(동경 +). 코어는 서울 고정 여부를 모른다 — 호출부가 넘긴다 (D5) */
    longitude: number;
};

/**
 * 23~24시(야자시) 출생자의 일주를 어느 날로 볼지 (D2)
 * - keep-day: 날짜는 자정에 바뀐다. 23시대도 당일
 * - next-day: 하루는 자시에 시작한다. 23시부터 다음날
 */
export type ZiBoundary = "keep-day" | "next-day";

export type SajuOptions = { ziBoundary?: ZiBoundary };
