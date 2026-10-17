import type { FiveElement, HeavenlyStem } from "./saju.types";

/** 오행 하나의 많고 적음 */
export type ElementLevel = "과다" | "적정" | "부족";

export type FiveElementBalance = Record<FiveElement, { count: number; level: ElementLevel }>;

/** 십성(十星) — 일간과 다른 글자의 관계 */
export type TenGod = "비견" | "겁재" | "식신" | "상관" | "편재" | "정재" | "편관" | "정관" | "편인" | "정인";

/** 일간을 뺀 글자 자리. 지지는 지장간 정기(正氣)로 십성을 본다 */
export type GlyphPosition =
    | "yearStem"
    | "yearBranch"
    | "monthStem"
    | "monthBranch"
    | "dayBranch"
    | "hourStem"
    | "hourBranch";

export type TenGodPlacement = { position: GlyphPosition; tenGod: TenGod };

export type Strength = "신강" | "중화" | "신약";

/** 풀이 조립의 입력. 나중에 AI 풀이에도 그대로 넘길 수 있도록 구조화해 둔다 */
export type SajuAnalysis = {
    dayMaster: HeavenlyStem;
    fiveElements: FiveElementBalance;
    tenGods: TenGodPlacement[];
    strength: Strength;
};

export type ReadingCategory = "personality" | "wealth" | "love" | "career";

export type SajuReading = Record<ReadingCategory, string[]>;
