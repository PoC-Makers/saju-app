import { describe, expect, it } from "vitest";

import { analyzeSaju } from "../analysis/analyze-saju";
import { HEAVENLY_STEMS } from "../constants/ganji";
import type { Pillars } from "../types/saju.types";
import { assembleReading } from "./assemble-reading";
import {
    ABSENT_TEN_GOD_FRAGMENTS,
    DAY_MASTER_FRAGMENTS,
    ELEMENT_FRAGMENTS,
    STRENGTH_FRAGMENTS,
    TEN_GOD_FRAGMENTS,
} from "./reading-fragments";

// 갑 일간 · 목 과다 · 토/금 부족 · 신강 · 재성/관성 없음
const woodHeavy: Pillars = {
    year: { stem: "갑", branch: "인" },
    month: { stem: "병", branch: "인" },
    day: { stem: "갑", branch: "자" },
    hour: { stem: "을", branch: "해" },
};

describe("assembleReading", () => {
    const reading = assembleReading(analyzeSaju(woodHeavy));

    it("성격은 일간 → 신강약 → 오행 과다·부족 순으로 시작한다", () => {
        expect(reading.personality.slice(0, 5)).toEqual([
            DAY_MASTER_FRAGMENTS.갑,
            STRENGTH_FRAGMENTS.신강,
            ELEMENT_FRAGMENTS.목.과다,
            ELEMENT_FRAGMENTS.토.부족,
            ELEMENT_FRAGMENTS.금.부족,
        ]);
    });

    it("성격 십성 조각은 많이 나온 순서로 최대 두 개 — 비견 3 > 겁재·편인·정인 1", () => {
        const tenGodTexts = reading.personality.slice(5);
        expect(tenGodTexts).toHaveLength(2);
        expect(tenGodTexts[0]).toBe(TEN_GOD_FRAGMENTS.personality.find(({ tenGod }) => tenGod === "비견")?.text);
    });

    it("해당 십성이 없으면 '없음' 조각을 쓴다", () => {
        expect(reading.wealth).toEqual([ABSENT_TEN_GOD_FRAGMENTS.wealth]);
        expect(reading.love).toEqual([ABSENT_TEN_GOD_FRAGMENTS.love]);
    });

    it("직업은 있는 십성만 고른다 — 병(식신) 하나뿐이라 식신 조각만", () => {
        expect(reading.career).toEqual([TEN_GOD_FRAGMENTS.career.find(({ tenGod }) => tenGod === "식신")?.text]);
    });

    it("3주 모드에서도 모든 카테고리가 채워진다", () => {
        const threePillars = assembleReading(analyzeSaju({ ...woodHeavy, hour: null }));
        for (const paragraphs of Object.values(threePillars)) {
            expect(paragraphs.length).toBeGreaterThan(0);
        }
    });
});

describe("풀이 조각 품질", () => {
    const allTexts = [
        ...Object.values(DAY_MASTER_FRAGMENTS),
        ...Object.values(STRENGTH_FRAGMENTS),
        ...Object.values(ELEMENT_FRAGMENTS).flatMap(({ 과다, 부족 }) => [과다, 부족]),
        ...Object.values(TEN_GOD_FRAGMENTS).flatMap((fragments) => fragments.map(({ text }) => text)),
        ...Object.values(ABSENT_TEN_GOD_FRAGMENTS),
    ];

    it("일간 10개가 모두 있다", () => {
        expect(Object.keys(DAY_MASTER_FRAGMENTS).sort()).toEqual([...HEAVENLY_STEMS].sort());
    });

    it.each(["죽", "사망", "이혼", "암에", "질병", "종목", "반드시", "무조건"])("금칙어 '%s'가 없다", (word) => {
        expect(allTexts.filter((text) => text.includes(word))).toEqual([]);
    });

    it("같은 문장이 두 번 쓰이지 않는다", () => {
        expect(new Set(allTexts).size).toBe(allTexts.length);
    });
});
