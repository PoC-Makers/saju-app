import type { HeavenlyStem, Pillar } from "../types/saju.types";
import { branchIndexOf, stemIndexOf, toPillar } from "./pillar";

/** 오호둔(五虎遁) — 년간이 정하는 인월(寅月)의 천간 */
const IN_MONTH_STEM_BY_YEAR_STEM: Record<HeavenlyStem, HeavenlyStem> = {
    갑: "병", 기: "병",
    을: "무", 경: "무",
    병: "경", 신: "경",
    정: "임", 임: "임",
    무: "갑", 계: "갑",
};

const IN_BRANCH_INDEX = branchIndexOf("인");

/** 월주 — 절기월 0번(인월)부터 천간·지지가 한 칸씩 함께 나아간다 */
export function monthPillar(year: Pillar, solarMonth: number): Pillar {
    const inMonthStem = IN_MONTH_STEM_BY_YEAR_STEM[year.stem];
    return toPillar(stemIndexOf(inMonthStem) + solarMonth, IN_BRANCH_INDEX + solarMonth);
}
