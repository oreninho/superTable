export function toCamelCase(str: string): string {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_m, chr) => chr.toUpperCase());
}
