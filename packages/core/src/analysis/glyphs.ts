import { HIDDEN_STEMS } from "../constants/five-elements";
import type { GlyphPosition } from "../types/analysis.types";
import type { EarthlyBranch, HeavenlyStem, Pillars } from "../types/saju.types";

export type Glyph = { position: GlyphPosition; stem: HeavenlyStem };

/** 지지의 대표 천간 — 지장간의 정기(正氣) */
export const mainHiddenStem = (branch: EarthlyBranch): HeavenlyStem => HIDDEN_STEMS[branch].at(-1)!;

/**
 * 일간을 둘러싼 글자들. 지지는 정기를 대표 천간으로 바꿔 담는다.
 * 시각 미상(3주 모드)이면 시주 두 글자가 빠진다
 */
export function surroundingGlyphs({ year, month, day, hour }: Pillars): Glyph[] {
    const glyphs: Glyph[] = [
        { position: "yearStem", stem: year.stem },
        { position: "yearBranch", stem: mainHiddenStem(year.branch) },
        { position: "monthStem", stem: month.stem },
        { position: "monthBranch", stem: mainHiddenStem(month.branch) },
        { position: "dayBranch", stem: mainHiddenStem(day.branch) },
    ];
    if (hour) {
        glyphs.push(
            { position: "hourStem", stem: hour.stem },
            { position: "hourBranch", stem: mainHiddenStem(hour.branch) },
        );
    }
    return glyphs;
}
