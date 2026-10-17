import { describe, expect, it } from "vitest";

import { solarMonthIndex } from "./solar-terms";

describe("solarMonthIndex", () => {
    // 2024 입춘 = 2024-02-04 17:27 KST (08:27 UTC)
    it("입춘 직전은 축월(11), 직후는 인월(0)", () => {
        expect(solarMonthIndex(Date.parse("2024-02-04T08:20:00Z"))).toBe(11);
        expect(solarMonthIndex(Date.parse("2024-02-04T08:35:00Z"))).toBe(0);
    });

    it.each([
        ["2024-06-15T03:00:00Z", 4], // 오월
        ["2024-12-15T03:00:00Z", 10], // 자월
        ["2025-01-10T03:00:00Z", 11], // 축월
    ])("%s → %i", (iso, expected) => {
        expect(solarMonthIndex(Date.parse(iso))).toBe(expected);
    });
});
