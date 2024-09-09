/**
 * Generate a random UUIDv4 string.
 * @internal
 */
export function generateUUIDv4(): string {
    const uuid: (number | string)[] = [];
    for (let i = 0; i < 36; i++) {
        uuid.push(Math.floor(Math.random() * 16));
    }

    uuid[14] = 4;
    uuid[19] = (uuid[19] as number) &= ~(1 << 2);
    uuid[19] = uuid[19] |= (1 << 3);
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-"; // Separators.
    return uuid.map((d) => d.toString(16)).join("");
}
