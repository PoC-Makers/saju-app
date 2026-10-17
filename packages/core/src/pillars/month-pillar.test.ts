import { describe, expect, it } from "vitest";

import { monthPillar } from "./month-pillar";

describe("monthPillar — 오호둔", () => {
    it.each([
        ["갑", "병"],
        ["기", "병"],
        ["을", "무"],
        ["병", "경"],
        ["정", "임"],
        ["무", "갑"],
    ] as const)("%s년 인월 → %s인", (yearStem, inMonthStem) => {
        expect(monthPillar({ stem: yearStem, branch: "자" }, 0)).toEqual({ stem: inMonthStem, branch: "인" });
    });

    it("갑년 축월(절기월 11)은 정축", () => {
        expect(monthPillar({ stem: "갑", branch: "진" }, 11)).toEqual({ stem: "정", branch: "축" });
    });
});
