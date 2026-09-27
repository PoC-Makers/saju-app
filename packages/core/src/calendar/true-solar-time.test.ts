import { describe, expect, it } from "vitest";

import type { ClockTime } from "../types/saju.types";
import { koreanWallClockToUtc } from "./timezone";
import { toTrueSolarTime } from "./true-solar-time";

const SEOUL_LONGITUDE = 126.978;

const minutesOfDay = ({ hour, minute }: ClockTime) => hour * 60 + minute;

describe("toTrueSolarTime", () => {
    // 서울 평균태양시 = KST − 32분. 여기에 균시차가 더해진다
    it.each([
        ["2월 중순 — 균시차 약 −14분", { year: 2024, month: 2, day: 11 }, 11 * 60 + 14],
        ["4월 중순 — 균시차 약 0분", { year: 2024, month: 4, day: 15 }, 11 * 60 + 28],
        ["11월 초 — 균시차 약 +16분", { year: 2024, month: 11, day: 3 }, 11 * 60 + 44],
    ])("%s", (_, date, expectedMinutes) => {
        const noonUtc = koreanWallClockToUtc(date, { hour: 12, minute: 0 });
        const solar = toTrueSolarTime(noonUtc, SEOUL_LONGITUDE);
        expect(solar.date).toEqual(date);
        expect(Math.abs(minutesOfDay(solar.time) - expectedMinutes)).toBeLessThanOrEqual(1);
    });

    it("자정 직후 출생은 진태양시로 전날이 된다", () => {
        const birthUtc = koreanWallClockToUtc({ year: 2024, month: 4, day: 16 }, { hour: 0, minute: 20 });
        const solar = toTrueSolarTime(birthUtc, SEOUL_LONGITUDE);
        expect(solar.date).toEqual({ year: 2024, month: 4, day: 15 });
        expect(solar.time.hour).toBe(23);
    });
});
