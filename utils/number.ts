export function trunicateToNthSignificantDigit(number: number, toNumber?: true, n?: number): number;
export function trunicateToNthSignificantDigit(number: number, toNumber?: false, n?: number): string;
export function trunicateToNthSignificantDigit(number: number, toNumber?: boolean, n?: number): number | string {
    const numberString = number.toString();
    const dotIndex = numberString.indexOf(".");

    if (dotIndex === -1) {
        return number;
    }

    const significantDigits = numberString.substring(0, dotIndex + (n ?? 2) + 1);

    if (!toNumber) {
        if (n === 0) {
            return significantDigits.replace(".", "");
        }
        return significantDigits;
    }

    return parseFloat(significantDigits);
}
