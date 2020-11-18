import isNumber from "./isNumber";


export function validateNumberType(valueName: string) {
    return (value: any) => {
        if (isNumber(value) === false) return [`"${valueName}" value should be number`]
        return []
    }
}

export function validateStringMax(valueName: string, max: number = 255) {
    return (value: any) => {
        if (value.length > max) return [`"${valueName}" value to long (max ${max})`]
        return []
    }
}