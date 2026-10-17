import type { SajuAnalysis } from "../types/analysis.types";
import type { Pillars } from "../types/saju.types";
import { analyzeFiveElements } from "./five-elements";
import { judgeStrength } from "./strength";
import { analyzeTenGods } from "./ten-gods";

/** 팔자 → 풀이에 쓰는 분석 축 (일간·오행·십성·신강약) */
export function analyzeSaju(pillars: Pillars): SajuAnalysis {
    const tenGods = analyzeTenGods(pillars);
    return {
        dayMaster: pillars.day.stem,
        fiveElements: analyzeFiveElements(pillars),
        tenGods,
        strength: judgeStrength(tenGods),
    };
}
