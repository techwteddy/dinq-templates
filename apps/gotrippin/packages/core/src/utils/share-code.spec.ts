import { generateShareCode, isValidShareCode } from "./share-code";

describe("share-code utilities", () => {
  describe("isValidShareCode", () => {
    test("accepts 8-character alphanumeric codes", () => {
      expect(isValidShareCode("abcd1234")).toBe(true);
      expect(isValidShareCode("ABCD1234")).toBe(true);
      expect(isValidShareCode("aA1bB2cC")).toBe(true);
    });

    test("rejects codes that are too short or too long", () => {
      expect(isValidShareCode("")).toBe(false);
      expect(isValidShareCode("abc")).toBe(false);
      expect(isValidShareCode("abcdefg")).toBe(false);
      expect(isValidShareCode("abcdefghi")).toBe(false);
    });

    test("rejects codes with non-alphanumeric characters", () => {
      expect(isValidShareCode("abcd-123")).toBe(false);
      expect(isValidShareCode("abcd 123")).toBe(false);
      expect(isValidShareCode("abcd_123")).toBe(false);
      expect(isValidShareCode("abcd.123")).toBe(false);
    });
  });

  describe("generateShareCode", () => {
    test("returns a string of the requested length (default 8)", () => {
      const code = generateShareCode();
      expect(code).toHaveLength(8);
      const custom = generateShareCode(12);
      expect(custom).toHaveLength(12);
    });

    test("uses only the documented alphabet", () => {
      const alphabet = /^[a-zA-Z0-9]+$/;
      for (let i = 0; i < 50; i += 1) {
        const code = generateShareCode();
        expect(code).toMatch(alphabet);
      }
    });

    test("default output is also accepted by isValidShareCode", () => {
      for (let i = 0; i < 25; i += 1) {
        expect(isValidShareCode(generateShareCode())).toBe(true);
      }
    });
  });
});
