import { describe, expect, it } from "vitest";

import type { Pillars } from "../types/saju.types";
import { judgeStrength } from "./strength";
import { analyzeTenGods } from "./ten-gods";

const strengthOf = (pillars: Pillars) => judgeStrength(analyzeTenGods(pillars));

describe("judgeStrength", () => {
    it("돕는 글자가 대부분이면 신강 — 비겁·인성 가중 8/9", () => {
        expect(
            strengthOf({
                year: { stem: "갑", branch: "인" },
                month: { stem: "병", branch: "인" },
                day: { stem: "갑", branch: "자" },
                hour: { stem: "을", branch: "해" },
            }),
        ).toBe("신강");
    });

    it("돕는 글자가 없으면 신약", () => {
        expect(
            strengthOf({
                year: { stem: "경", branch: "신" },
                month: { stem: "무", branch: "술" },
                day: { stem: "갑", branch: "신" },
                hour: { stem: "신", branch: "유" },
            }),
        ).toBe("신약");
    });

    it("월지 하나가 3배로 무겁다 — 월지 비견 + 일지 정인 = 4/9 → 중화", () => {
        expect(
            strengthOf({
                year: { stem: "경", branch: "신" },
                month: { stem: "무", branch: "인" },
                day: { stem: "갑", branch: "자" },
                hour: { stem: "경", branch: "신" },
            }),
        ).toBe("중화");
    });

    it("같은 글자라도 월지가 아니면 가볍다 — 년지 비견 + 일지 정인 = 2/9 → 신약", () => {
        expect(
            strengthOf({
                year: { stem: "경", branch: "인" },
                month: { stem: "무", branch: "신" },
                day: { stem: "갑", branch: "자" },
                hour: { stem: "경", branch: "신" },
            }),
        ).toBe("신약");
    });
});
