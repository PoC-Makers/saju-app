import { describe, expect, it } from "vitest";

import { toJulianDayNumber } from "./julian-day";

describe("toJulianDayNumber", () => {
    it.each([
        [{ year: 2000, month: 1, day: 1 }, 2451545],
        [{ year: 1900, month: 1, day: 1 }, 2415021],
        [{ year: 1970, month: 1, day: 1 }, 2440588],
    ])("%o → %i", (date, jdn) => {
        expect(toJulianDayNumber(date)).toBe(jdn);
    });

    it("윤년 2월 29일과 3월 1일은 하루 차이", () => {
        const leapDay = toJulianDayNumber({ year: 2024, month: 2, day: 29 });
        expect(toJulianDayNumber({ year: 2024, month: 3, day: 1 })).toBe(leapDay + 1);
    });
});
