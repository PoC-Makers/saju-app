import { FIVE_ELEMENTS, STEM_ELEMENT } from "../constants/five-elements";
import type { ElementLevel, FiveElementBalance } from "../types/analysis.types";
import type { FiveElement, Pillars } from "../types/saju.types";
import { surroundingGlyphs } from "./glyphs";

/** 전체 글자 중 이 비율 이상이면 과다 — 8글자 기준 3개, 6글자(3주) 기준 3개 */
const EXCESS_RATIO = 3 / 8;

/** 한 글자도 없으면 부족, 비율이 EXCESS_RATIO 이상이면 과다 */
function levelOf(count: number, total: number): ElementLevel {
    if (count === 0) return "부족";
    return count / total >= EXCESS_RATIO ? "과다" : "적정";
}

/** 오행 분포 — 일간을 포함한 모든 글자를 한 개씩 센다. 지지는 정기 오행으로 본다 */
export function analyzeFiveElements(pillars: Pillars): FiveElementBalance {
    const stems = [pillars.day.stem, ...surroundingGlyphs(pillars).map((glyph) => glyph.stem)];
    const countOf = (element: FiveElement) => stems.filter((stem) => STEM_ELEMENT[stem] === element).length;

    const balance = {} as FiveElementBalance;
    for (const element of FIVE_ELEMENTS) {
        const count = countOf(element);
        balance[element] = { count, level: levelOf(count, stems.length) };
    }
    return balance;
}
