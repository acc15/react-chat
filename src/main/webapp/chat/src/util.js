

export function parseJsonOrNull(json) {
    try {
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}
