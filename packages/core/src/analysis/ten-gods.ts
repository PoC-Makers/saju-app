import { FIVE_ELEMENTS, STEM_ELEMENT } from "../constants/five-elements";
import { stemIndexOf } from "../pillars/pillar";
import type { TenGod, TenGodPlacement } from "../types/analysis.types";
import type { HeavenlyStem, Pillars } from "../types/saju.types";
import { surroundingGlyphs } from "./glyphs";

/**
 * 일간 오행에서 상대 오행까지 상생 순서로 몇 칸인가 → 관계가 정해진다.
 * 0 같음(비겁) · 1 내가 생함(식상) · 2 내가 극함(재성) · 3 나를 극함(관성) · 4 나를 생함(인성)
 * 각 쌍은 [음양이 같을 때, 음양이 다를 때]
 */
const TEN_GODS_BY_ELEMENT_DISTANCE: readonly (readonly [TenGod, TenGod])[] = [
    ["비견", "겁재"],
    ["식신", "상관"],
    ["편재", "정재"],
    ["편관", "정관"],
    ["편인", "정인"],
];

/** 천간은 양·음이 번갈아 온다 (갑 양, 을 음, …) */
const isYangStem = (stem: HeavenlyStem) => stemIndexOf(stem) % 2 === 0;

export function tenGodOf(dayMaster: HeavenlyStem, other: HeavenlyStem): TenGod {
    const from = FIVE_ELEMENTS.indexOf(STEM_ELEMENT[dayMaster]);
    const to = FIVE_ELEMENTS.indexOf(STEM_ELEMENT[other]);
    const distance = (to - from + FIVE_ELEMENTS.length) % FIVE_ELEMENTS.length;
    const [samePolarity, oppositePolarity] = TEN_GODS_BY_ELEMENT_DISTANCE[distance]!;
    return isYangStem(dayMaster) === isYangStem(other) ? samePolarity : oppositePolarity;
}

export function analyzeTenGods(pillars: Pillars): TenGodPlacement[] {
    const dayMaster = pillars.day.stem;
    return surroundingGlyphs(pillars).map(({ position, stem }) => ({
        position,
        tenGod: tenGodOf(dayMaster, stem),
    }));
}
