import { describe, expect, it } from "vitest";

import { sajuYearOf, yearPillar } from "./year-pillar";

describe("yearPillar", () => {
    it.each([
        [1984, "갑", "자"],
        [2024, "갑", "진"],
        [1900, "경", "자"],
    ])("%i → %s%s", (year, stem, branch) => {
        expect(yearPillar(year)).toEqual({ stem, branch });
    });
});

describe("sajuYearOf — 입춘 기준", () => {
    it("1~2월 자·축월이면 전년도", () => {
        expect(sajuYearOf({ year: 2024, month: 1, day: 10 }, 11)).toBe(2023);
        expect(sajuYearOf({ year: 2024, month: 1, day: 3 }, 10)).toBe(2023);
    });

    it("12월 자월은 그해 그대로", () => {
        expect(sajuYearOf({ year: 2024, month: 12, day: 20 }, 10)).toBe(2024);
    });
});
