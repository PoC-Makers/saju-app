import type { EarthlyBranch, FiveElement, HeavenlyStem } from "../types/saju.types";

/** 오행(五行) 5개. 배열 순서가 곧 상생 순서다 (목 → 화 → 토 → 금 → 수 → 목) */
export const FIVE_ELEMENTS = ["목", "화", "토", "금", "수"] as const;

export const STEM_ELEMENT: Record<HeavenlyStem, FiveElement> = {
    갑: "목", 을: "목",
    병: "화", 정: "화",
    무: "토", 기: "토",
    경: "금", 신: "금",
    임: "수", 계: "수",
};

/**
 * 지장간(地藏干) — 지지 속에 숨은 천간. 여기(餘氣) → 중기(中氣) → 정기(正氣) 순이며 마지막이 정기다.
 * 지지의 대표 오행·십성은 정기로 본다 — 지지 오행표를 따로 두지 않는 이유 (정기 오행 = 지지 오행)
 * 학파마다 다른 곳(신의 여기를 무/기로 보는 차이 등)은 가장 널리 쓰이는 표를 따랐다
 */
export const HIDDEN_STEMS: Record<EarthlyBranch, readonly HeavenlyStem[]> = {
    자: ["임", "계"],
    축: ["계", "신", "기"],
    인: ["무", "병", "갑"],
    묘: ["갑", "을"],
    진: ["을", "계", "무"],
    사: ["무", "경", "병"],
    오: ["병", "기", "정"],
    미: ["정", "을", "기"],
    신: ["무", "임", "경"],
    유: ["경", "신"],
    술: ["신", "정", "무"],
    해: ["무", "갑", "임"],
};
