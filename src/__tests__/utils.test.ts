import { generateUuid } from "../utils.ts";

describe("uuid", () => {
    it("should return a valid version 4 uuid", () => {
        const uuid = generateUuid();
        const separatorIndexes = [8, 13, 18, 23];
        for (let i = 0; i < uuid.length; i++) {
            if (separatorIndexes.includes(i)) {
                expect(uuid[i]).toEqual("-");
                continue;
            }

            // Version character.
            if (i === 14) {
                expect(uuid[i]).toEqual("4");
                continue;
            }

            expect(/^[0-9a-f]$/.test(uuid[i])).toBe(true);
        }

        // Seperators in the correct place.
        expect(uuid[8]).toEqual("-");
        expect(uuid[13]).toEqual("-");
        expect(uuid[18]).toEqual("-");
        expect(uuid[23]).toEqual("-");
    });

    it("should be a different value each time", () => {
        const uuids = new Set<string>();
        // 100 runs should be good enough.
        for (let i = 0; i < 100; i++) {
            uuids.add(generateUuid());
        }

        expect(uuids.size).toEqual(100);
    });
});
