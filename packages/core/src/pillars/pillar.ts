import { EARTHLY_BRANCHES, HEAVENLY_STEMS } from "../constants/ganji";
import type { EarthlyBranch, HeavenlyStem, Pillar } from "../types/saju.types";

/** JS의 %는 음수에서 음수를 돌려준다 — 순환 인덱스는 항상 이 함수로 감싼다 */
const cyclicIndex = (n: number, size: number) => ((n % size) + size) % size;

export function toPillar(stemIndex: number, branchIndex: number): Pillar {
    return {
        stem: HEAVENLY_STEMS[cyclicIndex(stemIndex, HEAVENLY_STEMS.length)]!,
        branch: EARTHLY_BRANCHES[cyclicIndex(branchIndex, EARTHLY_BRANCHES.length)]!,
    };
}

export const stemIndexOf = (stem: HeavenlyStem) => HEAVENLY_STEMS.indexOf(stem);
export const branchIndexOf = (branch: EarthlyBranch) => EARTHLY_BRANCHES.indexOf(branch);
