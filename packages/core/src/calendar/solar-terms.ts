import { SunPosition } from "astronomy-engine";

const FULL_CIRCLE_DEGREES = 360;
/** 입춘 = 태양 겉보기 황경 315°. 인월(寅月)이 여기서 시작한다 */
const LICHUN_LONGITUDE = 315;
/** 12절(節)은 황경 30°마다 온다 — 절기월 하나의 폭 */
const DEGREES_PER_SOLAR_MONTH = 30;
/** 자월(대설~소한)의 절기월 순번. 그다음 11이 축월(소한~입춘) */
const ZI_SOLAR_MONTH = 10;

/**
 * 해당 순간의 절기월 순번. 0 = 인월(입춘~경칩) … 10 = 자월 · 11 = 축월.
 * 절기 시각을 검색하는 대신 그 순간의 태양 황경을 직접 본다 — 같은 천문 계산이고 캐시가 필요 없다.
 */
export function solarMonthIndex(utcMs: number): number {
    const { elon } = SunPosition(new Date(utcMs));
    const degreesSinceLichun = (elon - LICHUN_LONGITUDE + FULL_CIRCLE_DEGREES) % FULL_CIRCLE_DEGREES;
    return Math.floor(degreesSinceLichun / DEGREES_PER_SOLAR_MONTH);
}

/** 자월·축월 — 양력 1~2월에 이 두 달이면 아직 입춘 전이다 */
export const isBeforeLichunMonth = (solarMonth: number) => solarMonth >= ZI_SOLAR_MONTH;
