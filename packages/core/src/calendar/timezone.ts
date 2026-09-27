import type { CalendarDate, ClockTime } from "../types/saju.types";

/** 한국 표준시 변경(127.5° ↔ 135°)과 서머타임 이력은 전부 tz DB가 갖고 있다 — 직접 표를 만들지 않는다 */
const KOREA_TIME_ZONE = "Asia/Seoul";

const koreaWallClock = new Intl.DateTimeFormat("en-US", {
    timeZone: KOREA_TIME_ZONE,
    hourCycle: "h23",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
});

/** 해당 순간의 한국 UTC 오프셋(ms). 1908년 이전 지방시처럼 초 단위 오프셋도 그대로 반영된다 */
function koreaOffsetMsAt(utcMs: number): number {
    const parts = Object.fromEntries(
        koreaWallClock.formatToParts(new Date(utcMs)).map((part) => [part.type, Number(part.value)]),
    );
    const wallClockAsUtc = Date.UTC(
        parts.year!,
        parts.month! - 1,
        parts.day!,
        parts.hour!,
        parts.minute!,
        parts.second!,
    );
    const utcMsWithoutMillis = Math.floor(utcMs / 1000) * 1000;
    return wallClockAsUtc - utcMsWithoutMillis;
}

/**
 * 한국 벽시계 시각 → UTC 순간(ms).
 * 오프셋은 "UTC 순간"을 알아야 구할 수 있으므로, 추정 → 보정을 한 번 거친다.
 * 서머타임 시작 때 건너뛴 시각처럼 실재하지 않는 시각은 인접한 순간으로 옮겨진다.
 */
export function koreanWallClockToUtc(date: CalendarDate, time: ClockTime): number {
    const wallClockAsUtc = Date.UTC(date.year, date.month - 1, date.day, time.hour, time.minute);
    const estimated = wallClockAsUtc - koreaOffsetMsAt(wallClockAsUtc);
    return wallClockAsUtc - koreaOffsetMsAt(estimated);
}
