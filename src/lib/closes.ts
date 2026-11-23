export const PETITION_CLOSES = "2027-01-01T00:00:00.000Z";

export function petitionOpen(now = Date.now()) {
  return now < Date.parse(PETITION_CLOSES);
}
