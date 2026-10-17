import { describe, expect, it } from "vitest";

import type { Pillars } from "../types/saju.types";
import { analyzeTenGods, tenGodOf } from "./ten-gods";

describe("tenGodOf", () => {
    it.each([
        ["갑", "비견"],
        ["을", "겁재"],
        ["병", "식신"],
        ["정", "상관"],
        ["무", "편재"],
        ["기", "정재"],
        ["경", "편관"],
        ["신", "정관"],
        ["임", "편인"],
        ["계", "정인"],
    ] as const)("갑 일간에게 %s는 %s", (other, expected) => {
        expect(tenGodOf("갑", other)).toBe(expected);
    });

    it.each([
        ["갑", "겁재"],
        ["경", "정관"],
        ["신", "편관"],
        ["계", "편인"],
    ] as const)("음간(을) 일간에게 %s는 %s — 음양 판정이 뒤집힌다", (other, expected) => {
        expect(tenGodOf("을", other)).toBe(expected);
    });

    it("상생 순환이 수 → 목으로 이어진다 — 계 일간에게 갑은 상관", () => {
        expect(tenGodOf("계", "갑")).toBe("상관");
    });
});

describe("analyzeTenGods", () => {
    const pillars: Pillars = {
        year: { stem: "경", branch: "자" },
        month: { stem: "무", branch: "인" },
        day: { stem: "갑", branch: "오" },
        hour: { stem: "정", branch: "묘" },
    };

    it("지지는 지장간 정기로 본다 — 자(계)는 정인, 오(정)는 상관", () => {
        expect(analyzeTenGods(pillars)).toEqual([
            { position: "yearStem", tenGod: "편관" },
            { position: "yearBranch", tenGod: "정인" },
            { position: "monthStem", tenGod: "편재" },
            { position: "monthBranch", tenGod: "비견" },
            { position: "dayBranch", tenGod: "상관" },
            { position: "hourStem", tenGod: "상관" },
            { position: "hourBranch", tenGod: "겁재" },
        ]);
    });

    it("3주 모드면 시주 두 자리가 빠진다", () => {
        const positions = analyzeTenGods({ ...pillars, hour: null }).map(({ position }) => position);
        expect(positions).not.toContain("hourStem");
        expect(positions).not.toContain("hourBranch");
        expect(positions).toHaveLength(5);
    });
});
