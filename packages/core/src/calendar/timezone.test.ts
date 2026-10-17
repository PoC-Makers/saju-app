import { describe, expect, it } from "vitest";

import { koreanWallClockToUtc } from "./timezone";

describe("koreanWallClockToUtc — tz DB가 표준시 변경·서머타임을 반영한다", () => {
    it.each([
        ["현재 (+09:00)", { year: 2024, month: 6, day: 1 }, "2024-06-01T03:00:00Z"],
        ["127.5° 표준시 (+08:30)", { year: 1960, month: 1, day: 1 }, "1960-01-01T03:30:00Z"],
        ["1958 서머타임 (+09:30)", { year: 1958, month: 6, day: 1 }, "1958-06-01T02:30:00Z"],
        ["1988 서머타임 (+10:00)", { year: 1988, month: 7, day: 1 }, "1988-07-01T02:00:00Z"],
        ["135° 복귀 후 (+09:00)", { year: 1962, month: 6, day: 1 }, "1962-06-01T03:00:00Z"],
    ])("%s", (_, date, expected) => {
        expect(koreanWallClockToUtc(date, { hour: 12, minute: 0 })).toBe(Date.parse(expected));
    });
});
