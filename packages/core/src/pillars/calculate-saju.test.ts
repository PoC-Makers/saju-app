import { describe, expect, it } from "vitest";

import type { Birth } from "../types/saju.types";
import { calculateSaju } from "./calculate-saju";
import { dayPillar } from "./day-pillar";
import { BirthTimeRequiredError, InvalidBirthError } from "./saju-errors";

// 테스트 값은 전부 가상의 예시다 — 실제 인물의 생년월일시가 아니다
const SEOUL_LONGITUDE = 126.978;
const birth = (date: Birth["date"], time?: Birth["time"]): Birth =>
    time ? { date, time, longitude: SEOUL_LONGITUDE } : { date, longitude: SEOUL_LONGITUDE };

describe("calculateSaju", () => {
    it("입춘 직전 출생 — 계묘년 을축월", () => {
        const result = calculateSaju(birth({ year: 2024, month: 2, day: 4 }, { hour: 17, minute: 0 }));
        expect(result.year).toEqual({ stem: "계", branch: "묘" });
        expect(result.month).toEqual({ stem: "을", branch: "축" });
    });

    it("입춘 직후 출생 — 갑진년 병인월", () => {
        const result = calculateSaju(birth({ year: 2024, month: 2, day: 4 }, { hour: 18, minute: 0 }));
        expect(result.year).toEqual({ stem: "갑", branch: "진" });
        expect(result.month).toEqual({ stem: "병", branch: "인" });
    });

    it("네 기둥 전체", () => {
        // 2024-06-15 12:00 KST → 진태양시 약 11:28 → 오시
        expect(calculateSaju(birth({ year: 2024, month: 6, day: 15 }, { hour: 12, minute: 0 }))).toEqual({
            year: { stem: "갑", branch: "진" },
            month: { stem: "경", branch: "오" },
            day: dayPillar({ year: 2024, month: 6, day: 15 }),
            hour: expect.objectContaining({ branch: "오" }),
        });
    });

    it("진태양시 보정으로 시지가 넘어간다 — 벽시계 13:10은 진태양시 오시", () => {
        const result = calculateSaju(birth({ year: 2024, month: 4, day: 15 }, { hour: 13, minute: 10 }));
        expect(result.hour?.branch).toBe("오");
    });

    describe("자시 경계 (D2) — 진태양시 보정 이후에 판정", () => {
        // 2024-04-10은 갑진일, 다음날은 을사일. 23:55 KST → 진태양시 약 23:22 (야자시)
        const lateZi = birth({ year: 2024, month: 4, day: 10 }, { hour: 23, minute: 55 });

        it("전제 확인 — 갑진일 다음날은 을사일", () => {
            expect(dayPillar({ year: 2024, month: 4, day: 10 })).toEqual({ stem: "갑", branch: "진" });
            expect(dayPillar({ year: 2024, month: 4, day: 11 })).toEqual({ stem: "을", branch: "사" });
        });

        it("keep-day(기본) — 일주는 당일, 시주는 다음날 자시 (갑일 야자시 → 병자)", () => {
            const result = calculateSaju(lateZi);
            expect(result.day).toEqual({ stem: "갑", branch: "진" });
            expect(result.hour).toEqual({ stem: "병", branch: "자" });
        });

        it("next-day — 일주만 다음날로 넘어가고 시주는 같다", () => {
            const result = calculateSaju(lateZi, { ziBoundary: "next-day" });
            expect(result.day).toEqual({ stem: "을", branch: "사" });
            expect(result.hour).toEqual({ stem: "병", branch: "자" });
        });

        it("조자시(00시대)는 그날 일간 기준 — 을사일 00:30은 병자시", () => {
            // 2024-04-11 01:05 KST → 진태양시 약 00:32
            const result = calculateSaju(birth({ year: 2024, month: 4, day: 11 }, { hour: 1, minute: 5 }));
            expect(result.day).toEqual({ stem: "을", branch: "사" });
            expect(result.hour).toEqual({ stem: "병", branch: "자" });
        });

        it("해시(21~23시)는 당일 일간 기준 — 갑일 해시는 을해", () => {
            // 2024-04-10 23:20 KST → 진태양시 약 22:47
            const result = calculateSaju(birth({ year: 2024, month: 4, day: 10 }, { hour: 23, minute: 20 }));
            expect(result.day).toEqual({ stem: "갑", branch: "진" });
            expect(result.hour).toEqual({ stem: "을", branch: "해" });
        });

        it("벽시계 00:20은 진태양시로 전날 23시대 — 일주는 전날", () => {
            const result = calculateSaju(birth({ year: 2024, month: 4, day: 11 }, { hour: 0, minute: 20 }));
            expect(result.day).toEqual({ stem: "갑", branch: "진" });
            expect(result.hour).toEqual({ stem: "병", branch: "자" });
        });
    });

    describe("시각 미상 — 3주 모드 (D6)", () => {
        const unknownTime = birth({ year: 2024, month: 6, day: 15 });

        it("시주는 null, 나머지 세 기둥은 계산된다", () => {
            const result = calculateSaju(unknownTime);
            expect(result.hour).toBeNull();
            expect(result.year).toEqual({ stem: "갑", branch: "진" });
            expect(result.day).toEqual(dayPillar({ year: 2024, month: 6, day: 15 }));
        });

        it("자시 옵션이 결과에 영향을 주지 않는다", () => {
            expect(calculateSaju(unknownTime, { ziBoundary: "next-day" })).toEqual(calculateSaju(unknownTime));
        });

        it("출생일에 절기가 바뀌었으면 시각을 요구한다", () => {
            expect(() => calculateSaju(birth({ year: 2024, month: 2, day: 4 }))).toThrow(BirthTimeRequiredError);
        });
    });

    describe("입력 검증", () => {
        it.each([
            ["없는 날짜", birth({ year: 2023, month: 2, day: 29 }, { hour: 12, minute: 0 })],
            ["범위 밖 시각", birth({ year: 2024, month: 1, day: 1 }, { hour: 24, minute: 0 })],
            ["범위 밖 경도", { date: { year: 2024, month: 1, day: 1 }, longitude: 200 }],
        ])("%s → InvalidBirthError", (_, input) => {
            expect(() => calculateSaju(input)).toThrow(InvalidBirthError);
        });
    });
});
