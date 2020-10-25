export function isString(obj: any): obj is string {
    return typeof obj === "string" || obj instanceof String;
}