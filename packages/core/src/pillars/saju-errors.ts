/** 입력 자체가 잘못됨 — 존재하지 않는 날짜, 범위를 벗어난 시각·경도 */
export class InvalidBirthError extends Error {
    override name = "InvalidBirthError";
}

/**
 * 시각 없이는 년주·월주를 정할 수 없음 — 출생일에 절기가 바뀌었다.
 * 임의 시각으로 채우면 틀린 결과를 확신 있게 내게 되므로 계산을 거절하고 시각을 요구한다.
 */
export class BirthTimeRequiredError extends Error {
    override name = "BirthTimeRequiredError";
}
