export default function isNumberic(str: string): boolean {
    return !isNaN(Number(str)) && !isNaN(parseFloat(str))
}