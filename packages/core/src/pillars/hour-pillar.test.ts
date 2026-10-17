import { describe, expect, it } from "vitest";

import { hourBranchIndex, hourPillar } from "./hour-pillar";

describe("hourBranchIndex — 23시부터 2시간 단위", () => {
    it.each([
        [23, 0, 0],
        [0, 59, 0],
        [1, 0, 1],
        [11, 30, 6],
        [22, 59, 11],
    ])("%i:%i → %i", (hour, minute, expected) => {
        expect(hourBranchIndex({ hour, minute })).toBe(expected);
    });
});

describe("hourPillar — 오서둔", () => {
    it.each([
        ["갑", "갑"],
        ["을", "병"],
        ["병", "무"],
        ["정", "경"],
        ["무", "임"],
    ] as const)("%s일 자시 → %s자", (dayStem, ziStem) => {
        expect(hourPillar({ stem: dayStem, branch: "자" }, { hour: 0, minute: 30 })).toEqual({
            stem: ziStem,
            branch: "자",
        });
    });

    it("갑일 해시(21~23시)는 을해", () => {
        expect(hourPillar({ stem: "갑", branch: "자" }, { hour: 22, minute: 0 })).toEqual({
            stem: "을",
            branch: "해",
        });
    });
});
