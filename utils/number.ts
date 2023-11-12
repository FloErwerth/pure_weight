export function truncateToNthSignificantDigit(number: number, toNumber?: true, n?: number): number;
export function truncateToNthSignificantDigit(number: number, toNumber?: false, n?: number): string;
export function truncateToNthSignificantDigit(number: number, toNumber?: boolean, n?: number): number | string {
  const numberString = number.toString();
  const dotIndex = numberString.indexOf(".");

  if (dotIndex === -1) {
    return number;
  }

  const significantDigits = numberString.substring(0, dotIndex + (n ?? 3));

  if (!toNumber) {
    return significantDigits;
  }

  return parseFloat(significantDigits);
}
