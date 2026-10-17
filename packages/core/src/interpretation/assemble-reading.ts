import { FIVE_ELEMENTS } from "../constants/five-elements";
import type { FiveElementBalance, ReadingCategory, SajuAnalysis, SajuReading, TenGod, TenGodPlacement } from "../types/analysis.types";
import {
    ABSENT_TEN_GOD_FRAGMENTS,
    DAY_MASTER_FRAGMENTS,
    ELEMENT_FRAGMENTS,
    STRENGTH_FRAGMENTS,
    TEN_GOD_FRAGMENTS,
} from "./reading-fragments";

/** 카테고리마다 십성 조각은 많아야 두 개 — 많으면 서로 다른 말이 섞여 읽히지 않는다 */
const MAX_TEN_GOD_FRAGMENTS_PER_CATEGORY = 2;

/** 분석 축 → 카테고리별 문단. 순서는 중요도 순 (일간 → 신강약 → 오행 → 십성) */
export function assembleReading(analysis: SajuAnalysis): SajuReading {
    return {
        personality: [
            DAY_MASTER_FRAGMENTS[analysis.dayMaster],
            STRENGTH_FRAGMENTS[analysis.strength],
            ...elementFragments(analysis.fiveElements),
            ...tenGodFragments("personality", analysis.tenGods),
        ],
        wealth: tenGodFragmentsOrAbsent("wealth", analysis.tenGods),
        love: tenGodFragmentsOrAbsent("love", analysis.tenGods),
        career: tenGodFragmentsOrAbsent("career", analysis.tenGods),
    };
}

function elementFragments(balance: FiveElementBalance): string[] {
    return FIVE_ELEMENTS.flatMap((element) => {
        const { level } = balance[element];
        return level === "적정" ? [] : [ELEMENT_FRAGMENTS[element][level]];
    });
}

/** 사주에 많이 나온 십성부터, 같으면 조각 배열 순서대로 */
function tenGodFragments(category: ReadingCategory, placements: TenGodPlacement[]): string[] {
    const countOf = (tenGod: TenGod) => placements.filter((placement) => placement.tenGod === tenGod).length;
    return TEN_GOD_FRAGMENTS[category]
        .filter(({ tenGod }) => countOf(tenGod) > 0)
        .toSorted((a, b) => countOf(b.tenGod) - countOf(a.tenGod))
        .slice(0, MAX_TEN_GOD_FRAGMENTS_PER_CATEGORY)
        .map(({ text }) => text);
}

function tenGodFragmentsOrAbsent(category: Exclude<ReadingCategory, "personality">, placements: TenGodPlacement[]): string[] {
    const fragments = tenGodFragments(category, placements);
    return fragments.length > 0 ? fragments : [ABSENT_TEN_GOD_FRAGMENTS[category]];
}
