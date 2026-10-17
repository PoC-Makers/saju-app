import type { GlyphPosition, Strength, TenGod, TenGodPlacement } from "../types/analysis.types";

/** 일간을 돕는 십성 — 같은 오행(비겁)과 나를 생하는 오행(인성) */
const SUPPORTING_TEN_GODS: readonly TenGod[] = ["비견", "겁재", "편인", "정인"];

/** 월지는 태어난 계절의 기운(월령)이라 다른 글자보다 무겁게 본다 */
const MONTH_BRANCH_WEIGHT = 3;
const DEFAULT_WEIGHT = 1;

/** 돕는 힘의 비율이 이 이상이면 신강, 이하면 신약, 사이는 중화 */
const STRONG_RATIO = 0.6;
const WEAK_RATIO = 0.4;

const weightOf = (position: GlyphPosition) => (position === "monthBranch" ? MONTH_BRANCH_WEIGHT : DEFAULT_WEIGHT);

/**
 * 신강·신약 — 일간을 돕는 글자의 가중 비율로 판정한다.
 * 통근·합충은 아직 반영하지 않는다 (입문 수준의 1차 판정)
 */
export function judgeStrength(tenGods: TenGodPlacement[]): Strength {
    const total = tenGods.reduce((sum, { position }) => sum + weightOf(position), 0);
    const support = tenGods
        .filter(({ tenGod }) => SUPPORTING_TEN_GODS.includes(tenGod))
        .reduce((sum, { position }) => sum + weightOf(position), 0);

    const ratio = support / total;
    if (ratio >= STRONG_RATIO) return "신강";
    if (ratio <= WEAK_RATIO) return "신약";
    return "중화";
}
