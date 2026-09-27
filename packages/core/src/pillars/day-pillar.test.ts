import { describe, expect, it } from "vitest";

import { dayPillar } from "./day-pillar";

describe("dayPillar — JDN 직접 유도 (D1)", () => {
    it.each([
        [{ year: 1900, month: 1, day: 1 }, "갑", "술"],
        // 1984년은 갑자"년"이지 갑자"일"이 아니다 — 년주·일주 앵커 혼동 방지
        [{ year: 1984, month: 2, day: 2 }, "병", "인"],
        [{ year: 2000, month: 1, day: 1 }, "무", "오"],
    ])("%o → %s%s", (date, stem, branch) => {
        expect(dayPillar(date)).toEqual({ stem, branch });
    });

    it("하루마다 60갑자를 한 칸씩 나아간다", () => {
        expect(dayPillar({ year: 1900, month: 1, day: 2 })).toEqual({ stem: "을", branch: "해" });
        expect(dayPillar({ year: 1900, month: 3, day: 2 })).toEqual(dayPillar({ year: 1900, month: 1, day: 1 }));
    });
});
