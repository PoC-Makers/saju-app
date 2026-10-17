import { describe, expect, it } from "vitest";

import type { Pillars } from "../types/saju.types";
import { analyzeFiveElements } from "./five-elements";

describe("analyzeFiveElements", () => {
    // 갑·인·병·인·갑·자·을·해 → 목 5, 화 1, 수 2
    const woodHeavy: Pillars = {
        year: { stem: "갑", branch: "인" },
        month: { stem: "병", branch: "인" },
        day: { stem: "갑", branch: "자" },
        hour: { stem: "을", branch: "해" },
    };

    it("여덟 글자를 하나씩 센다 — 지지는 정기 오행", () => {
        const balance = analyzeFiveElements(woodHeavy);
        expect(balance.목.count).toBe(5);
        expect(balance.화.count).toBe(1);
        expect(balance.토.count).toBe(0);
        expect(balance.금.count).toBe(0);
        expect(balance.수.count).toBe(2);
    });

    it("8글자 중 3개 이상은 과다, 0개는 부족, 나머지는 적정", () => {
        const balance = analyzeFiveElements(woodHeavy);
        expect(balance.목.level).toBe("과다");
        expect(balance.화.level).toBe("적정");
        expect(balance.수.level).toBe("적정");
        expect(balance.토.level).toBe("부족");
        expect(balance.금.level).toBe("부족");
    });

    it("3주 모드는 여섯 글자로 센다", () => {
        const balance = analyzeFiveElements({ ...woodHeavy, hour: null });
        const total = Object.values(balance).reduce((sum, { count }) => sum + count, 0);
        expect(total).toBe(6);
        expect(balance.수.count).toBe(1);
    });

    it("축·진·미·술은 토로 센다", () => {
        const balance = analyzeFiveElements({
            year: { stem: "임", branch: "축" },
            month: { stem: "갑", branch: "진" },
            day: { stem: "병", branch: "미" },
            hour: { stem: "경", branch: "술" },
        });
        expect(balance.토).toEqual({ count: 4, level: "과다" });
    });
});
